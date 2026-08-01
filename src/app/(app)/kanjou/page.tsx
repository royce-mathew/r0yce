import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { KanjouHero } from "./kanjou-hero"

export const metadata: Metadata = {
  title: "Kanjou — Collaborative Editor",
  description:
    "Kanjou is a realtime collaborative writing app. Edits merge instead of queueing — two people can type in the same paragraph and both keep their words.",
  keywords: [
    "kanjou",
    "collaborative editor",
    "realtime",
    "crdt",
    "yjs",
    "tiptap",
    "firebase",
    "markdown",
    "latex",
    "royce mathew",
  ],
  openGraph: {
    url: "https://r0yce.com/kanjou",
    type: "website",
    title: "Kanjou — Collaborative Editor",
    description:
      "A realtime collaborative writing app. Edits merge instead of queueing — two people can type in the same paragraph and both keep their words.",
    images: [
      {
        url: "https://r0yce.com/images/KanjouDocuments.png",
        width: 2048,
        height: 1410,
        alt: "The Kanjou document index",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanjou — Collaborative Editor",
    description:
      "A realtime collaborative writing app. Edits merge instead of queueing.",
    images: ["https://r0yce.com/images/KanjouDocuments.png"],
  },
  alternates: {
    canonical: "https://r0yce.com/kanjou",
  },
}

/* Every row below is a real input rule or shortcut registered in
   src/components/tiptap/utils/extensions.ts — nothing aspirational. */
const inputRules: { type: string; gives: string; note?: string }[] = [
  {
    type: "# ",
    gives: "Heading",
    note: "Four levels, h1 through h4",
  },
  {
    type: "**bold**",
    gives: "Bold",
    note: "*italic*, ~~strike~~ and `code` behave the same way",
  },
  {
    type: "- ",
    gives: "Bulleted list",
    note: "Tab nests the item, Shift-Tab lifts it back out",
  },
  {
    type: "1. ",
    gives: "Numbered list",
  },
  {
    type: "> ",
    gives: "Blockquote",
  },
  {
    type: "```",
    gives: "Code block",
    note: "Shiki highlights it; Tab indents by two spaces",
  },
  {
    type: "$x^2$",
    gives: "Inline maths",
    note: "Rendered with KaTeX — click an expression to evaluate it",
  },
  {
    type: "---",
    gives: "Horizontal rule",
  },
  {
    type: "-- and ...",
    gives: "– and …",
    note: "Dashes, ellipses and quotes are corrected as you type",
  },
  {
    type: "⌘P",
    gives: "Print the document",
    note: "Ctrl P on Windows — prints the document view, not the page",
  },
]

const pipeline: { stage: string; title: string; body: string }[] = [
  {
    stage: "1.0",
    title: "The keystroke lands locally.",
    body: "Tiptap applies the edit to your copy of the document straight away. Nothing waits on a round trip, so there is no gap between pressing a key and seeing the letter.",
  },
  {
    stage: "2.0",
    title: "Yjs turns it into an operation.",
    body: "Not “paragraph three now reads this”, but a small position-independent change that stays correct no matter what order it arrives in.",
  },
  {
    stage: "3.0",
    title: "Every open copy applies it.",
    body: "Order-independence is what makes two people in one paragraph safe. Both edits survive, and every screen converges on the same text without anyone taking a lock.",
  },
  {
    stage: "4.0",
    title: "Firestore keeps the record.",
    body: "The provider writes the merged state back to the database. Close the tab, reopen it next week, and the document picks up exactly where it was left.",
  },
]

export default function KanjouIntroduction() {
  return (
    <main className="flex min-h-screen flex-col">
      <KanjouHero />

      {/* ─── The workspace ─── */}
      <section className="container mx-auto max-w-7xl px-6 pt-8 pb-20 md:px-8 md:pt-12 md:pb-28">
        <div className="h-px w-full bg-border/30" />

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:gap-14">
          <figure className="order-2 lg:order-1">
            {/* Shot to frame, so no crop is needed here. */}
            <div className="overflow-hidden rounded-sm border border-border/60 bg-surface">
              <Image
                src="/images/KanjouDocuments.png"
                alt="The Kanjou document index: two starting points above a ruled list of documents, each showing when it was last opened."
                width={2048}
                height={1410}
                loading="lazy"
                className="h-auto w-full"
                sizes="(min-width: 1024px) 60rem, 100vw"
              />
            </div>
            <figcaption className="mt-4 text-sm text-muted-foreground/70">
              Everything you own, most recently opened first.
            </figcaption>
          </figure>

          <div className="order-1 space-y-8 lg:order-2 lg:pt-2">
            <h2 className="font-display text-3xl leading-tight md:text-4xl">
              You start from a blank page or a maths preset.
            </h2>
            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Templates sit across the top of the index. The blank one is
                empty; the maths preset arrives with LaTeX examples already in
                it, which is the fastest way to see the editor doing something
                interesting.
              </p>
              <p>
                Below that is every document you own, sorted by when you last
                opened it. Rename or delete from the row itself — there is no
                settings screen to go and find.
              </p>
              <p>
                Send someone the link to a document and they land in the same
                file you are in. Their cursor shows up in your paragraph,
                labelled with their name, and moves while they type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What you type / what you get ─── */}
      <section className="border-y border-border/30 bg-surface">
        <div className="container mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <h2 className="max-w-2xl font-display text-3xl leading-tight md:text-4xl">
            The keyboard is the whole interface.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            There is a toolbar, and you can ignore it. Markdown syntax is
            rewritten into formatting the moment you finish typing it.
          </p>

          <dl className="mt-12 max-w-4xl border-t border-border/40">
            {inputRules.map((rule) => (
              <div
                key={rule.type}
                className="grid grid-cols-1 gap-1 border-b border-border/40 py-4 md:grid-cols-[minmax(0,8rem)_minmax(0,11rem)_minmax(0,1fr)] md:items-baseline md:gap-6"
              >
                <dt className="text-gold-ink font-mono text-sm tabular-nums">
                  {rule.type}
                </dt>
                <dd className="text-sm text-foreground md:text-base">
                  {rule.gives}
                </dd>
                <dd className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                  {rule.note ?? ""}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── What happens to a keystroke ─── */}
      <section className="container mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <h2 className="max-w-2xl font-display text-3xl leading-tight md:text-4xl">
          What happens to a keystroke.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          The interesting part of Kanjou is not the editor, it is what sits
          underneath it. Four steps, in order, every time you press a key.
        </p>

        <ol className="mt-14 max-w-3xl">
          {pipeline.map((step, index) => (
            <li
              key={step.stage}
              className="grid grid-cols-1 gap-2 border-t border-border/40 py-8 md:grid-cols-[minmax(0,5rem)_minmax(0,1fr)] md:gap-8"
            >
              <span className="text-gold-ink font-mono text-sm tabular-nums">
                {step.stage}
              </span>
              <div>
                <h3 className="font-display text-xl md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {step.body}
                </p>
              </div>
              {index === pipeline.length - 1 && (
                <span className="sr-only">End of sequence.</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ─── Close ─── */}
      <section className="container mx-auto max-w-7xl px-6 pb-24 md:px-8 md:pb-32">
        <div className="border-t border-border/30 pt-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl leading-tight md:text-4xl">
                It is running right now.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                Kanjou is one of my own projects, not a product. Signing in
                creates your document list; nothing else is asked for. The
                source, including the parts I got wrong first, is on GitHub.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/kanjou/docs"
                className="inline-flex min-h-11 items-center rounded-sm bg-primary px-6 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
              >
                Open the editor
              </Link>
              <Link
                href="https://github.com/royce-mathew/r0yce"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex min-h-11 items-center rounded-sm border border-border px-6 text-sm font-medium whitespace-nowrap text-foreground transition-colors duration-200 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
              >
                View the source
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
