const MAX_RESULTS_LIMIT = { min: 1, max: 100 }
const BATCH_SIZE_LIMIT = { min: 1, max: 50 }
const PLACE_DETAILS_CONCURRENCY = 5
const CHAIN_NAME_PATTERN =
  /\b(tim hortons|subway|mcdonald'?s|kfc|burger king|wendy'?s|starbucks|best buy|home depot|costco|walmart|shoppers drug mart|la quinta|travelodge|best western|cibc|rogers|sobeys|canadian tire|toys"?r"?us|ups store)\b/i

type SearchBusiness = {
  name: string
  place_id: string
  vicinity: string
  maps_url: string
  user_ratings_total: number
}

type DetailedBusiness = {
  placeId: string
  name: string
  mapsUrl: string
  links: Array<{ url: string; text: string }>
  phones: string[]
  textSnippet: string
  reason?: string
}

type BusinessDecision = DetailedBusiness & {
  status: "NO_WEBSITE" | "HAS_WEBSITE"
}

type Classification = {
  index: number
  status: "HAS_WEBSITE" | "NO_WEBSITE"
  reason: string
}

type GeminiClassificationResult = {
  classifications: Classification[]
  error?: string
}

type AnalysisSuccessPayload = {
  success: true
  totalAnalyzed: number
  noWebsiteCount: number
  hasWebsiteCount: number
  noWebsiteBusinesses: DetailedBusiness[]
  decisions: BusinessDecision[]
  txtReport: string
  csvReport: string
}

type AnalysisProgressPayload = {
  stage: "searching" | "details" | "classifying" | "done"
  searchedCount?: number
  detailsCompleted?: number
  detailsTotal?: number
  batchesCompleted?: number
  batchesTotal?: number
  noWebsiteCount?: number
  message?: string
}

type AnalysisEvent =
  | { type: "progress"; payload: AnalysisProgressPayload }
  | { type: "complete"; payload: AnalysisSuccessPayload }
  | { type: "error"; error: string }

type ProgressFn = (payload: AnalysisProgressPayload) => void

function coerceBoundedInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10)

  if (!Number.isFinite(numericValue)) {
    return fallback
  }

  const rounded = Math.trunc(numericValue)
  return Math.min(Math.max(rounded, min), max)
}

function sanitizeText(value: unknown): string {
  if (value == null) {
    return ""
  }

  return String(value)
}

function deepSanitize<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepSanitize(item)) as T
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        deepSanitize(nested),
      ])
    ) as T
  }

  if (value == null) {
    return "" as T
  }

  return sanitizeText(value) as T
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractJsonBlock(input: string): string {
  const startIndex = input.indexOf("{")
  const endIndex = input.lastIndexOf("}")

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return input
  }

  return input.slice(startIndex, endIndex + 1)
}

function normalizeClassificationStatus(
  value: unknown
): Classification["status"] | null {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_")

  if (normalized === "HAS_WEBSITE") {
    return "HAS_WEBSITE"
  }

  if (normalized === "NO_WEBSITE") {
    return "NO_WEBSITE"
  }

  return null
}

function parseClassificationIndex(value: unknown): number | null {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10)

  if (!Number.isFinite(numericValue)) {
    return null
  }

  return Math.trunc(numericValue)
}

function parseGeminiClassifications(
  payload: unknown,
  batchSize: number
): Classification[] {
  const candidateItems = Array.isArray(payload)
    ? payload
    : Array.isArray(
          (payload as { classifications?: unknown[] })?.classifications
        )
      ? ((payload as { classifications: unknown[] }).classifications ?? [])
      : Array.isArray((payload as { results?: unknown[] })?.results)
        ? ((payload as { results: unknown[] }).results ?? [])
        : []

  const normalizedEntries = candidateItems
    .map((item) => {
      const shape = item as {
        index?: unknown
        status?: unknown
        reason?: unknown
      }

      let index = parseClassificationIndex(shape.index)
      const status = normalizeClassificationStatus(shape.status)
      const reason =
        sanitizeText(shape.reason).trim() || "No reason provided by AI."

      if (index === null || status === null) {
        return null
      }

      if (index < 0) {
        return null
      }

      return {
        index,
        status,
        reason,
      } satisfies Classification
    })
    .filter((item): item is Classification => item !== null)

  const shouldTreatAsZeroBased =
    normalizedEntries.length > 0 &&
    normalizedEntries.some((item) => item.index === 0) &&
    normalizedEntries.every((item) => item.index >= 0 && item.index < batchSize)

  const normalized = normalizedEntries
    .map((item) => {
      const resolvedIndex = shouldTreatAsZeroBased ? item.index + 1 : item.index

      if (resolvedIndex < 1 || resolvedIndex > batchSize) {
        return null
      }

      return {
        ...item,
        index: resolvedIndex,
      } satisfies Classification
    })
    .filter((item): item is Classification => item !== null)

  const dedupedByIndex = new Map<number, Classification>()
  for (const item of normalized) {
    if (!dedupedByIndex.has(item.index)) {
      dedupedByIndex.set(item.index, item)
    }
  }

  return Array.from(dedupedByIndex.values())
}

