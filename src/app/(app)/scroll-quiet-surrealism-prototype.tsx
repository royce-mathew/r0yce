"use client"

import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollPortraitScene } from "./scroll-portrait-scene-prototype"
import type { ScrollSceneHandle } from "./scroll-portrait-scene-prototype"
import "./scroll-spatial-prototype.css"

export function QuietSurrealismPrototype() {
  const root = useRef<HTMLDivElement>(null)
  const scene = useRef<ScrollSceneHandle>(null)
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      const element = root.current!
      scene.current?.setProgress(0)
      if (context.conditions?.reduced) { element.dataset.progress = "reduced"; return }
      const pose = { progress: 0 }
      element.dataset.progress = "0"
      gsap.timeline({ scrollTrigger: { trigger: element.querySelector(".surreal-track"), start: () => `top ${innerWidth <= 760 ? 76 : 90}px`, end: "bottom bottom", scrub: .8 }, onUpdate() { scene.current?.setProgress(pose.progress); element.dataset.progress = pose.progress.toFixed(3) } })
        .to(pose, { progress: 1, duration: 1, ease: "none" }, 0)
        .to(element.querySelector(".surreal-name"), { y: -30, duration: 1, ease: "none" }, 0)
    }, root)
    return () => media.revert()
  }, [])

  return <div ref={root} data-scroll-prototype="D" className="surreal-prototype">
    <section className="surreal-track" aria-label="An introduction, in fragments"><div className="surreal-stage">
      <p className="surreal-topline">Based in Canada</p>
      <div className="surreal-scene"><ScrollPortraitScene ref={scene} mode="sculpture"/></div>
      <div className="surreal-name"><h1 aria-label="Royce Mathew">Royce <em>Mathew.</em></h1><p>Software Developer<br/>AI Developer / Game Developer</p></div>
      <div className="surreal-bottom"><a href="#scroll-about">A little about me ↓</a><Link href="/projects?study=scroll&variant=D">Projects ↗</Link><a href="mailto:royce1mathew@gmail.com">Say hello ↗</a></div>
    </div></section>
  </div>
}
