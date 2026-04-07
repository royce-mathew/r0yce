import { NextResponse } from "next/server"

const SUGGESTIONS_CACHE_TTL_MS = 5 * 60 * 1000
const SUGGESTIONS_CACHE_MAX_ITEMS = 200

type SuggestionsCacheValue = {
  expiresAt: number
  suggestions: string[]
}

const suggestionsCache = new Map<string, SuggestionsCacheValue>()

type GooglePlacesAutocompleteResponse = {
  status?: string
  error_message?: string
  predictions?: Array<{
    description?: string
  }>
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

function getCachedSuggestions(query: string): string[] | null {
  const cacheKey = normalizeQuery(query)
  const cachedValue = suggestionsCache.get(cacheKey)

  if (!cachedValue) {
    return null
  }

  if (Date.now() >= cachedValue.expiresAt) {
    suggestionsCache.delete(cacheKey)
    return null
  }

  suggestionsCache.delete(cacheKey)
  suggestionsCache.set(cacheKey, cachedValue)

  return cachedValue.suggestions
}

function setCachedSuggestions(query: string, suggestions: string[]) {
  const cacheKey = normalizeQuery(query)

  suggestionsCache.set(cacheKey, {
    suggestions,
    expiresAt: Date.now() + SUGGESTIONS_CACHE_TTL_MS,
  })

  while (suggestionsCache.size > SUGGESTIONS_CACHE_MAX_ITEMS) {
    const firstEntry = suggestionsCache.keys().next()

    if (firstEntry.done) {
      break
    }

    suggestionsCache.delete(firstEntry.value)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")?.trim() ?? ""

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const cachedSuggestions = getCachedSuggestions(query)
  if (cachedSuggestions) {
    return NextResponse.json({ suggestions: cachedSuggestions })
  }

  const placesApiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!placesApiKey) {
    return NextResponse.json(
      {
        suggestions: [],
        error: "GOOGLE_PLACES_API_KEY is not configured.",
      },
      { status: 500 }
    )
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json"
  )
  url.searchParams.set("input", query)
  url.searchParams.set("types", "(regions)")
  url.searchParams.set("key", placesApiKey)

  const response = await fetch(url.toString(), { cache: "no-store" })

  if (!response.ok) {
    return NextResponse.json(
      {
        suggestions: [],
        error: `Autocomplete request failed with status ${response.status}.`,
      },
      { status: 502 }
    )
  }

  const payload =
    (await response.json()) as GooglePlacesAutocompleteResponse

  if (
    payload.status &&
    payload.status !== "OK" &&
    payload.status !== "ZERO_RESULTS"
  ) {
    return NextResponse.json(
      {
        suggestions: [],
        error:
          payload.error_message ||
          `Autocomplete status error: ${payload.status}`,
      },
      { status: 502 }
    )
  }

  const suggestions = (payload.predictions ?? [])
    .map((item) => item.description?.trim())
    .filter((item): item is string => Boolean(item))
    .slice(0, 8)

  setCachedSuggestions(query, suggestions)

  return NextResponse.json({ suggestions })
}
