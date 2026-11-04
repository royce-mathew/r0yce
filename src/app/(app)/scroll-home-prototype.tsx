"use client"

import { useLayoutEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mdx } from "@/components/mdx/mdx-components"
import { SpatialArchivePrototype } from "./scroll-spatial-archive-prototype"
import { InkCinemaPrototype } from "./scroll-ink-cinema-prototype"
import { KineticTypePrototype } from "./scroll-kinetic-type-prototype"
import { QuietSurrealismPrototype } from "./scroll-quiet-surrealism-prototype"
import type { ScrollVariant, ScrollWork } from "./scroll-study-types"
import "lenis/dist/lenis.css"
import "./scroll-home-prototype.css"

export function ScrollHomePrototype({ code, works, variant }: { code: string; works: ScrollWork[]; variant: ScrollVariant }) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ duration: 1.05, anchors: true, autoToggle: true })
      const tick = (time: number) => lenis.raf(time * 1000)
      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add(tick)
      return () => { gsap.ticker.remove(tick); lenis.off("scroll", ScrollTrigger.update); lenis.destroy() }
    })
    return () => media.revert()
  }, [variant])

  return <main className={`scroll-study scroll-study-${variant}`}>
    {variant === "A" ? <SpatialArchivePrototype works={works}/> : variant === "B" ? <InkCinemaPrototype works={works}/> : variant === "C" ? <KineticTypePrototype works={works}/> : <QuietSurrealismPrototype works={works}/>}
    <section id="scroll-about" className="scroll-study-about" aria-labelledby="scroll-about-title"><h2 id="scroll-about-title">Behind the work<span>.</span></h2><div className="prose-content"><Mdx code={code} className="mdx-shell-about"/></div><a className="scroll-study-resume" href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a></section>
  </main>
}
