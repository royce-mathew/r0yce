import type { Metadata } from "next"
import type { MarketQuote } from "@/lib/market-data"
import { getMarketSnapshot } from "@/lib/market-data"

const description =
  "A live snapshot of US market sentiment, volatility, and index performance."

export const metadata: Metadata = {
  title: "Market State — r0yce",
  description,
  alternates: {
    canonical: "https://r0yce.com/market-state",
  },
  openGraph: {
    url: "https://r0yce.com/market-state",
    type: "website",
    title: "Market State — r0yce",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Market State — r0yce",
    description,
  },
}

const marketTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

const quoteFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const signedQuoteFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
})

const scoreFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
})

function formatMarketTime(date: Date) {
  return `${marketTimeFormatter.format(date)} ET`
}

function MetricUnavailable() {
  return (
    <div className="mt-8 flex min-h-36 items-center border-y border-border/40 py-6">
      <div>
        <p className="label-editorial">Source offline</p>
        <p className="mt-2 font-display text-3xl">Unavailable</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The source did not return a current value.
        </p>
      </div>
    </div>
  )
}

function SourceTime({ source, asOf }: { source: string; asOf: Date }) {
  return (
    <p className="mt-5 font-mono text-[0.6875rem] leading-relaxed text-muted-foreground tabular-nums">
      Source: {source} · As of {formatMarketTime(asOf)}
    </p>
  )
}

function FearGreedGauge({ score, rating }: { score: number; rating: string }) {
  const position = Math.min(100, Math.max(0, score))
  const angle = Math.PI - (position / 100) * Math.PI
  const x1 = 120 + Math.cos(angle) * 76
  const y1 = 120 - Math.sin(angle) * 76
  const x2 = 120 + Math.cos(angle) * 100
  const y2 = 120 - Math.sin(angle) * 100
  const label = `Fear and Greed score ${scoreFormatter.format(score)} out of 100, rated ${rating}`

  return (
    <div className="mt-10">
      <svg
        viewBox="0 0 240 132"
        role="img"
        aria-label={label}
        className="mx-auto block w-full max-w-lg"
      >
        <title>{label}</title>
        <path
          d="M 20 120 A 100 100 0 0 1 220 120"
          fill="none"
          strokeLinecap="round"
          strokeWidth="12"
          className="stroke-border"
        />
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeLinecap="round"
          strokeWidth="3"
          className="stroke-primary"
        />
      </svg>

      <div className="-mt-5 text-center">
        <p className="font-mono text-5xl leading-none tabular-nums md:text-6xl">
          {scoreFormatter.format(score)}
          <span className="ml-1 text-lg text-muted-foreground">/100</span>
        </p>
        <p className="text-gold-ink mt-3 font-display text-2xl">{rating}</p>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-2 border-t border-border/40 pt-3 text-center text-[0.625rem] leading-tight text-muted-foreground sm:text-xs">
        <span>Extreme fear</span>
        <span>Fear</span>
        <span>Neutral</span>
        <span>Greed</span>
        <span>Extreme greed</span>
      </div>
    </div>
  )
}

function QuoteChange({ quote }: { quote: MarketQuote }) {
  const color =
    quote.change >= 0 ? "text-market-positive" : "text-market-negative"

  return (
    <p className={`mt-3 font-mono text-sm tabular-nums md:text-base ${color}`}>
      {signedQuoteFormatter.format(quote.change)} (
      {signedQuoteFormatter.format(quote.changePercent)}%) today
    </p>
  )
}

function EquityRow({
  label,
  quote,
}: {
  label: MarketQuote["label"]
  quote: MarketQuote | null
}) {
  return (
    <div className="border-b border-border/40 py-6 first:border-t">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div>
          <h3 className="font-display text-2xl">{label}</h3>
          {quote ? (
            <p className="mt-1 text-xs text-muted-foreground">
              US equity index
            </p>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Unavailable</p>
              <p>The source did not return a current value.</p>
            </div>
          )}
        </div>
        {quote && (
          <div className="sm:text-right">
            <p className="font-mono text-2xl tabular-nums">
              {quoteFormatter.format(quote.price)}
            </p>
            <QuoteChange quote={quote} />
          </div>
        )}
      </div>
      {quote && <SourceTime source="Yahoo Finance" asOf={quote.asOf} />}
    </div>
  )
}

