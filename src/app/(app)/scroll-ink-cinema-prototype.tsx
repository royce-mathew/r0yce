"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { ScrollWork } from "./scroll-study-types"
import "./scroll-ink-cinema-prototype.css"

export function InkCinemaPrototype({ works }: { works: ScrollWork[] }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const contact = element.querySelector<HTMLElement>(".ic-contact")!
      contact.inert = true
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element.querySelector(".ic-track"),
          start: () => `top ${window.innerWidth <= 760 ? 76 : 90}px`,
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => { element.dataset.progress = self.progress.toFixed(3); contact.inert = self.progress < .85 },
        },
      })
      timeline
        .to(".ic-name-first", { xPercent: -35, yPercent: -35, opacity: 0, duration: 0.55 }, 0)
        .to(".ic-name-last", { xPercent: 35, yPercent: 35, opacity: 0, duration: 0.55 }, 0)
        .to(".ic-portrait", { width: "49%", left: "3%", rotation: -2, duration: 0.8, ease: "power2.inOut" }, 0.1)
        .to(".ic-portrait img", { scale: 1, duration: 0.8, ease: "power2.inOut" }, 0.1)
        .fromTo(".ic-contact", { clipPath: "inset(0 100% 0 0)", y: 35 }, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 0.65, ease: "power2.inOut" }, 0.35)
        .to(".ic-opening-meta", { opacity: 0, duration: 0.2 }, 0)
    }, element)
    media.add("(prefers-reduced-motion: reduce)", () => {
      element.querySelector<HTMLElement>(".ic-contact")!.inert = false
    })
    return () => media.revert()
  }, [])

  return (
    <div ref={root} className="ink-cinema" data-scroll-prototype="B" data-progress="0">
      <section className="ic-track" aria-labelledby="ic-name">
        <div className="ic-stage">
          <div className="ic-opening-meta"><span>Software / Data / Play</span><span>Based in Canada</span></div>
          <h1 id="ic-name" className="ic-name" aria-label="Royce Mathew"><span className="ic-name-first" aria-hidden="true">Royce</span><span className="ic-name-last" aria-hidden="true">Mathew<span className="ic-dot">.</span></span></h1>
          <figure className="ic-portrait">
            <Image src="/images/hero-manga-portrait.png" alt="Black-and-white ink portrait of Royce Mathew" fill priority sizes="(max-width: 600px) 90vw, 55vw" />
            <figcaption><span>Royce Mathew</span><span>Canada</span></figcaption>
          </figure>
          <div className="ic-contact" inert>
            <span className="ic-contact-mark" aria-hidden="true">RM<span>✳</span></span>
            <div className="ic-contact-content"><p className="ic-small">Royce Mathew</p><p className="ic-practice">Software<br />Developer<span className="ic-slash"> /</span><br /><span className="ic-italic">Data Scientist</span><br />Game Developer</p></div>
            <nav className="ic-contact-links" aria-label="Introduction links"><a href="#scroll-selected-work">Selected work <span aria-hidden="true">↘</span></a><a href="#scroll-about">About me <span aria-hidden="true">↗</span></a><a href="mailto:royce1mathew@gmail.com">Get in touch <span aria-hidden="true">↗</span></a></nav>
          </div>
          <a href="#scroll-selected-work" className="ic-endnote">Selected work <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <section id="scroll-selected-work" className="ic-works" aria-labelledby="ic-work-heading">
        <header className="ic-work-heading"><h2 id="ic-work-heading">Selected<br /><em>work.</em></h2><span aria-hidden="true">↙</span></header>
        <div className="ic-work-list">{works.map((work, index) => (
          <article className={`ic-project ic-project-${index % 3}`} key={work.slug}>
            <Link className="ic-project-link" href={`/${work.slug}?study=scroll&variant=B`}>
              <div className="ic-project-image"><Image src={work.imageSrc} alt="" fill sizes="(max-width: 700px) 94vw, 82vw" /><span className="ic-project-open" aria-hidden="true">↗</span></div>
              <div className="ic-project-caption"><span className="ic-project-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{work.title}</h3><p>{work.description}</p></div><span className="ic-small ic-project-view">View project ↗</span></div>
            </Link>
          </article>
        ))}</div>
        <div className="ic-work-footer"><Link href="/projects?study=scroll&variant=B">All projects <span aria-hidden="true">↗</span></Link><a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a></div>
      </section>
    </div>
  )
}
