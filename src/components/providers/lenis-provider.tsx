"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // Disable Lenis on mobile/touch devices for better native scrolling performance
    const isMobileOrTouch =
      window.matchMedia("(max-width: 768px)").matches ||
      ("ontouchstart" in window) ||
      (navigator.maxTouchPoints > 0)

    if (prefersReducedMotion || isMobileOrTouch) {
      return
    }

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      infinite: false,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return children
}
