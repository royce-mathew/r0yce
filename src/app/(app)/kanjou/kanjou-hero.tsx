"use client"

/* Hallmark · genre: editorial · macrostructure: Workbench · theme: r0yce house system
 * (warm dark paper · champagne gold accent · Instrument Serif display)
 * hero: H2 Split diptych · knobs: ratio=7/5, right=live document surface, divider=hairline
 * enrichment: Tier-A CSS/JS document surface (no re-drawn browser or device chrome)
 * nav / footer: owned globally by (app)/layout.tsx — untouched by this redesign
 * pre-emit critique: P5 H5 E4 S5 R4 V5
 */
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"

/* Two writers, one paragraph — the claim the page opens on, demonstrated
   rather than asserted. Types itself once on load, then settles. */
const AUTHORS = [
  {
    name: "Royce",
    caret: "bg-foreground/70",
    flag: "border-border text-foreground",
  },
  {
    name: "Amara",
    caret: "bg-primary",
    flag: "border-primary/50 text-gold-ink",
  },
] as const

const SCRIPT = [
  { author: 0, text: "Two of us are typing in this paragraph right now." },
  { author: 1, text: "Neither of us is overwriting the other." },
] as const

const TOTAL = SCRIPT.reduce((sum, line) => sum + line.text.length, 0)

const EASE = [0.19, 1, 0.22, 1] as const

function Caret({ author }: { author: 0 | 1 }) {
  const { name, caret, flag } = AUTHORS[author]
  return (
    <span className="relative inline-block align-text-bottom">
      <span
        aria-hidden
        className={`inline-block h-[1.15em] w-px translate-y-[0.15em] animate-caret-blink ${caret}`}
      />
      <span
        className={`absolute -top-4 left-0 rounded-xs border bg-background px-1.5 py-px text-[9px] leading-none font-medium tracking-[0.08em] whitespace-nowrap uppercase ${flag}`}
      >
        {name}
      </span>
    </span>
  )
}

function DocumentSurface() {
  const reduceMotion = useReducedMotion()
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reduceMotion) {
      setTyped(TOTAL)
      return
    }

    let frame = 0
    const start = window.setTimeout(() => {
      frame = window.setInterval(() => {
        setTyped((n) => {
          if (n >= TOTAL) {
            window.clearInterval(frame)
            return n
          }
          return n + 1
        })
      }, 26)
    }, 1100)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(frame)
    }
  }, [reduceMotion])

  // Split the running character count across the scripted lines.
  let budget = typed
  const lines = SCRIPT.map((line) => {
    const shown = Math.max(0, Math.min(line.text.length, budget))
    budget -= line.text.length
    return { ...line, shown }
  })

  const writingIndex = lines.findIndex((line) => line.shown < line.text.length)
  const finished = writingIndex === -1

  return (
    <div className="relative">
      {/* Corner marks — the house frame language, borrowed from the home hero */}
      <div className="pointer-events-none absolute -top-3 -left-3 h-5 w-px bg-primary/30" />
      <div className="pointer-events-none absolute -top-3 -left-3 h-px w-5 bg-primary/30" />
      <div className="pointer-events-none absolute -right-3 -bottom-3 h-5 w-px bg-primary/30" />
      <div className="pointer-events-none absolute -right-3 -bottom-3 h-px w-5 bg-primary/30" />

      <figure className="rounded-sm border border-border/60 bg-surface px-6 py-7 sm:px-8 sm:py-9">
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">
          Kickoff notes
        </h2>
        <p className="label-editorial mt-2">Draft · saving continuously</p>

        <div className="mt-6 h-px w-full bg-border/40" />

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {lines.map((line, index) => (
            <p key={line.text} className="min-h-[1.5em]">
              {line.text.slice(0, line.shown)}
              {(finished || index === writingIndex) && (
                <Caret author={line.author as 0 | 1} />
              )}
            </p>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4 font-mono text-[0.7rem] text-muted-foreground/70">
          <span className="tabular-nums">{typed} characters</span>
          <span>2 people here</span>
        </div>

        <figcaption className="sr-only">
          A document being written by two people at once, each with their own
          cursor.
        </figcaption>
      </figure>
    </div>
  )
}

export function KanjouHero() {
  return (
    <section className="container mx-auto max-w-7xl px-6 pt-16 pb-16 md:px-8 md:pt-24 md:pb-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        {/* Left — the argument */}
        <div>
          <motion.span
            className="label-editorial text-gold-ink block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            Kanjou · Collaborative Editor
          </motion.span>

          <motion.h1
            className="mt-5 font-display text-5xl leading-[0.95] tracking-tight [overflow-wrap:anywhere] sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          >
            <span className="block">Two cursors.</span>
            <span className="text-gold-ink block">One document.</span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          >
            Kanjou is a writing app where edits merge instead of queueing. Two
            people can sit in the same paragraph, type over each other, and both
            keep their words — the document is a CRDT, so there is no lock to
            wait for and no last-write-wins.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          >
            <Link
              href="/kanjou/docs"
              className="inline-flex min-h-11 items-center rounded-sm bg-primary px-6 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
            >
              Open the editor
            </Link>
            <Link
              href="/projects/kanjou"
              className="link-underline inline-flex min-h-11 items-center rounded-sm border border-border px-6 text-sm font-medium whitespace-nowrap text-foreground transition-colors duration-200 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
            >
              Read the build notes
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.7rem] tracking-wide text-muted-foreground/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
          >
            <span>Tiptap</span>
            <span aria-hidden className="text-border">
              /
            </span>
            <span>Yjs</span>
            <span aria-hidden className="text-border">
              /
            </span>
            <span>Firestore</span>
            <span aria-hidden className="text-border">
              /
            </span>
            <span>Next.js</span>
          </motion.div>
        </div>

        {/* Right — the claim, running */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
        >
          <DocumentSurface />
        </motion.div>
      </div>
    </section>
  )
}
