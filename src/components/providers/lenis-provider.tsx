"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Lenis from "lenis"

type LenisScrollState = {
  scrollY: number
  viewportHeight: number
}

const LenisScrollContext = createContext<LenisScrollState | null>(null)

export function useLenisScroll() {
  const context = useContext(LenisScrollContext)

  if (!context) {
    return { scrollY: 0, viewportHeight: 0 }
  }

  return context
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [scrollState, setScrollState] = useState<LenisScrollState>({
    scrollY: 0,
    viewportHeight: 0,
  })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
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

    const updateScrollState = () => {
      setScrollState({
        scrollY: lenis.scroll,
        viewportHeight: window.innerHeight,
      })
    }

    lenis.on("scroll", updateScrollState)
    updateScrollState()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.off("scroll", updateScrollState)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const contextValue = useMemo(() => scrollState, [scrollState])

  return (
    <LenisScrollContext.Provider value={contextValue}>
      {children}
    </LenisScrollContext.Provider>
  )
}
