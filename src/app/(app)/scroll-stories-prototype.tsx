"use client"

import { Suspense, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mdx } from "@/components/mdx/mdx-components"
import { StoryPrototypeSwitcher } from "@/components/custom/story-prototype-switcher"
import { StoryCanvasPrototype } from "./story-canvas-prototype"
import type { StoryVariant } from "./story-scene-prototype-types"
import "./scroll-stories-prototype.css"

// Three scroll-driven story worlds share the homepage through ?variant=A, B, or C.
const chapters = [
  { label: "Game development", title: "Worlds to play in.", body: "It started with the Roblox Engine. Building gameplay systems, inventory, NPC interactions, and interfaces for games including Project Star.", detail: "Gameplay / Systems / Interfaces" },
  { label: "Cloud engineering", title: "Systems that scale.", body: "At RBC, an internal application helped 50+ developers and compliance teams track vulnerability scores across 15,000+ enterprise devices.", detail: "Infrastructure / Identity / Automation" },
  { label: "Portfolio analytics", title: "Tools people depend on.", body: "At TD Asset Management, I build and scale applications for portfolio managers—from trade monitoring to data migrations and reporting.", detail: "Data / TypeScript / Analytics" },
  { label: "Always building", title: "The next page is open.", body: "Web, games, AI, and low-level systems. Experimenting, contributing to open source, and taking on the next technical challenge.", detail: "Software / AI / Games" },
] as const

function StoryDetails({ code }: { code: string }) {
  return <section className="story-details" id="story-details" aria-labelledby="story-details-title"><h2 id="story-details-title">About &amp; experience<span>.</span></h2><Mdx code={code} className="mdx-shell-about" /><a className="story-resume" href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a></section>
}

function StoryComparison({ code }: { code: string }) {
  const params = useSearchParams()
  const router = useRouter()
  const requested = params.get("variant")
  const variant: StoryVariant = requested === "B" || requested === "C" ? requested : "A"
  const change = useCallback((value: StoryVariant) => {
    const url = new URL(window.location.href)
    url.searchParams.set("variant", value)
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false })
  }, [router])

  useEffect(() => {
    console.info("[Three.js story prototype]", { variant, route: location.href, viewport: `${innerWidth}×${innerHeight}`, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches, palette: "ivory / ink / gold", chapters: chapters.map(chapter => chapter.label) })
  }, [variant])

  return <>
    <section id="scroll-about" className={`story-prototype story-prototype--${variant}`} data-story-variant={variant} aria-labelledby="story-title">
      <header className="story-intro"><span className="story-eyebrow">About / A story in four chapters</span><h2 id="story-title">Built one world<br />at a time<span>.</span></h2><a href="#story-details">Skip to full experience ↓</a></header>
      <div className="story-composition">
        <div className="story-viewport"><StoryCanvasPrototype variant={variant} /><div className="story-stage-caption" aria-hidden="true"><span>Scroll to turn the story</span><span className="story-current">01 / 04</span></div></div>
        <div className="story-chapters">{chapters.map((chapter, index) => <article className="story-chapter" key={chapter.label} id={`story-chapter-${index + 1}`}><div className="story-chapter-copy"><span className="story-chapter-number">{String(index + 1).padStart(2, "0")} / {chapter.label}</span><h3>{chapter.title}</h3><p>{chapter.body}</p><span className="story-chapter-detail">{chapter.detail}</span>{index === 3 && <Link href="/projects">Explore the projects ↗</Link>}</div></article>)}</div>
      </div>
    </section>
    <StoryDetails code={code} />
    <StoryPrototypeSwitcher variant={variant} onChange={change} />
  </>
}

export function ScrollStoriesPrototype({ code }: { code: string }) {
  return <Suspense fallback={<StoryDetails code={code} />}><StoryComparison code={code} /></Suspense>
}
