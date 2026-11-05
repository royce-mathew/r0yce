"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CreationHandsPrototype } from "./creation-hands-prototype"
import "./manga-ending-void-prototype.css"

export function VoidEndingPrototype() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)", reduced: "(prefers-reduced-motion: reduce)", short: "(max-height: 700px)" }, context => {
      const navigation = gsap.utils.toArray<HTMLElement>(".me-void-navigation", element)
      const release = () => navigation.forEach(panel => { panel.inert = false })
      if (context.conditions?.reduced || context.conditions?.short) {
        element.dataset.progress = context.conditions.reduced ? "reduced" : "static"
        release()
        return release
      }
      const mobile = context.conditions?.mobile
      const stage = element.querySelector<HTMLElement>(".me-void-stage")!
      const portrait = element.querySelector<HTMLElement>(".me-void-portrait")!
      navigation.forEach(panel => { panel.inert = true })
      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: element.querySelector(".me-void-track"),
          start: `top ${mobile ? 76 : 90}px`,
          end: "bottom bottom",
          scrub: .7,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          navigation.forEach(panel => { panel.inert = timeline.time() < 1.15 })
          element.dataset.progress = timeline.progress().toFixed(3)
        },
      })
      timeline
        .fromTo(".me-void-name", { y: () => stage.clientHeight * .25, scale: mobile ? 1.65 : 1.85 }, { y: 0, scale: 1, duration: .72 }, 0)
        .fromTo(".me-void-name-first", { xPercent: -8 }, { xPercent: -23, duration: .28 }, 0)
        .to(".me-void-name-first", { xPercent: 0, duration: .44 }, .28)
        .fromTo(".me-void-name-last", { xPercent: 8 }, { xPercent: 23, duration: .28 }, 0)
        .to(".me-void-name-last", { xPercent: 0, duration: .44 }, .28)
        .fromTo(portrait, { x: () => (stage.clientWidth - portrait.offsetWidth) / 2 - portrait.offsetLeft, y: () => -stage.clientHeight * .12, clipPath: "inset(0 36% 0 36%)", scale: 1.2 }, { x: 0, y: 0, clipPath: "inset(0 0% 0 0%)", scale: 1, duration: .8 }, .04)
        .fromTo(".me-void-art-panel", { autoAlpha: 0, rotationX: -45, y: 80 }, { autoAlpha: 1, rotationX: 0, y: 0, duration: .55 }, .25)
        .fromTo(".me-creation-adam", { x: -170, y: 40, rotation: -9, svgOrigin: "160 210" }, { x: 0, y: 0, rotation: 0, duration: .85 }, .32)
        .fromTo(".me-creation-creator", { x: 170, y: -30, rotation: 8, svgOrigin: "1080 190" }, { x: 0, y: 0, rotation: 0, duration: .85 }, .32)
        .fromTo(".me-creation-adam-index", { rotation: 12, svgOrigin: "477 161" }, { rotation: 0, duration: .55 }, .6)
        .fromTo(".me-creation-creator-index", { rotation: -8, svgOrigin: "801 196" }, { rotation: 0, duration: .55 }, .6)
        .fromTo(".me-creation-ink", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .6 }, .5)
        .fromTo(".me-creation-speed", { autoAlpha: 0, scale: 1.08, transformOrigin: "50% 50%" }, { autoAlpha: .22, scale: 1, duration: .5 }, .5)
        .fromTo(".me-creation-spark", { autoAlpha: 0, scale: .5, svgOrigin: "600 222" }, { autoAlpha: 1, scale: 1, duration: .25 }, .95)
        .fromTo(".me-void-reveal", { autoAlpha: 0, y: 35, rotationX: -12 }, { autoAlpha: 1, y: 0, rotationX: 0, duration: .4, stagger: .07 }, .5)
        .fromTo(".me-void-roles p", { x: -35, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .35, stagger: .08 }, .65)
        .fromTo(".me-void-orbit", { rotation: -65, scale: .7 }, { rotation: 0, scale: 1, duration: .8 }, .45)
        .to({}, { duration: .6 })
      return release
    }, element)
    return () => media.revert()
  }, [])

  return (
    <div ref={root} data-ending-prototype="E" data-progress="0" className="me-void">
      <section className="me-void-track manga-ending-track" aria-labelledby="me-void-name">
        <div className="me-void-stage manga-ending-stage">
          <h1 id="me-void-name" className="me-void-name" aria-label="Royce Mathew"><span className="me-void-name-first" aria-hidden="true">Royce</span><span className="me-void-name-last" aria-hidden="true">Mathew</span></h1>
          <div className="me-void-spread">
            <div className="me-void-art-panel"><CreationHandsPrototype /></div>
            <figure className="me-void-portrait"><Image src="/images/hero-manga-portrait-clean.webp" alt="Black-and-white manga portrait of Royce Mathew" fill preload sizes="(max-width: 767px) 40vw, 38vw" /></figure>
            <div className="me-void-roles me-void-reveal">
              <div className="me-void-orbit" aria-hidden="true" />
              <p><span>Software</span> Developer</p>
              <p><span>AI</span> Developer</p>
              <p><span>Game</span> Developer</p>
            </div>
            <div className="me-void-actions me-void-reveal">
              <div className="me-void-japanese" aria-hidden="true"><span lang="ja">創造</span><span lang="ja">遊び</span></div>
              <nav className="me-void-project me-void-navigation" aria-label="Projects"><Link href="/projects?study=panels&variant=E">Projects<span aria-hidden="true">↗</span></Link></nav>
            </div>
            <nav className="me-void-links me-void-navigation me-void-reveal" aria-label="Personal links">
              <a href="#scroll-about">About<span aria-hidden="true">↓</span></a>
              <a href="mailto:royce1mathew@gmail.com">Email<span aria-hidden="true">↗</span></a>
              <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé<span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
