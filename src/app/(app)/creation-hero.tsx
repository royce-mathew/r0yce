"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CreationHands, creationGap } from "./creation-hands"
import "./creation-hero.css"

const creationEligibility = {
  mobile: "(max-width: 767px)",
  enhanced: "(min-width: 768px) and (min-height: 930px) and (prefers-reduced-motion: no-preference), (max-width: 767px) and (min-height: 816px) and (prefers-reduced-motion: no-preference)",
}

function openingFrame(element: HTMLElement, paint = false, eligibilityQuery = "") {
  if (paint) {
    document.getElementById("creation-opening-frame")?.remove()
    const enhanced = matchMedia(eligibilityQuery).matches
    element.toggleAttribute("data-creation-enhanced", enhanced)
  }
  const mobile = matchMedia("(max-width: 767px)").matches
  const portrait = element.querySelector<HTMLElement>(".me-void-portrait")!
  const spread = element.querySelector<HTMLElement>(".me-void-spread")!
  const name = element.querySelector<HTMLElement>(".me-void-name")!
  const first = element.querySelector<HTMLElement>(".me-void-name-first")!
  const last = element.querySelector<HTMLElement>(".me-void-name-last")!
  const aperture = portrait.offsetWidth * .42
  const gap = Math.max(14, aperture * .16)
  const scale = Math.min(mobile ? 1.5 : 1.7, (name.clientWidth * .9 - aperture - gap * 2) / (first.offsetWidth + last.offsetWidth))
  const center = name.clientWidth / 2 + (first.offsetWidth - last.offsetWidth) * scale / 2
  const middle = (name.offsetTop + spread.offsetTop + spread.offsetHeight) / 2
  const frame = {
    nameY: middle - name.offsetTop - name.offsetHeight / 2,
    firstX: center - aperture / 2 - gap - first.offsetLeft - first.offsetWidth,
    lastX: center + aperture / 2 + gap - last.offsetLeft,
    portraitX: name.offsetLeft + center - spread.offsetLeft - portrait.offsetLeft - portrait.offsetWidth / 2,
    portraitY: middle - spread.offsetTop - portrait.offsetTop - portrait.offsetHeight / 2,
    scale,
  }
  if (paint && element.hasAttribute("data-creation-enhanced")) {
    const sheet = document.createElement("style")
    sheet.id = "creation-opening-frame"
    sheet.textContent = `
      [data-creation-hero] .me-void-name { transform: translateY(${frame.nameY}px); }
      [data-creation-hero] .me-void-name-first { transform: translateX(${frame.firstX}px) scale(${scale}); transform-origin: 100% 50%; }
      [data-creation-hero] .me-void-name-last { transform: translateX(${frame.lastX}px) scale(${scale}); transform-origin: 0% 50%; }
      [data-creation-hero] .me-void-portrait { transform: translate(${frame.portraitX}px, ${frame.portraitY}px); clip-path: inset(0 29% 0 29%); }
      [data-creation-hero] .me-void-portrait img { transform: translateX(${mobile ? -18 : -12}%); }
      [data-creation-hero] .me-void-reveal, [data-creation-hero] .me-void-art-panel { visibility: hidden; opacity: 0; }
    `
    document.head.appendChild(sheet)
  }
  return frame
}
export function CreationHero() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    document.getElementById("creation-opening-frame")?.remove()
    media.add({ enhanced: creationEligibility.enhanced, mobile: creationEligibility.mobile, reduced: "(prefers-reduced-motion: reduce)", always: "all" }, context => {
      const navigation = gsap.utils.toArray<HTMLElement>(".me-void-navigation", element)
      const release = () => {
        navigation.forEach(panel => { panel.inert = false })
        element.removeAttribute("data-creation-enhanced")
      }
      if (!context.conditions?.enhanced) {
        release()
        return release
      }
      element.setAttribute("data-creation-enhanced", "")
      const mobile = context.conditions.mobile
      const navigationReveals = navigation.map(panel => ({
        panel,
        reveal: panel.closest<HTMLElement>(".me-void-reveal")!,
      }))
      const portrait = element.querySelector<HTMLElement>(".me-void-portrait")!
      const name = element.querySelector<HTMLElement>(".me-void-name")!
      const first = element.querySelector<HTMLElement>(".me-void-name-first")!
      const last = element.querySelector<HTMLElement>(".me-void-name-last")!
      const apertureScale = 1
      let frame = openingFrame(element)
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
          onRefreshInit: () => { frame = openingFrame(element) },
        },
        onUpdate: () => {
          navigationReveals.forEach(({ panel, reveal }) => { panel.inert = Number(gsap.getProperty(reveal, "opacity")) <= 0 })
        },
      })
      timeline
        .fromTo(name, { y: () => frame.nameY }, { y: 0, duration: .72 }, 0)
        .fromTo(first, { scale: () => frame.scale, transformOrigin: "100% 50%", x: () => frame.firstX }, { scale: 1, x: 0, duration: .72 }, 0)
        .fromTo(last, { scale: () => frame.scale, transformOrigin: "0% 50%", x: () => frame.lastX }, { scale: 1, x: 0, duration: .72 }, 0)
        .fromTo(portrait, { x: () => frame.portraitX, y: () => frame.portraitY, scale: apertureScale }, { x: 0, y: 0, scale: 1, duration: .9 }, .04)
        .fromTo(".me-void-portrait img", { xPercent: mobile ? -18 : -12 }, { xPercent: 0, duration: .9 }, .04)
        // The slit opens without overshoot so its inset never crosses outside the portrait.
        .fromTo(portrait, { clipPath: "inset(0 29% 0 29%)" }, { clipPath: "inset(0 0% 0 0%)", ease: "power2.out", duration: .7 }, .04)
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
    let active = true
    void document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh()
    })
    return () => {
      active = false
      media.revert()
    }
  }, [])

  return (
    <div ref={root} data-creation-hero className="me-void" suppressHydrationWarning>
      <section className="me-void-track" aria-labelledby="me-void-name">
        <div className="me-void-stage">
          <h1 id="me-void-name" className="me-void-name" aria-label="Royce Mathew"><span className="me-void-name-first" aria-hidden="true">Royce</span><span className="me-void-name-last" aria-hidden="true">Mathew</span></h1>
          <div className="me-void-spread">
            <div className="me-void-art-panel"><CreationHands /></div>
            <figure className="me-void-portrait"><Image src="/images/hero-manga-portrait-clean.webp" alt="Black-and-white manga portrait of Royce Mathew" fill preload sizes="(max-width: 767px) 40vw, 38vw" /></figure>
            <div className="me-void-roles me-void-reveal">
              <div className="me-void-orbit" aria-hidden="true" />
              <p><span>Software</span> Developer</p>
              <p><span>AI</span> Engineer</p>
              <p><span>Game</span> Developer</p>
            </div>
            <div className="me-void-actions me-void-reveal">
              <nav className="me-void-destination me-void-blog me-void-navigation" aria-label="Blog">
                <Link href="/blog"><span className="link-underline-target">Blog</span><span aria-hidden="true">↗</span></Link>
              </nav>
              <nav className="me-void-destination me-void-navigation" aria-label="Projects">
                <Link href="/projects"><span className="link-underline-target">Projects</span><span aria-hidden="true">↗</span></Link>
              </nav>
            </div>
            <nav className="me-void-links me-void-navigation me-void-reveal" aria-label="Personal links">
              <a href="#scroll-about"><span className="link-underline-target">About</span><span aria-hidden="true">↓</span></a>
              <a href="mailto:royce1mathew@gmail.com"><span className="link-underline-target">Email</span><span aria-hidden="true">↗</span></a>
              <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer"><span className="link-underline-target">Résumé</span><span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </div>
      </section>
      <span
        hidden
        dangerouslySetInnerHTML={{ __html: `<script>{const element=document.currentScript.parentElement.parentElement;const paint=${openingFrame.toString()};const eligibility=${JSON.stringify(creationEligibility.enhanced)};paint(element,true,eligibility);document.fonts.ready.then(()=>{if(element.isConnected&&document.getElementById("creation-opening-frame"))paint(element,true,eligibility)})}</script>` }}
      />
    </div>
  )
}
