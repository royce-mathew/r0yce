"use client"

import { useEffect, useLayoutEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const variants = ["A", "B", "C", "D", "E"] as const
const names = { A: "Baseline / Hero lab", B: "Monolith", C: "Contact Sheet", D: "Signal", E: "Afterimage" }

export function MangaPrototypeController() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const selected = params.get("variant")
  const variant = selected === "B" || selected === "C" || selected === "D" || selected === "E" ? selected : "A"

  useLayoutEffect(() => {
    document.documentElement.dataset.mangaVariant = variant
    document.documentElement.dataset.mangaMotion = "running"
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ desktop: "(min-width: 761px)", mobile: "(max-width: 760px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      console.info("Manga prototype state", { variant, name: names[variant], pathname, viewport: { width: innerWidth, height: innerHeight }, reducedMotion: context.conditions?.reduced, desktop: context.conditions?.desktop, theme: document.documentElement.className })
      if (context.conditions?.reduced) {
        document.documentElement.dataset.mangaMotion = "reduced"
        return
      }
      const timeline = gsap.timeline({ onComplete: () => { document.documentElement.dataset.mangaMotion = "settled" }, defaults: { duration: .48, ease: "power2.out", clearProps: "transform,opacity" } })
      const panels = document.querySelectorAll("[data-manga-enter]")
      if (panels.length) timeline.from(panels, { y: context.conditions?.desktop ? 24 : 10, opacity: .65, stagger: .09 })
      else document.documentElement.dataset.mangaMotion = "settled"
      for (const rule of document.querySelectorAll("[data-manga-rule]")) {
        gsap.from(rule, { scaleX: 0, transformOrigin: "left", duration: .6, ease: "power2.out", scrollTrigger: { trigger: rule, start: "top 90%", once: true } })
      }
    })
    return () => media.revert()
  }, [variant, pathname])

  function choose(next: typeof variants[number]) {
    const query = new URLSearchParams(params.toString())
    query.set("variant", next)
    router.replace(`${pathname}?${query}`, { scroll: false })
  }

  function cycle(direction: number) {
    choose(variants[(variants.indexOf(variant) + direction + variants.length) % variants.length])
  }

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    function keydown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (target.closest("input, textarea, select, [contenteditable], [role='dialog'], [role='tablist'], [role='menu'], [role='radiogroup'], [role='slider'], [role='combobox']") || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault()
        cycle(event.key === "ArrowRight" ? 1 : -1)
      }
    }
    window.addEventListener("keydown", keydown)
    return () => window.removeEventListener("keydown", keydown)
  })

  if (process.env.NODE_ENV === "production") return null
  return <nav className="manga-prototype-switcher" aria-label="Prototype variants"><button type="button" onClick={() => cycle(-1)} aria-label="Previous design variant">←</button><label className="sr-only" htmlFor="hero-prototype-choice">Hero prototype</label><select id="hero-prototype-choice" value={variant} onChange={(event) => choose(event.target.value as typeof variants[number])}>{variants.map((key) => <option value={key} key={key}>{key} — {names[key]}</option>)}</select><button type="button" onClick={() => cycle(1)} aria-label="Next design variant">→</button></nav>
}
