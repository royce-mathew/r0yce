"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CreationHands, creationGap } from "./creation-hands"
import "./creation-hero.css"

export function CreationHero() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)", reduced: "(prefers-reduced-motion: reduce)", short: "(min-width: 768px) and (max-height: 929px), (max-width: 767px) and (max-height: 815px)" }, context => {
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
      // The opening crop frames the face rather than isolating the ear.
      const apertureShare = .42
      const apertureScale = 1
      const aperture = () => portrait.offsetWidth * apertureShare * apertureScale
      const lockupGap = () => Math.max(14, aperture() * .16)
      const lockupScale = () => Math.min(mobile ? 1.5 : 1.7, (name.clientWidth * .9 - aperture() - lockupGap() * 2) / (first.offsetWidth + last.offsetWidth))
      // "Mathew" is wider than "Royce", so the slit sits off-centre for the whole lockup to balance.
      const slitCenter = () => name.clientWidth / 2 + (first.offsetWidth - last.offsetWidth) * lockupScale() / 2
      const centerOn = (target: HTMLElement, offsetTop = 0) => (name.offsetTop + spread.offsetTop + spread.offsetHeight) / 2 - offsetTop - target.offsetTop - target.offsetHeight / 2
      navigation.forEach(panel => { panel.inert = true })
      // All staggered panels start hidden, including those whose tweens begin after the first frame.
      gsap.set(".me-void-reveal", { autoAlpha: 0, y: 35, rotationX: -12 })
      const timeline = gsap.timeline({
        defaults: { ease: "elastic.out(1, .85)" },
        scrollTrigger: {
          trigger: element.querySelector(".me-void-track"),
          start: () => `top ${getComputedStyle(element).getPropertyValue("--site-header-height").trim()}`,
          end: "bottom bottom",
          scrub: .35,
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
        .fromTo(portrait, { x: () => name.offsetLeft + slitCenter() - spread.offsetLeft - portrait.offsetLeft - portrait.offsetWidth / 2, y: () => centerOn(portrait, spread.offsetTop), scale: apertureScale }, { x: 0, y: 0, scale: 1, duration: .9 }, .04)
        .fromTo(".me-void-portrait img", { xPercent: mobile ? -18 : -12 }, { xPercent: 0, duration: .9 }, .04)
        // The slit opens without overshoot so its inset never crosses outside the portrait.
        .fromTo(portrait, { clipPath: `inset(0 ${(1 - apertureShare) * 50}% 0 ${(1 - apertureShare) * 50}%)` }, { clipPath: "inset(0 0% 0 0%)", ease: "power2.out", duration: .7 }, .04)
        .fromTo(".me-void-art-panel", { autoAlpha: 0, rotationX: -30, y: 65 }, { autoAlpha: 1, rotationX: 0, y: 0, duration: .8 }, .2)
        // Slow damping and shorter travel keep the fingertip gap open at the spring's closest approach.
        .fromTo(".me-creation-adam", { x: -100, y: 16, rotation: -2, svgOrigin: "0 300" }, { x: 0, y: 0, rotation: 0, ease: "elastic.out(1, 1)", duration: 1.05 }, .32)
        .fromTo(".me-creation-creator", { x: 100, y: -12, rotation: 1.5, svgOrigin: "1215 160" }, { x: 0, y: 0, rotation: 0, ease: "elastic.out(1, 1)", duration: 1.05 }, .32)
        .fromTo(".me-creation-tone", { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.out", duration: .4 }, .55)
        .fromTo(".me-creation-backdrop", { autoAlpha: .35 }, { autoAlpha: 1, ease: "power1.inOut", duration: .6 }, .32)
        .fromTo(".me-creation-focus", { autoAlpha: 0, scale: 1.3, svgOrigin: `${creationGap.x} ${creationGap.y}` }, { autoAlpha: .5, scale: 1, duration: .75 }, .6)
        .fromTo(".me-creation-energy", { autoAlpha: 0, scale: .2, svgOrigin: `${creationGap.x} ${creationGap.y}` }, { autoAlpha: 1, scale: 1, ease: "elastic.out(1, .55)", duration: .85 }, .7)
        .fromTo(".me-creation-spark", { autoAlpha: 0, scale: .15, svgOrigin: `${creationGap.x} ${creationGap.y}` }, { autoAlpha: 1, scale: 1, ease: "elastic.out(1, .5)", duration: .7 }, .8)
        .fromTo(".me-void-reveal", { autoAlpha: 0, y: 35, rotationX: -12 }, { autoAlpha: 1, y: 0, rotationX: 0, duration: .4, stagger: .07 }, .5)
        .fromTo(".me-void-roles p", { x: -35, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .35, stagger: .08 }, .65)
        .fromTo(".me-void-orbit", { rotation: -65, scale: .7 }, { rotation: 0, scale: 1, duration: .8 }, .45)
        .to({}, { duration: .6 })
      return release
    }, element)
    return () => media.revert()
  }, [])

  return (
    <div ref={root} data-creation-hero data-progress="0" className="me-void">
      <section className="me-void-track" aria-labelledby="me-void-name">
        <div className="me-void-stage">
          <h1 id="me-void-name" className="me-void-name" aria-label="Royce Mathew"><span className="me-void-name-first" aria-hidden="true">Royce</span><span className="me-void-name-last" aria-hidden="true">Mathew</span></h1>
          <div className="me-void-spread">
            <div className="me-void-art-panel"><CreationHands /></div>
            <figure className="me-void-portrait"><Image src="/images/hero-manga-portrait-clean.webp" alt="Black-and-white manga portrait of Royce Mathew" fill preload sizes="(max-width: 767px) 40vw, 38vw" /></figure>
            <div className="me-void-roles me-void-reveal">
              <div className="me-void-orbit" aria-hidden="true" />
              <p><span>Software</span> Developer</p>
              <p><span>AI</span> Developer</p>
              <p><span>Game</span> Developer</p>
            </div>
            <div className="me-void-actions me-void-reveal">
              <div className="me-void-japanese" aria-hidden="true"><span lang="ja">創造</span><span lang="ja">遊び</span></div>
              <nav className="me-void-project me-void-navigation" aria-label="Projects"><Link href="/projects">Projects<span aria-hidden="true">↗</span></Link></nav>
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