export default async function MarketStatePage() {
  const snapshot = await getMarketSnapshot()
  const allUnavailable =
    !snapshot.fearGreed && !snapshot.vix && !snapshot.sp500 && !snapshot.nasdaq

  return (
    <main className="flex min-h-screen flex-col">
      <section className="container mx-auto max-w-7xl px-6 pt-16 pb-10 md:px-8 md:pt-24 md:pb-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-editorial text-gold-ink">US markets</span>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-6xl lg:text-7xl">
              Market state
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Sentiment, volatility, and major US equity indexes in one
              five-minute server snapshot. Public-source values may be delayed.
            </p>
          </div>
          <div className="shrink-0 border-l border-border/50 pl-5 md:mb-1 md:text-right">
            <p className="label-editorial">Snapshot retrieved</p>
            <p className="mt-2 font-mono text-xs text-foreground tabular-nums">
              {formatMarketTime(snapshot.retrievedAt)}
            </p>
          </div>
        </div>
        <div className="mt-10 h-px w-full bg-border/40" />
      </section>

      <div className="container mx-auto max-w-7xl px-6 pb-20 md:px-8 md:pb-28">
        {allUnavailable && (
          <aside className="mb-10 border-y border-border/40 py-5" role="status">
            <p className="font-display text-xl">Market sources unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No current values were returned. No substitute or sample data is
              shown.
            </p>
          </aside>
        )}

        <div className="grid grid-cols-1 border-y border-border/50 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <section className="border-b border-border/50 py-10 lg:border-r lg:pr-14 lg:pb-12">
            <p className="label-editorial">Sentiment</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Fear &amp; Greed
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              CNN&apos;s composite measure of how fear and greed are influencing
              US equities.
            </p>
            {snapshot.fearGreed ? (
              <>
                <FearGreedGauge
                  score={snapshot.fearGreed.score}
                  rating={snapshot.fearGreed.rating}
                />
                <SourceTime
                  source="CNN Fear & Greed"
                  asOf={snapshot.fearGreed.asOf}
                />
              </>
            ) : (
              <MetricUnavailable />
            )}
          </section>

          <section className="border-b border-border/50 py-10 lg:pb-12 lg:pl-14">
            <div className="flex items-start justify-between gap-8">
              <div>
                <p className="label-editorial">Volatility</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">VIX</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cboe Volatility Index
                </p>
              </div>
              <span className="text-gold-ink font-mono text-xs">^VIX</span>
            </div>
            {snapshot.vix ? (
              <div className="mt-10">
                <p className="font-mono text-5xl leading-none tabular-nums md:text-6xl">
                  {quoteFormatter.format(snapshot.vix.price)}
                </p>
                <QuoteChange quote={snapshot.vix} />
                <SourceTime source="Yahoo Finance" asOf={snapshot.vix.asOf} />
              </div>
            ) : (
              <MetricUnavailable />
            )}
          </section>

          <section className="py-10 lg:col-span-2 lg:py-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
              <div>
                <p className="label-editorial">Equity context</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">
                  Major indexes
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-right">
                Closing levels and daily movement for two broad measures of US
                equities.
              </p>
            </div>
            <div className="mt-8">
              <EquityRow label="S&P 500" quote={snapshot.sp500} />
              <EquityRow label="Nasdaq Composite" quote={snapshot.nasdaq} />
            </div>
          </section>
        </div>

        <footer className="mt-8 text-xs leading-relaxed text-muted-foreground">
          Data sourced from{" "}
          <a
            href="https://www.cnn.com/markets/fear-and-greed"
            target="_blank"
            rel="noreferrer"
            className="link-underline text-foreground"
          >
            CNN Fear &amp; Greed
          </a>{" "}
          and{" "}
          <a
            href="https://finance.yahoo.com/"
            target="_blank"
            rel="noreferrer"
            className="link-underline text-foreground"
          >
            Yahoo Finance
          </a>
          . Quotes may be delayed and are provided for market context only.
        </footer>
      </div>
    </main>
  )
}
