"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import "./creation-hero.css"

export function CreationHero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const motion = matchMedia("(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)")
    const listeners = new AbortController()
    const options = { passive: true, signal: listeners.signal }
    let frame = 0
    let x = 0
    let y = 0

    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      element.style.removeProperty("--scene-x")
      element.style.removeProperty("--scene-y")
    }

    element.addEventListener("pointermove", (event) => {
      if (!motion.matches || event.pointerType !== "mouse") return
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const bounds = element.getBoundingClientRect()
        element.style.setProperty("--scene-x", `${((x - bounds.left) / bounds.width - .5) * 40}px`)
        element.style.setProperty("--scene-y", `${((y - bounds.top) / bounds.height - .5) * 30}px`)
      })
    }, options)
    element.addEventListener("pointerleave", reset, options)
    window.addEventListener("blur", reset, options)
    motion.addEventListener("change", reset, options)
    return () => {
      listeners.abort()
      reset()
    }
  }, [])

  return (
    <section ref={root} data-creation-hero className="me-void" aria-labelledby="me-void-name">
      <div className="me-void-scene" aria-hidden="true">
        <div className="me-void-portrait">
          <Image src="/images/ProfilePicture2.jpg" alt="" fill preload sizes="(max-width: 767px) and (max-height: 700px) 130vw, (max-width: 767px) 143vw, min(76vw, 134svh, 1120px)" />
        </div>
      </div>
      <div className="me-void-stage">
        <div>
          <h1 id="me-void-name" className="me-void-name">Royce Mathew<span aria-hidden="true">.</span></h1>
          <p className="me-void-role">Software developer, AI engineer, and game developer.</p>
        </div>
        <nav className="me-void-links" aria-label="Homepage links">
          <a className="me-void-work-link" href="#selected-work">Selected work <span aria-hidden="true">↓</span></a>
          <div className="me-void-secondary">
            <Link href="/blog">Blog</Link>
            <a href="#scroll-about">About</a>
            <a href="mailto:royce1mathew@gmail.com">Email</a>
            <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
          </div>
        </nav>
      </div>
    </section>
  )
}
