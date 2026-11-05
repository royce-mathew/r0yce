"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./manga-ending-cascade-prototype.css"

export function CascadeEndingPrototype() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)", mobile: "(max-width: 767px)", short: "(max-height: 680px)" }, context => {
      const panels = gsap.utils.toArray<HTMLElement>(".me-cascade-reveal", element)
      const navigation = gsap.utils.toArray<HTMLElement>(".me-cascade-navigation", element)
      const release = () => navigation.forEach(panel => { panel.inert = false })
      if (!context.conditions?.motion || context.conditions.short) {
        element.dataset.progress = context.conditions?.reduced ? "reduced" : "1"
        release()
        return release
      }
      const mobile = context.conditions.mobile
      const stage = element.querySelector<HTMLElement>(".me-cascade-stage")!
      const portrait = element.querySelector<HTMLElement>(".me-cascade-portrait")!
      navigation.forEach(panel => { panel.inert = true })
      const timeline = gsap.timeline({
        onUpdate: () => {
          const progress = timeline.progress()
          element.dataset.progress = progress.toFixed(3)
          navigation.forEach(panel => { panel.inert = progress < .67 })
        },
        scrollTrigger: {
          trigger: element.querySelector(".me-cascade-track"),
          start: `top ${mobile ? 76 : 90}px`,
          end: "bottom bottom",
          scrub: .65,
          invalidateOnRefresh: true,
        },
      })
      timeline
        .fromTo(".me-cascade-title", { y: () => stage.clientHeight * .3, scale: mobile ? 2.05 : 2.2 }, { y: 0, scale: 1, duration: .75, ease: "power2.inOut" }, 0)
        .fromTo(".me-cascade-first", { xPercent: -8 }, { xPercent: -24, duration: .3 }, 0)
        .to(".me-cascade-first", { xPercent: 0, duration: .45 }, .3)
        .fromTo(".me-cascade-last", { xPercent: 8 }, { xPercent: 24, duration: .3 }, 0)
        .to(".me-cascade-last", { xPercent: 0, duration: .45 }, .3)
        .fromTo(portrait, {
          x: () => (stage.clientWidth - portrait.offsetWidth) / 2 - portrait.offsetLeft,
          y: () => stage.clientHeight * .12,
          clipPath: mobile ? "inset(0 27% 0 27%)" : "inset(0 32% 0 32%)",
          rotation: 0,
        }, { x: 0, y: 0, clipPath: "inset(0 0% 0 0%)", rotation: 0, duration: .8, ease: "power2.inOut" }, .06)
        .fromTo(".me-cascade-portrait img", { scale: 1.2 }, { scale: 1, duration: .8 }, .06)
        .fromTo(panels, { autoAlpha: 0, y: 64, rotation: index => index % 2 ? 7 : -7, scale: .86, transformOrigin: "0% 0%" }, { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: .42, stagger: .075, ease: "power2.out" }, .36)
        .to({}, { duration: .55 })
      return release
    }, element)
    return () => media.revert()
  }, [])

  return (
    <div ref={root} data-ending-prototype="D" data-progress="0" className="me-cascade">
      <section className="me-cascade-track manga-ending-track" aria-labelledby="me-cascade-name">
        <div className="me-cascade-stage manga-ending-stage">
          <h1 id="me-cascade-name" className="me-cascade-title" aria-label="Royce Mathew"><span className="me-cascade-first" aria-hidden="true">Royce</span><span className="me-cascade-last" aria-hidden="true">Mathew</span></h1>
          <div className="me-cascade-page">
            <figure className="me-cascade-portrait">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="Black-and-white manga-style portrait of Royce Mathew" fill priority sizes="(max-width: 767px) 54vw, 42vw" />
            </figure>
            <div className="me-cascade-eye me-cascade-reveal" aria-hidden="true">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="" fill sizes="(max-width: 767px) 40vw, 50vw" />
              <span lang="ja">ロイス</span>
            </div>
            <div className="me-cascade-roles me-cascade-reveal">
              <p><span>Software</span> Developer</p>
              <p><span>AI</span> Developer</p>
              <p><span>Game</span> Developer</p>
            </div>
            <div className="me-cascade-creation me-cascade-reveal" aria-hidden="true"><span lang="ja">創造</span><span lang="ja">遊び</span></div>
            <nav className="me-cascade-project me-cascade-reveal me-cascade-navigation" aria-label="Projects">
              <Link href="/projects?study=panels&variant=D">Projects <span aria-hidden="true">↗</span></Link>
            </nav>
            <nav className="me-cascade-links me-cascade-reveal me-cascade-navigation" aria-label="Personal links">
              <a href="#scroll-about">About <span aria-hidden="true">↓</span></a>
              <a href="mailto:royce1mathew@gmail.com">Email <span aria-hidden="true">↗</span></a>
              <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
