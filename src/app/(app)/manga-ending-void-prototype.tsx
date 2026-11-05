"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CreationHandsPrototype, creationGap } from "./creation-hands-prototype"
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
      const portrait = element.querySelector<HTMLElement>(".me-void-portrait")!
      const spread = element.querySelector<HTMLElement>(".me-void-spread")!
      const name = element.querySelector<HTMLElement>(".me-void-name")!
      const first = element.querySelector<HTMLElement>(".me-void-name-first")!
      const last = element.querySelector<HTMLElement>(".me-void-name-last")!
      // Opening frame is a title card: "Royce", a narrow slit of the portrait, "Mathew", all centred
      // in the space above the variant switcher. The words grow as large as the stage width allows
      // so nothing bleeds off-screen at any viewport.
      const apertureShare = .28
      const apertureScale = 1.2
      const aperture = () => portrait.offsetWidth * apertureShare * apertureScale
      const lockupGap = () => Math.max(14, aperture() * .16)
      const lockupScale = () => Math.min(mobile ? 1.6 : 1.9, (name.clientWidth * .96 - aperture() - lockupGap() * 2) / (first.offsetWidth + last.offsetWidth))
      // "Mathew" is wider than "Royce", so the slit sits off-centre for the whole lockup to balance.
      const slitCenter = () => name.clientWidth / 2 + (first.offsetWidth - last.offsetWidth) * lockupScale() / 2
      const centerOn = (target: HTMLElement, offsetTop = 0) => (name.offsetTop + spread.offsetTop + spread.offsetHeight) / 2 - offsetTop - target.offsetTop - target.offsetHeight / 2
      navigation.forEach(panel => { panel.inert = true })
      // A staggered fromTo only paints its first target's start state before the first scroll, which
      // left the Projects and link panels showing over the opening title card.
      gsap.set(".me-void-reveal", { autoAlpha: 0, y: 35, rotationX: -12 })
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
        .fromTo(name, { y: () => centerOn(name) }, { y: 0, duration: .72 }, 0)
        .fromTo(first, { scale: lockupScale, transformOrigin: "100% 50%", x: () => slitCenter() - aperture() / 2 - lockupGap() - first.offsetLeft - first.offsetWidth }, { scale: 1, x: 0, duration: .72 }, 0)
        .fromTo(last, { scale: lockupScale, transformOrigin: "0% 50%", x: () => slitCenter() + aperture() / 2 + lockupGap() - last.offsetLeft }, { scale: 1, x: 0, duration: .72 }, 0)
        .fromTo(portrait, { x: () => name.offsetLeft + slitCenter() - spread.offsetLeft - portrait.offsetLeft - portrait.offsetWidth / 2, y: () => centerOn(portrait, spread.offsetTop), clipPath: `inset(0 ${(1 - apertureShare) * 50}% 0 ${(1 - apertureShare) * 50}%)`, scale: apertureScale }, { x: 0, y: 0, clipPath: "inset(0 0% 0 0%)", scale: 1, duration: .8 }, .04)
        .fromTo(".me-void-art-panel", { autoAlpha: 0, rotationX: -45, y: 80 }, { autoAlpha: 1, rotationX: 0, y: 0, duration: .55 }, .25)
        .fromTo(".me-creation-adam", { x: -190, y: 26, rotation: -4, svgOrigin: "0 300" }, { x: 0, y: 0, rotation: 0, duration: .85 }, .32)
        .fromTo(".me-creation-creator", { x: 190, y: -18, rotation: 3, svgOrigin: "1215 160" }, { x: 0, y: 0, rotation: 0, duration: .85 }, .32)
        .fromTo(".me-creation-tone", { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, .55)
        .fromTo(".me-creation-focus", { autoAlpha: 0, scale: 1.15, svgOrigin: `${creationGap.x} ${creationGap.y}` }, { autoAlpha: .28, scale: 1, duration: .5 }, .6)
        .fromTo(".me-creation-spark", { autoAlpha: 0, scale: .5, svgOrigin: `${creationGap.x} ${creationGap.y}` }, { autoAlpha: 1, scale: 1, duration: .25 }, .95)
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