function buildTxtReport(businesses: DetailedBusiness[]): string {
  const lines: string[] = []
  lines.push("Businesses Without Websites (Classified by AI, Places API)")
  lines.push("=".repeat(60))
  lines.push("")

  businesses.forEach((business, index) => {
    lines.push(`${index + 1}. ${business.name}`)
    lines.push(`   Google Maps: ${business.mapsUrl}`)

    if (business.reason) {
      lines.push(`   AI Analysis: ${business.reason}`)
    }

    lines.push("")
  })

  return lines.join("\n")
}

function escapeCsvCell(value: string): string {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

function buildCsvReport(businesses: DetailedBusiness[]): string {
  const rows = ["Business Name,Google Maps URL,AI Analysis"]

  for (const business of businesses) {
    rows.push(
      [
        escapeCsvCell(business.name),
        escapeCsvCell(business.mapsUrl),
        escapeCsvCell(business.reason ?? "No analysis available"),
      ].join(",")
    )
  }

  return rows.join("\n")
}

function shouldKeepAsSmallBusiness(
  business: SearchBusiness,
  businessType: string
): boolean {
  if (CHAIN_NAME_PATTERN.test(business.name)) {
    return false
  }

  if (business.user_ratings_total > 450) {
    return false
  }

  if (businessType.trim()) {
    const typeNeedle = businessType.toLowerCase().trim()
    const haystack = `${business.name} ${business.vicinity}`.toLowerCase()

    if (!haystack.includes(typeNeedle)) {
      return false
    }
  }

  return true
}

async function geocodeLocation(location: string, placesApiKey: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json")
  url.searchParams.set("address", location)
  url.searchParams.set("key", placesApiKey)

  const response = await fetch(url.toString(), { cache: "no-store" })

  if (!response.ok) {
    return {
      error: `Geocoding request failed with status ${response.status}.`,
    }
  }

  const payload = (await response.json()) as {
    status?: string
    results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>
    error_message?: string
  }

  if (payload.status !== "OK" || !payload.results?.[0]?.geometry?.location) {
    return {
      error:
        payload.error_message ||
        `Could not geocode location. Status: ${payload.status ?? "unknown"}`,
    }
  }

  return {
    lat: payload.results[0].geometry.location.lat,
    lng: payload.results[0].geometry.location.lng,
  }
}

async function appendNearbySearchResults(
  businessesByPlaceId: Map<string, SearchBusiness>,
  params: {
    lat: number
    lng: number
    placesApiKey: string
    maxResults: number
    businessType: string
    keyword: string
  }
) {
  let nextPageToken: string | null = null

  while (businessesByPlaceId.size < params.maxResults * 2) {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    )

    url.searchParams.set("location", `${params.lat},${params.lng}`)
    url.searchParams.set("radius", "5000")
    url.searchParams.set("key", params.placesApiKey)

    if (params.businessType.trim()) {
      url.searchParams.set("type", params.businessType.trim())
    }

    if (params.keyword.trim()) {
      url.searchParams.set("keyword", params.keyword.trim())
    }

    if (nextPageToken) {
      url.searchParams.set("pagetoken", nextPageToken)
      await delay(2000)
    }

    const response = await fetch(url.toString(), { cache: "no-store" })
    if (!response.ok) {
      break
    }

    const payload = (await response.json()) as {
      results?: Array<{
        name?: string
        place_id?: string
        vicinity?: string
        user_ratings_total?: number
      }>
      next_page_token?: string
      status?: string
    }

    if (
      payload.status &&
      payload.status !== "OK" &&
      payload.status !== "ZERO_RESULTS"
    ) {
      break
    }

    for (const result of payload.results ?? []) {
      if (!result.place_id || !result.name) {
        continue
      }

      if (!businessesByPlaceId.has(result.place_id)) {
        businessesByPlaceId.set(result.place_id, {
          name: result.name,
          place_id: result.place_id,
          vicinity: result.vicinity ?? "",
          maps_url: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`,
          user_ratings_total: result.user_ratings_total ?? 0,
        })
      }

      if (businessesByPlaceId.size >= params.maxResults * 2) {
        break
      }
    }

    if (!payload.next_page_token) {
      break
    }

    nextPageToken = payload.next_page_token
  }
}

async function appendTextSearchResults(
  businessesByPlaceId: Map<string, SearchBusiness>,
  params: {
    location: string
    placesApiKey: string
    maxResults: number
    businessType: string
    smallBusinessFocus: boolean
  }
) {
  let nextPageToken: string | null = null
  const query = params.smallBusinessFocus
    ? `${params.businessType || "local business"} in ${params.location} independent`
    : `${params.businessType || "business"} in ${params.location}`

  while (businessesByPlaceId.size < params.maxResults * 3) {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/textsearch/json"
    )
    url.searchParams.set("query", query)
    url.searchParams.set("key", params.placesApiKey)

    if (nextPageToken) {
      url.searchParams.set("pagetoken", nextPageToken)
      await delay(2000)
    }

    const response = await fetch(url.toString(), { cache: "no-store" })
    if (!response.ok) {
      break
    }

    const payload = (await response.json()) as {
      results?: Array<{
        name?: string
        place_id?: string
        formatted_address?: string
        user_ratings_total?: number
      }>
      next_page_token?: string
      status?: string
    }

    if (
      payload.status &&
      payload.status !== "OK" &&
      payload.status !== "ZERO_RESULTS"
    ) {
      break
    }

    for (const result of payload.results ?? []) {
      if (!result.place_id || !result.name) {
        continue
      }

      if (!businessesByPlaceId.has(result.place_id)) {
        businessesByPlaceId.set(result.place_id, {
          name: result.name,
          place_id: result.place_id,
          vicinity: result.formatted_address ?? "",
          maps_url: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`,
          user_ratings_total: result.user_ratings_total ?? 0,
        })
      }

      if (businessesByPlaceId.size >= params.maxResults * 3) {
        break
      }
    }

    if (!payload.next_page_token) {
      break
    }

    nextPageToken = payload.next_page_token
  }
}

