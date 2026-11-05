"use client"

import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollPortraitScene } from "./scroll-portrait-scene-prototype"
import type { ScrollSceneHandle } from "./scroll-portrait-scene-prototype"
import "./scroll-spatial-prototype.css"

export function SpatialArchivePrototype() {
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
      gsap.timeline({ scrollTrigger: { trigger: element.querySelector(".archive-track"), start: () => `top ${innerWidth <= 760 ? 76 : 90}px`, end: "bottom bottom", scrub: .6 }, onUpdate() { scene.current?.setProgress(pose.progress); element.dataset.progress = pose.progress.toFixed(3) } })
        .to(pose, { progress: 1, ease: "none", duration: 1 }, 0)
        .to(element.querySelector(".archive-identity"), { y: -24, duration: 1, ease: "none" }, 0)
    }, root)
    return () => media.revert()
  }, [])

  return <div ref={root} data-scroll-prototype="A" className="archive-prototype">
    <section className="archive-track" aria-label="A portrait in panels">
      <div className="archive-stage">
        <div className="archive-scene"><ScrollPortraitScene ref={scene} mode="archive"/></div>
        <div className="archive-page-rule" aria-hidden="true"/>
        <div className="archive-identity"><p className="archive-index">Based in Canada</p><h1 aria-label="Royce Mathew">Royce<br/>Mathew<span>.</span></h1><p className="archive-roles">Software Developer<br/>AI Developer<br/>Game Developer</p></div>
        <div className="archive-stage-footer"><a href="#scroll-about">Meet Royce <span aria-hidden="true">↓</span></a><Link href="/projects?study=scroll&variant=A">Projects ↗</Link><a href="mailto:royce1mathew@gmail.com">Get in touch ↗</a></div>
      </div>
    </section>
  </div>
}
