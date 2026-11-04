"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import "./hero-contact-sheet-prototype.css"

export function ContactSheetHero() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (!context.conditions?.motion) {
        element.dataset.motion = "reduced"
        return
      }
      element.dataset.motion = "running"
      gsap.timeline({ onComplete: () => { element.dataset.motion = "settled" } })
        .from(".contact-sheet-rule", { scaleX: 0, transformOrigin: "left", duration: 0.7, stagger: 0.12, ease: "power2.inOut" })
        .from(".contact-sheet-cell", { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.09, ease: "power3.out" }, 0.2)
        .from(".contact-sheet-print", { y: 32, rotation: -4, scale: 0.94, autoAlpha: 0, duration: 0.95, ease: "power3.out" }, 0.35)
        .from(".contact-sheet-name > span", { yPercent: 105, duration: 0.9, stagger: 0.13, ease: "power4.out" }, 0.55)
    }, element)
    return () => media.revert()
  }, [])

  return (
    <section ref={root} className="contact-sheet" data-hero-prototype="C" data-motion="settled" aria-labelledby="contact-sheet-name">
      <div className="contact-sheet-top contact-sheet-cell"><span>Royce Mathew / Personal portfolio</span><span>Canada ↗</span></div>
      <div className="contact-sheet-rule" aria-hidden="true" />
      <div className="contact-sheet-layout">
        <div className="contact-sheet-disciplines contact-sheet-cell"><span className="contact-sheet-index">01 / Practice</span><p>Software development<br />Data science<br />Game development</p></div>
        <figure className="contact-sheet-print">
          <Image src="/images/hero-manga-portrait.png" width={495} height={527} priority sizes="(max-width: 620px) 78vw, (max-width: 1000px) 48vw, 410px" alt="Manga portrait of Royce Mathew with screentone shading and radiating impact lines" />
          <figcaption><span>RM — Portrait</span><span>01 / 01</span></figcaption>
        </figure>
        <div className="contact-sheet-position contact-sheet-cell"><span className="contact-sheet-index">02 / Currently</span><p>Analyst at<br />TD Asset<br />Management</p><a href="#about">More about me <span aria-hidden="true">↗</span></a></div>
        <div className="contact-sheet-work contact-sheet-cell"><span className="contact-sheet-index">03 / Selected projects</span><a href="#manga-work-title">Explore my work <span aria-hidden="true">↘</span></a></div>
        <div className="contact-sheet-note contact-sheet-cell" aria-hidden="true">CODE<br /><span>DATA</span><br />PLAY</div>
      </div>
      <h1 id="contact-sheet-name" className="contact-sheet-name" aria-label="Royce Mathew"><span>Royce</span><span>Mathew<span className="contact-sheet-period">.</span></span></h1>
      <div className="contact-sheet-rule" aria-hidden="true" />
      <nav className="contact-sheet-footer contact-sheet-cell" aria-label="Contact and résumé">
        <a href="mailto:royce1mathew@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
        <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
        <a href="https://github.com/royce-mathew" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        <span className="contact-sheet-footer-note">Software / Data / Play</span>
      </nav>
    </section>
  )
}
