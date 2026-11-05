"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import "./hero-monolith-prototype.css"

export function MonolithHero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const media = gsap.matchMedia()
    media.add({ animated: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (!context.conditions?.animated) {
        element.dataset.motion = "reduced"
        return
      }
      element.dataset.motion = "running"
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => { element.dataset.motion = "settled" },
      })
      timeline.from(".monolith-name-letter", { yPercent: 115, rotate: 5, opacity: 0, duration: 1.05, stagger: 0.045 })
        .from(".monolith-portrait", { scale: 0.76, y: 42, rotate: -5, opacity: 0, duration: 1.15 }, 0.35)
        .from(".monolith-rule", { scaleX: 0, transformOrigin: "left", duration: 0.9 }, 0.55)
        .from(".monolith-detail", { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.9)
    }, element)
    return () => { media.revert() }
  }, [])

  return (
    <section ref={root} className="monolith-hero" data-hero-prototype="B" data-motion="settled" aria-labelledby="monolith-name">
      <div className="monolith-top monolith-detail">
        <a className="monolith-wordmark" href="#about" aria-label="About Royce">royce.sh</a>
        <span className="monolith-edition">Software / AI / Games</span>
        <span className="monolith-location">Based in Canada <span aria-hidden="true">↗</span></span>
      </div>
      <div className="monolith-rule" />
      <div className="monolith-stage">
        <h1 id="monolith-name" className="monolith-name" aria-label="Royce Mathew">
          {["ROYCE", "MATHEW"].map((name) => (
            <span className="monolith-name-line" aria-hidden="true" key={name}>
              {Array.from(name).map((letter, index) => <span className="monolith-name-letter" key={`${letter}-${index}`}>{letter}</span>)}
            </span>
          ))}
        </h1>
        <div className="monolith-middle">
          <div className="monolith-intro monolith-detail">
            <span className="monolith-index">01 / INTRODUCTION</span>
            <p>Software.<br />AI.<br /><em>Play.</em></p>
            <span className="monolith-employment">Analyst at TD Asset Management</span>
          </div>
          <figure className="monolith-portrait">
            <Image src="/images/hero-manga-portrait.png" alt="Manga portrait of Royce Mathew with screentone shading and radiating impact lines" width={495} height={527} priority sizes="(max-width: 600px) 61vw, (max-width: 1000px) 30vw, 310px" />
            <figcaption><span>ROYCE MATHEW</span><span>CANADA</span></figcaption>
          </figure>
          <span className="monolith-margin monolith-detail" aria-hidden="true">PERSONAL INDEX — RM</span>
        </div>
      </div>
      <div className="monolith-rule" />
      <div className="monolith-bottom monolith-detail">
        <p>Software developer.<br />AI Developer. Game developer.</p>
        <nav className="monolith-actions" aria-label="Explore Royce’s work">
          <a className="monolith-work" href="#manga-work-title">Selected work <span aria-hidden="true">↗</span></a>
          <a className="monolith-resume" href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
        </nav>
        <a className="monolith-email" href="mailto:royce1mathew@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  )
}
