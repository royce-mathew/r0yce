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

export function QuietSurrealismPrototype({ works }: { works: ScrollWork[] }) {
  const root = useRef<HTMLDivElement>(null)
  const scene = useRef<ScrollSceneHandle>(null)
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      const element = root.current!
      if (context.conditions?.reduced) { element.dataset.progress = "reduced"; return }
      const pose = { progress: 0 }
      gsap.timeline({ scrollTrigger: { trigger: element.querySelector(".surreal-track"), start: () => `top ${innerWidth <= 760 ? 76 : 90}px`, end: "bottom bottom", scrub: .8 }, onUpdate() { scene.current?.setProgress(pose.progress); element.dataset.progress = pose.progress.toFixed(3) } })
        .to(pose, { progress: 1, duration: 1, ease: "none" }, 0)
        .to(element.querySelector(".surreal-name"), { yPercent: -30, opacity: 0, duration: .45, ease: "none" }, 0)
        .to(element.querySelector(".surreal-halo"), { scale: 1.5, opacity: .25, duration: 1 }, 0)
        .fromTo(element.querySelector(".surreal-next"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .35 }, .6)
      for (const picture of element.querySelectorAll(".surreal-work-picture img")) {
        gsap.fromTo(picture, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: picture.parentElement, start: "top bottom", end: "bottom top", scrub: .7 } })
      }
    }, root)
    return () => media.revert()
  }, [])

  return <div ref={root} data-scroll-prototype="D" className="surreal-prototype">
    <section className="surreal-track" aria-label="Introduction"><div className="surreal-stage">
      <div className="surreal-halo" aria-hidden="true"/>
      <p className="surreal-topline">Royce Mathew <span>Based in Canada</span></p>
      <div className="surreal-scene"><ScrollPortraitScene ref={scene} mode="sculpture" works={works}/></div>
      <div className="surreal-name"><h1 aria-label="Royce Mathew">Royce<br/><em>Mathew.</em></h1><p>Software Developer<br/>Data Scientist / Game Developer</p></div>
      <div className="surreal-next" aria-hidden="true">Selected<br/><em>work.</em></div>
      <div className="surreal-bottom"><a href="#scroll-selected-work">Selected work <span aria-hidden="true">↓</span></a><a href="mailto:royce1mathew@gmail.com">Say hello ↗</a></div>
    </div></section>
    <section className="surreal-work-list" id="scroll-selected-work" aria-labelledby="surreal-work-heading"><div className="surreal-work-header"><h2 id="surreal-work-heading">Things I’ve<br/><em>put into the world.</em></h2><Link href="/projects?study=scroll&variant=D">All projects ↗</Link></div>
      {works.map((work, index) => <Link href={`/${work.slug}?study=scroll&variant=D`} key={work.slug} className="surreal-work"><div className="surreal-work-picture"><Image src={work.imageSrc} width={1400} height={880} alt="" sizes="(max-width: 760px) 90vw, 65vw"/></div><div className="surreal-work-caption"><span>0{index + 1}</span><h3>{work.title}</h3><span aria-hidden="true">↗</span></div><p>{work.description}</p></Link>)}
    </section>
  </div>
}
