"use client"

import { useLayoutEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mdx } from "@/components/mdx/mdx-components"
import { SpatialArchivePrototype } from "./scroll-spatial-archive-prototype"
import { InkCinemaPrototype } from "./scroll-ink-cinema-prototype"
import { KineticTypePrototype } from "./scroll-kinetic-type-prototype"
import { QuietSurrealismPrototype } from "./scroll-quiet-surrealism-prototype"
import { ImpactEndingPrototype } from "./manga-ending-impact-prototype"
import { TokyoEndingPrototype } from "./manga-ending-tokyo-prototype"
import { VolumeEndingPrototype } from "./manga-ending-volume-prototype"
import { CascadeEndingPrototype } from "./manga-ending-cascade-prototype"
import { VoidEndingPrototype } from "./manga-ending-void-prototype"
import type { PanelVariant, ScrollVariant } from "./scroll-study-types"
import "lenis/dist/lenis.css"
import "./scroll-home-prototype.css"

type Props = { code: string } & ({ study: "scroll"; variant: ScrollVariant } | { study: "panels"; variant: PanelVariant })

export function ScrollHomePrototype({ code, study, variant }: Props) {
  const selection = `${study}:${variant}`
  const previousSelection = useRef(selection)
  useLayoutEffect(() => {
    if (previousSelection.current !== selection) {
      // Reset after Lenis cleanup so its remaining motion cannot move the next hero.
      window.scrollTo({ top: 0, behavior: "instant" })
      previousSelection.current = selection
    }
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ duration: 1.05, anchors: true })
      const syncDialogScrollLock = () => {
        if (document.body.hasAttribute("data-scroll-locked")) lenis.stop()
        else lenis.start()
      }
      const dialogLock = new MutationObserver(syncDialogScrollLock)
      dialogLock.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] })
      syncDialogScrollLock()
      const tick = (time: number) => lenis.raf(time * 1000)
      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add(tick)
      return () => { dialogLock.disconnect(); gsap.ticker.remove(tick); lenis.off("scroll", ScrollTrigger.update); lenis.destroy() }
    })
    return () => media.revert()
  }, [selection])

  return <main className={`scroll-study scroll-study-${variant}${study === "panels" ? ` manga-ending-study manga-ending-study-${variant}` : ""}`}>
    {study === "panels"
      ? variant === "A" ? <ImpactEndingPrototype/> : variant === "B" ? <TokyoEndingPrototype/> : variant === "C" ? <VolumeEndingPrototype/> : variant === "D" ? <CascadeEndingPrototype/> : <VoidEndingPrototype/>
      : variant === "A" ? <SpatialArchivePrototype/> : variant === "B" ? <InkCinemaPrototype/> : variant === "C" ? <KineticTypePrototype/> : <QuietSurrealismPrototype/>}
    <section id="scroll-about" className="scroll-study-about" aria-labelledby="scroll-about-title"><h2 id="scroll-about-title">About & experience<span>.</span></h2><div className="prose-content"><Mdx code={code} className="mdx-shell-about"/></div><a className="scroll-study-resume" href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a></section>
  </main>
}
