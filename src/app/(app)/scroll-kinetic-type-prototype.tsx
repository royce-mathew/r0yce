"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./scroll-kinetic-type-prototype.css"

export function KineticTypePrototype() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 760px)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const identity = element.querySelector<HTMLElement>(".kt-identity")!
      if (!context.conditions?.motion) {
        identity.inert = false
        element.dataset.progress = "1"
        return
      }
      const mobile = context.conditions.mobile
      identity.inert = true
      const timeline = gsap.timeline({
        onUpdate: () => { identity.inert = timeline.progress() < .88 },
        scrollTrigger: {
          trigger: element.querySelector(".kt-track"),
          start: () => `top ${window.innerWidth <= 760 ? 76 : 90}px`,
          end: "bottom bottom",
          scrub: .65,
          invalidateOnRefresh: true,
          onUpdate: (self) => { element.dataset.progress = self.progress.toFixed(3) },
        },
      })
      timeline
        .fromTo(".kt-word-one", { xPercent: 0, rotation: 0 }, { xPercent: -35, rotation: -7, duration: 1.2 }, 0)
        .fromTo(".kt-word-two", { xPercent: 0, rotation: 0 }, { xPercent: 48, rotation: 6, duration: 1.2 }, 0)
        .fromTo(".kt-word-three", { xPercent: 0, rotation: 0 }, { xPercent: -28, rotation: -5, duration: 1.2 }, 0)
        .fromTo(".kt-disciplines", { opacity: 1 }, { opacity: 0, duration: .6 }, .65)
        .fromTo(".kt-portrait", { left: "43%", top: "10%", width: "20%", height: "80%", rotation: -8 }, { left: "29%", width: mobile ? "65%" : "46%", rotation: 6, duration: .7 }, 0)
        .to(".kt-portrait", { left: mobile ? "0%" : "1%", top: "3%", width: mobile ? "63%" : "38%", height: mobile ? "42%" : "91%", rotation: -4, duration: .7 }, .7)
        .fromTo(".kt-portrait img", { scale: 1.25 }, { scale: 1, duration: 1.4 }, 0)
        .fromTo(".kt-detail", { autoAlpha: 0, xPercent: 50 }, { autoAlpha: 1, xPercent: 0, duration: .5 }, .8)
        .fromTo(".kt-identity", { autoAlpha: 0, yPercent: 110, rotation: 8 }, { autoAlpha: 1, yPercent: 0, rotation: 0, duration: .7 }, .7)
        .fromTo(".kt-stage", { backgroundColor: "#11130f", color: "#efede6" }, { backgroundColor: "#c7f75a", color: "#11130f", duration: .5 }, .8)
        .to({}, { duration: .2 })
      return () => { identity.inert = false }
    }, element)
    return () => media.revert()
  }, [])

  return (
    <div className="kt-root" ref={root} data-scroll-prototype="C" data-progress="0">
      <section className="kt-track" aria-labelledby="kt-name">
        <div className="kt-stage">
          <div className="kt-top"><h1 id="kt-name">Royce Mathew</h1><span>Based in Canada</span></div>
          <div className="kt-poster">
            <div className="kt-disciplines" aria-hidden="true"><div className="kt-word kt-word-one">SOFTWARE</div><div className="kt-word kt-word-two">AI</div><div className="kt-word kt-word-three">PLAY.</div></div>
            <div className="kt-portrait"><Image src="/images/hero-manga-portrait.png" alt="Black-and-white ink portrait of Royce Mathew" fill priority sizes="(max-width: 760px) 65vw, 46vw" /></div>
            <div className="kt-detail" aria-hidden="true"><Image src="/images/hero-manga-portrait.png" alt="" fill sizes="(max-width: 760px) 28vw, 16vw" /></div>
            <div className="kt-identity">
              <h2>AI Developer<span aria-hidden="true">.</span></h2>
              <p className="kt-roles">Software Developer<br />Game Developer</p>
              <nav aria-label="Introduction links"><Link href="/projects?study=scroll&variant=C">Projects ↗</Link><a href="#scroll-about">About me ↓</a><a href="mailto:royce1mathew@gmail.com">Get in touch ↗</a><a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a></nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
