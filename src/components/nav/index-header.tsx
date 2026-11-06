"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./index-header.css"

type IndexHeaderProps = {
  navigation: ReactNode
  mobileNavigation: ReactNode
  tools: ReactNode
}

export function IndexHeader({ navigation, mobileNavigation, tools }: IndexHeaderProps) {
  const pathname = usePathname()
  const root = useRef<HTMLDivElement>(null)
  const isHome = pathname === "/"

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    element.dataset.surface = isHome ? "clear" : "dark"
    if (!isHome) return
    const hero = document.querySelector<HTMLElement>("[data-creation-hero]")
    const header = element.closest("header")
    if (!hero || !header) return

    gsap.registerPlugin(ScrollTrigger)
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top-=24",
      end: () => `top top-=${header.offsetHeight}`,
      onRefresh: self => { element.dataset.surface = self.scroll() >= self.start ? "dark" : "clear" },
      onEnter: () => { element.dataset.surface = "dark" },
      onLeaveBack: () => { element.dataset.surface = "clear" },
    })
    return () => trigger.kill()
  }, [isHome])

  return (
    <div ref={root} className="index-header" data-surface={isHome ? "clear" : "dark"}>
      <div className="index-header-inner">
        <div className="index-header-brand">{navigation}</div>
        <div className="index-header-tools">{tools}</div>
        <div className="index-header-menu">{mobileNavigation}</div>
      </div>
    </div>
  )
}
