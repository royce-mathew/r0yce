"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import "./hero-afterimage-prototype.css"

export function AfterimageHero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = root.current!
    const media = gsap.matchMedia()
    media.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)", fine: "(hover: hover) and (pointer: fine)" }, (context) => {
      const select = gsap.utils.selector(element)
      if (context.conditions?.reduced) {
        element.dataset.motion = "reduced"
        return
      }
      element.dataset.motion = "running"
      gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => { element.dataset.motion = "settled" } })
        .from(select(".afterimage-disc"), { scale: .5, opacity: 0, duration: 1.5 })
        .from(select(".afterimage-echo"), { x: -45, y: 30, rotation: -12, opacity: 0, duration: 1.25, stagger: .12 }, .1)
        .from(select(".afterimage-photo"), { y: 90, rotation: 8, opacity: 0, duration: 1.3 }, .2)
        .from(select(".afterimage-line > span"), { yPercent: 110, duration: 1.1, stagger: .12 }, .4)
        .from(select(".afterimage-role, .afterimage-footer"), { y: 18, opacity: 0, duration: .9, stagger: .12 }, .75)
      if (!context.conditions?.fine) return
      const depth = element.querySelector(".afterimage-depth")
      const rotateX = gsap.quickTo(depth, "rotationX", { duration: .9, ease: "power3.out" })
      const rotateY = gsap.quickTo(depth, "rotationY", { duration: .9, ease: "power3.out" })
      const discX = gsap.quickTo(element.querySelector(".afterimage-disc"), "x", { duration: 1.2, ease: "power3.out" })
      const pointer = (event: PointerEvent) => {
        const box = element.getBoundingClientRect()
        const x = (event.clientX - box.left) / box.width - .5
        const y = (event.clientY - box.top) / box.height - .5
        rotateX(-y * 8)
        rotateY(x * 10)
        discX(x * -20)
      }
      const leave = () => { rotateX(0); rotateY(0); discX(0) }
      element.addEventListener("pointermove", pointer)
      element.addEventListener("pointerleave", leave)
      return () => { element.removeEventListener("pointermove", pointer); element.removeEventListener("pointerleave", leave) }
    }, element)
    return () => media.revert()
  }, [])

  return (
    <section className="afterimage-hero" ref={root} data-hero-prototype="E" data-motion="pending" aria-label="Introduction">
      <div className="afterimage-composition">
        <div className="afterimage-disc" aria-hidden="true"/>
        <div className="afterimage-stage">
          <div className="afterimage-depth">
            <div className="afterimage-echo afterimage-echo-one" aria-hidden="true"/>
            <div className="afterimage-echo afterimage-echo-two" aria-hidden="true"/>
            <figure className="afterimage-photo"><Image src="/images/hero-manga-portrait.png" alt="Royce Mathew, Analyst at TD Asset Management" width={495} height={527} priority sizes="(max-width: 760px) 72vw, 380px"/></figure>
          </div>
        </div>
        <div className="afterimage-identity">
          <h1 aria-label="Royce Mathew"><span className="afterimage-line"><span>Royce</span></span><span className="afterimage-line"><span>Mathew<span className="afterimage-stop">.</span></span></span></h1>
          <ul className="afterimage-role"><li>Software developer</li><li>AI Developer</li><li>Game developer</li></ul>
        </div>
      </div>
      <footer className="afterimage-footer">
        <span>Based in Canada</span>
        <a className="afterimage-work" href="#manga-work-title">Selected work <span aria-hidden="true">↗</span></a>
        <div className="afterimage-links"><a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a><a href="mailto:royce1mathew@gmail.com">Email ↗</a></div>
      </footer>
    </section>
  )
}
