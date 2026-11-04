"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollPortraitScene } from "./scroll-portrait-scene-prototype"
import type { ScrollSceneHandle } from "./scroll-portrait-scene-prototype"
import type { ScrollWork } from "./scroll-study-types"
import "./scroll-spatial-prototype.css"

export function SpatialArchivePrototype({ works }: { works: ScrollWork[] }) {
  const root = useRef<HTMLDivElement>(null)
  const scene = useRef<ScrollSceneHandle>(null)
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      const element = root.current!
      if (context.conditions?.reduced) { element.dataset.progress = "reduced"; return }
      const pose = { progress: 0 }
      const timeline = gsap.timeline({ scrollTrigger: { trigger: element.querySelector(".archive-track"), start: () => `top ${innerWidth <= 760 ? 76 : 90}px`, end: "bottom bottom", scrub: .6 }, onUpdate() { scene.current?.setProgress(pose.progress); element.dataset.progress = pose.progress.toFixed(3) } })
      timeline.to(pose, { progress: 1, ease: "none", duration: 1 }, 0)
        .to(element.querySelector(".archive-identity"), { y: -60, opacity: 0, duration: .24 }, .03)
        .fromTo(element.querySelectorAll(".archive-gallery-title"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .16, stagger: .38 }, .3)
        .to(element.querySelector(".archive-gallery-title"), { opacity: 0, y: -25, duration: .12 }, .62)
      gsap.from(element.querySelectorAll(".archive-work"), { y: 65, opacity: .35, stagger: .15, scrollTrigger: { trigger: element.querySelector(".archive-work-list"), start: "top 90%", end: "top 35%", scrub: .5 } })
    }, root)
    return () => media.revert()
  }, [])

  return <div ref={root} data-scroll-prototype="A" className="archive-prototype">
    <section className="archive-track" aria-label="Introduction and spatial gallery">
      <div className="archive-stage">
        <div className="archive-identity"><p className="archive-index">Royce Mathew / Canada</p><h1 aria-label="Royce Mathew">Royce<br/>Mathew<span>.</span></h1><p className="archive-roles">Software Developer<br/>Data Scientist<br/>Game Developer</p></div>
        <div className="archive-scene"><ScrollPortraitScene ref={scene} mode="archive" works={works}/></div>
        <div className="archive-gallery-titles" aria-hidden="true">{works.map((work, index) => <div className="archive-gallery-title" key={work.slug}><span>0{index + 1} / Selected work</span><p>{work.title}</p></div>)}</div>
        <div className="archive-stage-footer"><span className="archive-stage-coordinate" aria-hidden="true">01 — 03 / Spatial archive</span><a href="#scroll-selected-work">Explore work <span aria-hidden="true">↓</span></a><a href="mailto:royce1mathew@gmail.com">Get in touch ↗</a></div>
      </div>
    </section>
    <section id="scroll-selected-work" className="archive-work-list" aria-labelledby="archive-work-heading"><div className="archive-work-heading"><h2 id="archive-work-heading">Selected work<span> / </span></h2><Link href="/projects?study=scroll&variant=A">All projects ↗</Link></div>
      {works.map((work, index) => <Link className="archive-work" href={`/${work.slug}?study=scroll&variant=A`} key={work.slug}><div className="archive-work-meta"><span>0{index + 1}</span><h3>{work.title}</h3><span aria-hidden="true">↗</span></div><div className="archive-work-picture"><Image src={work.imageSrc} alt="" width={1400} height={880} sizes="(max-width: 760px) 90vw, 80vw"/></div><p>{work.description}</p></Link>)}
    </section>
  </div>
}
