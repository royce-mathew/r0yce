"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import "./hero-signal-prototype.css"

export function SignalHero() {
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
      const sequence = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => { element.dataset.motion = "settled" } })
      sequence.from(select(".signal-axis"), { scaleY: 0, duration: 1.1, stagger: .08, transformOrigin: "top" })
        .from(select(".signal-word"), { xPercent: -12, opacity: 0, duration: 1.4, stagger: .12 }, .12)
        .from(select(".signal-portrait-window"), { y: 35, scale: .94, opacity: 0, duration: 1.2 }, .35)
        .fromTo(select(".signal-scan"), { scaleY: 0, x: -180, opacity: 0 }, { scaleY: 1, x: 180, opacity: .8, duration: 1, ease: "power2.inOut" }, .5)
        .to(select(".signal-scan"), { opacity: 0, duration: .3 }, 1.5)
        .from(select(".signal-header, .signal-footer"), { y: 12, opacity: 0, duration: .8, stagger: .12 }, .65)
      if (!context.conditions?.fine) return
      const motion = element.querySelector(".signal-portrait-motion")
      const moveX = gsap.quickTo(motion, "x", { duration: .8, ease: "power3.out" })
      const moveY = gsap.quickTo(motion, "y", { duration: .8, ease: "power3.out" })
      const pointer = (event: PointerEvent) => {
        const box = element.getBoundingClientRect()
        moveX(((event.clientX - box.left) / box.width - .5) * 14)
        moveY(((event.clientY - box.top) / box.height - .5) * 10)
      }
      const leave = () => { moveX(0); moveY(0) }
      element.addEventListener("pointermove", pointer)
      element.addEventListener("pointerleave", leave)
      return () => { element.removeEventListener("pointermove", pointer); element.removeEventListener("pointerleave", leave) }
    }, element)
    return () => media.revert()
  }, [])

  return (
    <section ref={root} className="signal-hero" data-hero-prototype="D" data-motion="pending" aria-label="Introduction">
      <header className="signal-header">
        <h1>Royce Mathew<span aria-hidden="true">_</span></h1>
        <span>Based in Canada</span>
      </header>
      <div className="signal-field">
        <div className="signal-axis signal-axis-left" aria-hidden="true"/>
        <div className="signal-axis signal-axis-right" aria-hidden="true"/>
        <div className="signal-words" aria-hidden="true"><span className="signal-word">CODE</span><span className="signal-word">DATA</span><span className="signal-word">PLAY</span></div>
        <div className="signal-portrait-motion">
          <figure className="signal-portrait-window">
            <Image src="/images/hero-manga-portrait.png" alt="Royce Mathew, Analyst at TD Asset Management" width={495} height={527} priority sizes="(max-width: 760px) 72vw, 340px"/>
          </figure>
        </div>
        <span className="signal-cross signal-cross-tl" aria-hidden="true">+</span><span className="signal-cross signal-cross-br" aria-hidden="true">+</span>
        <div className="signal-scan" aria-hidden="true"/>
      </div>
      <footer className="signal-footer">
        <ul className="signal-disciplines"><li>Software developer</li><li>Data scientist</li><li>Game developer</li></ul>
        <div className="signal-actions"><a href="#manga-work-title">Explore work <span aria-hidden="true">↗</span></a><a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a></div>
      </footer>
    </section>
  )
}
