"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { ScrollWork } from "./scroll-study-types"
import "./scroll-kinetic-type-prototype.css"

export function KineticTypePrototype({ works }: { works: ScrollWork[] }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".kt-track",
            start: () => `top ${window.innerWidth <= 700 ? 76 : 90}px`,
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (root.current) root.current.dataset.progress = self.progress.toFixed(3)
            },
          },
        })
        timeline
          .to(".kt-word-one", { xPercent: -24, rotation: -7, duration: 1.4 }, 0)
          .to(".kt-word-two", { xPercent: 26, rotation: 6, duration: 1.4 }, 0)
          .to(".kt-word-three", { xPercent: -18, rotation: -5, duration: 1.4 }, 0)
          .to(".kt-portrait", { width: "46%", rotation: 7, duration: 0.8 }, 0)
          .to(".kt-portrait img", { scale: 1, duration: 0.8 }, 0)
          .to(".kt-disciplines", { opacity: 0.12, scale: 1.15, duration: 0.7 }, 0.8)
          .to(".kt-portrait", { width: "24%", xPercent: -105, rotation: -12, duration: 0.8 }, 0.8)
          .fromTo(".kt-next", { autoAlpha: 0, yPercent: 120, rotation: 8 }, { autoAlpha: 1, yPercent: 0, rotation: -4, duration: 0.8 }, 0.8)
          .to(".kt-stage", { backgroundColor: "#c7f75a", color: "#10120e", duration: 0.5 }, 1)
          .to(".kt-bottom", { borderColor: "#10120e", duration: 0.5 }, 1)

        gsap.utils.toArray<HTMLElement>(".kt-project").forEach((project) => {
          const image = project.querySelector(".kt-project-image img")
          gsap.fromTo(image, { yPercent: -7, scale: 1.12 }, {
            yPercent: 7,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: true },
          })
        })
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [])

  return (
    <div className="kt-root" ref={root} data-scroll-prototype="C" data-progress="0">
      <section className="kt-track" aria-label="Introduction">
        <div className="kt-stage">
          <div className="kt-top">
            <h1>Royce Mathew<span aria-hidden="true">✳</span></h1>
            <span className="kt-location">Based in Canada</span>
          </div>
          <div className="kt-poster">
            <div className="kt-disciplines" aria-hidden="true">
              <div className="kt-word kt-word-one">SOFTWARE</div>
              <div className="kt-word kt-word-two">DATA<span className="kt-asterisk">✳</span></div>
              <div className="kt-word kt-word-three">PLAY.</div>
            </div>
            <div className="kt-portrait">
              <Image src="/images/hero-manga-portrait.png" alt="Black-and-white ink portrait of Royce Mathew" width={495} height={527} priority sizes="(max-width: 700px) 65vw, 46vw" />
            </div>
            <div className="kt-next" aria-hidden="true"><span>SELECTED</span><span>WORK<span className="kt-next-arrow">↘</span></span></div>
          </div>
          <div className="kt-bottom">
            <p>Software Developer <span>/</span> Data Scientist <span>/</span> Game Developer</p>
            <a href="#scroll-selected-work">Selected work <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section className="kt-work" id="scroll-selected-work" aria-labelledby="kt-work-title">
        <div className="kt-work-heading"><h2 id="kt-work-title">Proof of<br /><em>curiosity.</em></h2><span>Selected work<br />({String(works.length).padStart(2, "0")})</span></div>
        <div className="kt-projects">
          {works.map((work, index) => (
            <Link href={`/${work.slug}?study=scroll&variant=C`} className="kt-project" key={work.slug}>
              <div className="kt-project-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>Explore project ↗</span></div>
              <div className="kt-project-image"><Image src={work.imageSrc} alt="" fill sizes="(max-width: 700px) 94vw, 72vw" /></div>
              <div className="kt-project-copy"><h3>{work.title}</h3><p>{work.description}</p><span aria-hidden="true">↗</span></div>
            </Link>
          ))}
        </div>
        <div className="kt-work-footer"><Link href="/projects?study=scroll&variant=C">All projects <span aria-hidden="true">↗</span></Link><a href="#scroll-about">The person behind it <span aria-hidden="true">↓</span></a></div>
        <div className="kt-contact"><a href="mailto:royce1mathew@gmail.com">Get in<br /><em>touch.</em> <span aria-hidden="true">↗</span></a><a className="kt-resume" href="/files/Royce%20Mathew%20Resume.pdf">Résumé ↗</a></div>
      </section>
    </div>
  )
}
