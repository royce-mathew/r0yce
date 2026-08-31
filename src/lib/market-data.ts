export interface FearGreedIndex {
  score: number
  rating: string
  asOf: Date
}

export interface MarketQuote {
  symbol: "^VIX" | "^GSPC" | "^IXIC"
  label: "VIX" | "S&P 500" | "Nasdaq Composite"
  price: number
  change: number
  changePercent: number
  asOf: Date
}

export interface MarketSnapshot {
  retrievedAt: Date
  fearGreed: FearGreedIndex | null
  vix: MarketQuote | null
  sp500: MarketQuote | null
  nasdaq: MarketQuote | null
}

const CNN_FEAR_GREED_URL =
  "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
const YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart"
const REVALIDATE_SECONDS = 300
const CNN_REQUEST_HEADERS = {
  Accept: "application/json, text/plain, */*",
  Referer: "https://www.cnn.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
} satisfies HeadersInit

const QUOTES = [
  { symbol: "^VIX", label: "VIX" },
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^IXIC", label: "Nasdaq Composite" },
] as const
interface CnnResponse {
  fear_and_greed?: {
    score?: unknown
    rating?: unknown
    timestamp?: unknown
  }
}

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: unknown
        chartPreviousClose?: unknown
        previousClose?: unknown
        regularMarketTime?: unknown
      }
    }>
  }
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function parseIsoDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function parseEpochDate(value: unknown): Date | null {
  const seconds = finiteNumber(value)
  if (seconds === null || seconds <= 0) return null

  const date = new Date(seconds * 1000)
  return Number.isNaN(date.getTime()) ? null : date
}

async function fetchJson(url: string, headers?: HeadersInit): Promise<unknown> {
  const response = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!response.ok) throw new Error(`Market source returned ${response.status}`)
  return response.json() as Promise<unknown>
}

function decodeFearGreed(payload: unknown): FearGreedIndex | null {
  if (typeof payload !== "object" || payload === null) return null

  const sentiment = (payload as CnnResponse).fear_and_greed
  const score = finiteNumber(sentiment?.score)
  const rating = sentiment?.rating
  const asOf = parseIsoDate(sentiment?.timestamp)

  if (score === null || typeof rating !== "string" || !rating.trim() || !asOf) {
    return null
  }

  return { score, rating: rating.trim(), asOf }
}

function decodeQuote(
  payload: unknown,
  quote: (typeof QUOTES)[number]
): MarketQuote | null {
  if (typeof payload !== "object" || payload === null) return null

  const result = (payload as YahooChartResponse).chart?.result
  const meta = Array.isArray(result) ? result[0]?.meta : undefined
  const price = finiteNumber(meta?.regularMarketPrice)
  const previousClose =
    finiteNumber(meta?.chartPreviousClose) ?? finiteNumber(meta?.previousClose)
  const asOf = parseEpochDate(meta?.regularMarketTime)

  if (
    price === null ||
    previousClose === null ||
    previousClose === 0 ||
    !asOf
  ) {
    return null
  }

  const change = price - previousClose
  const changePercent = (change / previousClose) * 100

  if (!Number.isFinite(change) || !Number.isFinite(changePercent)) return null

  return {
    ...quote,
    price,
    change,
    changePercent,
    asOf,
  }
}

async function getFearGreed(): Promise<FearGreedIndex | null> {
  return decodeFearGreed(
    await fetchJson(CNN_FEAR_GREED_URL, CNN_REQUEST_HEADERS)
  )
}

async function getQuote(
  quote: (typeof QUOTES)[number]
): Promise<MarketQuote | null> {
  const symbol = encodeURIComponent(quote.symbol)
  const url = `${YAHOO_CHART_URL}/${symbol}?range=1mo&interval=1d`
  return decodeQuote(await fetchJson(url), quote)
}

function settledValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  const [fearGreed, vix, sp500, nasdaq] = await Promise.allSettled([
    getFearGreed(),
    getQuote(QUOTES[0]),
    getQuote(QUOTES[1]),
    getQuote(QUOTES[2]),
  ])

  return {
    retrievedAt: new Date(),
    fearGreed: settledValue(fearGreed),
    vix: settledValue(vix),
    sp500: settledValue(sp500),
    nasdaq: settledValue(nasdaq),
  }
}