async function searchBusinessesInArea(
  location: string,
  businessType: string,
  maxResults: number,
  placesApiKey: string,
  smallBusinessFocus: boolean,
  progress: ProgressFn
): Promise<{ businesses: SearchBusiness[]; error?: string }> {
  progress({ stage: "searching", message: `Searching in ${location}` })

  const geocode = await geocodeLocation(location, placesApiKey)

  if ("error" in geocode) {
    return { businesses: [], error: geocode.error }
  }

  const businessesByPlaceId = new Map<string, SearchBusiness>()

  await appendNearbySearchResults(businessesByPlaceId, {
    lat: geocode.lat,
    lng: geocode.lng,
    placesApiKey,
    maxResults,
    businessType,
    keyword: smallBusinessFocus
      ? `${businessType || "local"} independent`
      : businessType,
  })

  await appendTextSearchResults(businessesByPlaceId, {
    location,
    placesApiKey,
    maxResults,
    businessType,
    smallBusinessFocus,
  })

  let businesses = Array.from(businessesByPlaceId.values())

  if (smallBusinessFocus) {
    businesses = businesses.filter((business) =>
      shouldKeepAsSmallBusiness(business, businessType)
    )

    businesses.sort((first, second) => {
      return first.user_ratings_total - second.user_ratings_total
    })
  }

  const limitedBusinesses = businesses.slice(0, maxResults)

  progress({
    stage: "searching",
    searchedCount: limitedBusinesses.length,
    message: `Found ${limitedBusinesses.length} candidate businesses`,
  })

  return { businesses: limitedBusinesses }
}

