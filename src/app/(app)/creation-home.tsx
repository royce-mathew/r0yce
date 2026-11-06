"use client"

import { useLayoutEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CreationHero } from "./creation-hero"
import { CreationAbout } from "./creation-about"
import "lenis/dist/lenis.css"
import "./creation-home.css"

export function CreationHome({ code }: { code: string }) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ duration: 1.05, anchors: true })
      const syncDialogScrollLock = () => {
        if (document.body.hasAttribute("data-scroll-locked")) lenis.stop()
        else lenis.start()
      }
      const dialogLock = new MutationObserver(syncDialogScrollLock)
      dialogLock.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] })
      syncDialogScrollLock()
      const tick = (time: number) => lenis.raf(time * 1000)
      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add(tick)
      return () => {
        dialogLock.disconnect()
        gsap.ticker.remove(tick)
        lenis.off("scroll", ScrollTrigger.update)
        lenis.destroy()
      }
    })
    return () => media.revert()
  }, [])

  return <main className="creation-home"><CreationHero /><CreationAbout code={code} /></main>
}
