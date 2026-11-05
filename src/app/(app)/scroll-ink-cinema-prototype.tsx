"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./scroll-ink-cinema-prototype.css"

export function InkCinemaPrototype() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 760px)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const contact = element.querySelector<HTMLElement>(".ic-contact")!
      if (!context.conditions?.motion) {
        contact.inert = false
        element.dataset.progress = "1"
        return
      }
      const mobile = context.conditions.mobile
      contact.inert = true
      const timeline = gsap.timeline({
        onUpdate: () => { contact.inert = timeline.progress() < .88 },
        scrollTrigger: {
          trigger: element.querySelector(".ic-track"),
          start: () => `top ${window.innerWidth <= 760 ? 76 : 90}px`,
          end: "bottom bottom",
          scrub: .7,
          invalidateOnRefresh: true,
          onUpdate: (self) => { element.dataset.progress = self.progress.toFixed(3) },
        },
      })
      timeline
        .fromTo(".ic-name-first", { xPercent: 0, yPercent: 0, opacity: 1 }, { xPercent: -35, yPercent: -35, opacity: 0, duration: .65 }, 0)
        .fromTo(".ic-name-last", { xPercent: 0, yPercent: 0, opacity: 1 }, { xPercent: 35, yPercent: 35, opacity: 0, duration: .65 }, 0)
        .fromTo(".ic-portrait", { width: mobile ? "30%" : "26%", left: "37%", top: "12%", height: "72%" }, { width: mobile ? "64%" : "47%", left: "4%", top: mobile ? "4%" : "8%", height: mobile ? "39%" : "76%", duration: .85, ease: "power2.inOut" }, .08)
        .fromTo(".ic-portrait img", { scale: 1.22 }, { scale: 1, duration: .85 }, .08)
        .fromTo(".ic-detail", { autoAlpha: 0, xPercent: 20 }, { autoAlpha: 1, xPercent: 0, duration: .5 }, .45)
        .fromTo(".ic-contact", { clipPath: "inset(0 100% 0 0)", y: 25 }, { clipPath: "inset(0 0% 0 0)", y: 0, duration: .65, ease: "power2.inOut" }, .4)
        .to({}, { duration: .2 })
      return () => { contact.inert = false }
    }, element)
    return () => media.revert()
  }, [])

  return (
    <div ref={root} className="ink-cinema" data-scroll-prototype="B" data-progress="0">
      <section className="ic-track" aria-labelledby="ic-name">
        <div className="ic-stage">
          <h1 id="ic-name" className="ic-name" aria-label="Royce Mathew"><span className="ic-name-first" aria-hidden="true">Royce</span><span className="ic-name-last" aria-hidden="true">Mathew<span className="ic-dot">.</span></span></h1>
          <figure className="ic-portrait">
            <Image src="/images/hero-manga-portrait.png" alt="Black-and-white ink portrait of Royce Mathew" fill priority sizes="(max-width: 760px) 64vw, 47vw" />
          </figure>
          <div className="ic-detail" aria-hidden="true"><Image src="/images/hero-manga-portrait.png" alt="" fill sizes="(max-width: 760px) 25vw, 12vw" /></div>
          <div className="ic-contact">
            <div className="ic-contact-heading"><span>Royce Mathew</span><span>Canada ↗</span></div>
            <p className="ic-practice"><span>Software Developer</span><span>AI Developer</span><span>Game Developer</span></p>
            <nav className="ic-contact-links" aria-label="Introduction links">
              <Link href="/projects?study=scroll&variant=B">Projects <span aria-hidden="true">↗</span></Link>
              <a href="#scroll-about">About me <span aria-hidden="true">↓</span></a>
              <a href="mailto:royce1mathew@gmail.com">Get in touch <span aria-hidden="true">↗</span></a>
              <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