async function getBusinessDetailedInfo(
  business: SearchBusiness,
  placesApiKey: string
): Promise<DetailedBusiness> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json")
  url.searchParams.set("place_id", business.place_id)
  url.searchParams.set(
    "fields",
    "name,website,formatted_phone_number,formatted_address,url,review,user_ratings_total,types,geometry,photos,editorial_summary"
  )
  url.searchParams.set("key", placesApiKey)

  const response = await fetch(url.toString(), { cache: "no-store" })

  if (!response.ok) {
    return {
      placeId: business.place_id,
      name: business.name,
      mapsUrl: business.maps_url,
      links: [],
      phones: [],
      textSnippet: "",
    }
  }

  const payload = (await response.json()) as {
    result?: {
      website?: string
      formatted_phone_number?: string
      editorial_summary?: { overview?: string }
    }
  }

  const result = payload.result ?? {}

  const links: Array<{ url: string; text: string }> = []
  if (result.website) {
    links.push({ url: result.website, text: "Official Website" })
  }

  return {
    placeId: business.place_id,
    name: business.name,
    mapsUrl: business.maps_url,
    links,
    phones: result.formatted_phone_number
      ? [result.formatted_phone_number]
      : [],
    textSnippet: result.editorial_summary?.overview ?? "",
  }
}

async function getDetailedBusinessesWithConcurrency(
  businesses: SearchBusiness[],
  placesApiKey: string,
  progress: ProgressFn
): Promise<DetailedBusiness[]> {
  if (businesses.length === 0) {
    return []
  }

  const workerCount = Math.min(PLACE_DETAILS_CONCURRENCY, businesses.length)
  const details: Array<DetailedBusiness | undefined> = new Array(
    businesses.length
  )
  let cursor = 0
  let completed = 0

  progress({
    stage: "details",
    detailsCompleted: 0,
    detailsTotal: businesses.length,
    message: `Loading details with concurrency ${workerCount}`,
  })

  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < businesses.length) {
      const currentIndex = cursor
      cursor += 1

      const business = businesses[currentIndex]
      details[currentIndex] = await getBusinessDetailedInfo(
        business,
        placesApiKey
      )

      completed += 1
      progress({
        stage: "details",
        detailsCompleted: completed,
        detailsTotal: businesses.length,
        message: `Fetched details for ${business.name}`,
      })
    }
  })

  await Promise.all(workers)

  return details.filter(
    (business): business is DetailedBusiness => business !== undefined
  )
}

async function classifyBusinessesWithGemini(
  businessesBatch: DetailedBusiness[],
  geminiApiKey: string
): Promise<GeminiClassificationResult> {
  let prompt =
    "You are an expert at analyzing Google Maps business listings to determine if a business has an official website. " +
    "You will be given a list of businesses, each with name, place_id, Google Maps URL, links, phone numbers, and a text snippet.\n\n" +
    "A business HAS_WEBSITE if:\n" +
    "- There is a link to an official business website (not social media, review sites, or third-party platforms)\n" +
    "- The website is clearly related to the business\n" +
    "- The link is not Facebook, Instagram, TripAdvisor, Booking.com, Yelp, or similar\n" +
    "- The website is not Google Maps or Google Business Profile pages\n" +
    "- If unsure, classify as NO_WEBSITE\n\n" +
    "A business has NO_WEBSITE if:\n" +
    "- There are only social media links\n" +
    "- There are only phone numbers, addresses, or map links\n" +
    "- There are only third-party platform links\n" +
    "- There is no clear website reference or domain link\n" +
    "- If unsure, classify as NO_WEBSITE\n\n" +
    "Use 1-based index values and include exactly one classification for every business in the batch.\n\n" +
    "Respond strictly in JSON with this shape:\n" +
    "{\n" +
    '  "classifications": [\n' +
    '    {"index": 1, "status": "NO_WEBSITE", "reason": "Brief explanation"}\n' +
    "  ]\n" +
    "}\n\n"

  businessesBatch.forEach((business, index) => {
    const links = deepSanitize(business.links)
    const phones = deepSanitize(business.phones)

    prompt += `Business ${index + 1}: ${sanitizeText(business.name)}\n`
    prompt += `Place ID: ${sanitizeText(business.placeId)}\n`
    prompt += `Google Maps URL: ${sanitizeText(business.mapsUrl)}\n`
    prompt += `Links found: ${JSON.stringify(links, null, 2)}\n`
    prompt += `Phone numbers: ${JSON.stringify(phones)}\n`
    prompt += `Text snippet: ${sanitizeText(business.textSnippet).slice(0, 500)}\n`
    prompt += "---\n"
  })

  const url = new URL(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
  )
  url.searchParams.set("key", geminiApiKey)

  let lastError: string | undefined

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      })

      const payload = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{
              text?: string
            }>
          }
        }>
        error?: {
          message?: string
        }
      }

      const responseText =
        payload.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("") ?? ""

      if (!response.ok) {
        throw new Error(payload.error?.message || "Gemini request failed")
      }

      const parsed = JSON.parse(extractJsonBlock(responseText)) as unknown
      const classifications = parseGeminiClassifications(
        parsed,
        businessesBatch.length
      )

      if (classifications.length === 0) {
        throw new Error("Gemini returned no usable classifications")
      }

      return { classifications }
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : "Gemini request failed"

      if (attempt === 3) {
        return { classifications: [], error: lastError }
      }

      await delay(2 ** attempt * 1000)
    }
  }

  return { classifications: [], error: lastError }
}

async function runAnalysis(
  request: Request,
  progress: ProgressFn
): Promise<AnalysisSuccessPayload> {
  const body = (await request.json()) as {
    location?: string
    businessType?: string
    maxResults?: number
    batchSize?: number
    smallBusinessFocus?: boolean
  }

  const location = body.location?.trim() ?? ""
  const businessType = body.businessType?.trim() ?? ""
  const maxResults = coerceBoundedInteger(
    body.maxResults,
    MAX_RESULTS_LIMIT.min,
    MAX_RESULTS_LIMIT.max,
    50
  )
  const batchSize = coerceBoundedInteger(
    body.batchSize,
    BATCH_SIZE_LIMIT.min,
    BATCH_SIZE_LIMIT.max,
    10
  )
  const smallBusinessFocus = body.smallBusinessFocus ?? true

  if (!location) {
    throw new Error("Location is required.")
  }

  const geminiApiKey = process.env.GEMINI_API_KEY
  const placesApiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured.")
  }

  if (!placesApiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured.")
  }

  progress({
    stage: "searching",
    message: smallBusinessFocus
      ? "Searching for small business candidates"
      : "Searching for all businesses",
  })

  const { businesses, error } = await searchBusinessesInArea(
    location,
    businessType,
    maxResults,
    placesApiKey,
    smallBusinessFocus,
    progress
  )

  if (error || businesses.length === 0) {
    return {
      success: true,
      totalAnalyzed: 0,
      noWebsiteCount: 0,
      hasWebsiteCount: 0,
      noWebsiteBusinesses: [],
      decisions: [],
      txtReport: buildTxtReport([]),
      csvReport: buildCsvReport([]),
    }
  }

  const detailedBusinesses = await getDetailedBusinessesWithConcurrency(
    businesses,
    placesApiKey,
    progress
  )

  const decisionsByPlaceId = new Map<string, BusinessDecision>()
  const businessesWithoutWebsites: DetailedBusiness[] = []
  for (const business of detailedBusinesses) {
    decisionsByPlaceId.set(business.placeId, {
      ...business,
      status: business.links.length > 0 ? "HAS_WEBSITE" : "NO_WEBSITE",
      reason:
        business.links.length > 0
          ? "Google Places includes an official website for this listing."
          : "No official website was found in Google Places details for this listing.",
    })

    if (business.links.length === 0) {
      businessesWithoutWebsites.push({
        ...business,
        reason:
          "No official website was found in Google Places details for this listing.",
      })
    }
  }

  const businessesWithoutWebsitesByPlaceId = new Map<string, DetailedBusiness>(
    businessesWithoutWebsites.map((business) => [business.placeId, business])
  )
  const totalBatches = Math.ceil(detailedBusinesses.length / batchSize)

  for (let index = 0; index < detailedBusinesses.length; index += batchSize) {
    const batch = detailedBusinesses.slice(index, index + batchSize)
    const batchNumber = Math.floor(index / batchSize) + 1

    progress({
      stage: "classifying",
      batchesCompleted: batchNumber - 1,
      batchesTotal: totalBatches,
      noWebsiteCount: businessesWithoutWebsites.length,
      message: `Classifying batch ${batchNumber}/${totalBatches}`,
    })

    const { classifications, error: classificationError } =
      await classifyBusinessesWithGemini(batch, geminiApiKey)
    const classificationsByIndex = new Map<number, Classification>()
    for (const classification of classifications) {
      classificationsByIndex.set(classification.index, classification)
    }

    if (classificationError) {
      progress({
        stage: "classifying",
        batchesCompleted: batchNumber - 1,
        batchesTotal: totalBatches,
        noWebsiteCount: businessesWithoutWebsites.length,
        message: `AI unavailable for batch ${batchNumber}: ${classificationError}`,
      })
    }

    for (let indexInBatch = 0; indexInBatch < batch.length; indexInBatch += 1) {
      const business = batch[indexInBatch]
      const classification = classificationsByIndex.get(indexInBatch + 1)

      if (!business) {
        continue
      }

      const existingDecision = decisionsByPlaceId.get(business.placeId)

      if (!existingDecision) {
        continue
      }

      if (!classification) {
        if (business.links.length > 0) {
          existingDecision.status = "HAS_WEBSITE"
          existingDecision.reason = classificationError
            ? `AI unavailable (${classificationError}). Google Places includes an official website for this listing.`
            : "AI classification was unavailable, but Google Places includes an official website for this listing."
          businessesWithoutWebsitesByPlaceId.delete(business.placeId)
        } else {
          existingDecision.status = "NO_WEBSITE"
          existingDecision.reason = classificationError
            ? `AI unavailable (${classificationError}). No official website was found in Google Places details for this listing.`
            : "AI classification was unavailable, and no official website was found in Google Places details for this listing."
          businessesWithoutWebsitesByPlaceId.set(business.placeId, {
            ...business,
            reason: existingDecision.reason,
          })
        }
        continue
      }

      existingDecision.status = classification.status
      existingDecision.reason = classification.reason

      if (classification.status === "NO_WEBSITE") {
        businessesWithoutWebsitesByPlaceId.set(business.placeId, {
          ...business,
          reason: classification.reason,
        })
      } else {
        businessesWithoutWebsitesByPlaceId.delete(business.placeId)
      }
    }

    progress({
      stage: "classifying",
      batchesCompleted: batchNumber,
      batchesTotal: totalBatches,
      noWebsiteCount: businessesWithoutWebsites.length,
      message: `Completed batch ${batchNumber}/${totalBatches}`,
    })

    await delay(1200)
  }

  progress({
    stage: "done",
    detailsCompleted: detailedBusinesses.length,
    detailsTotal: detailedBusinesses.length,
    batchesCompleted: totalBatches,
    batchesTotal: totalBatches,
    noWebsiteCount: businessesWithoutWebsites.length,
    message: "Analysis complete",
  })

  const allDecisions = Array.from(decisionsByPlaceId.values())
  const hasWebsiteCount = allDecisions.filter(
    (decision) => decision.status === "HAS_WEBSITE"
  ).length
  const finalNoWebsiteBusinesses = Array.from(
    businessesWithoutWebsitesByPlaceId.values()
  )

  return {
    success: true,
    totalAnalyzed: detailedBusinesses.length,
    noWebsiteCount: finalNoWebsiteBusinesses.length,
    hasWebsiteCount,
    noWebsiteBusinesses: finalNoWebsiteBusinesses,
    decisions: allDecisions,
    txtReport: buildTxtReport(finalNoWebsiteBusinesses),
    csvReport: buildCsvReport(finalNoWebsiteBusinesses),
  }
}

export async function POST(request: Request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      const pushEvent = (event: AnalysisEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      }

      try {
        const payload = await runAnalysis(request, (progressPayload) => {
          pushEvent({ type: "progress", payload: progressPayload })
        })

        pushEvent({ type: "complete", payload })
      } catch (error) {
        pushEvent({
          type: "error",
          error:
            error instanceof Error
              ? error.message
              : "Unknown server error while running analysis.",
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
