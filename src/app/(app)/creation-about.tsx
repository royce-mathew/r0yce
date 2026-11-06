"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mdx } from "@/components/mdx/mdx-components"
import { JourneyCharacter } from "./creation-character"
import "./creation-about.css"

export function CreationAbout({ code }: { code: string }) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = root.current
    if (!section) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const joint = (name: string, origin: string) => {
        const element = section.querySelector(`[data-walk="${name}"]`)
        gsap.set(element, { svgOrigin: origin })
        return gsap.quickSetter(element, "rotation", "deg")
      }
      const frontLeg = joint("leg-front", "105 320")
      const backLeg = joint("leg-back", "140 320")
      const frontShin = joint("shin-front", "102 452")
      const backShin = joint("shin-back", "151 452")
      const frontArm = joint("arm-front", "73 164")
      const backArm = joint("arm-back", "168 166")
      const forearm = joint("forearm-front", "65 280")
      const head = joint("head", "114 132")
      const bob = gsap.quickSetter(section.querySelector(".creation-walker-body"), "y", "px")
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: self => {
          const phase = self.progress * Math.PI * 24
          const stride = Math.sin(phase)
          frontLeg(stride * 20)
          backLeg(-stride * 20)
          frontShin(Math.max(0, -stride) * 30)
          backShin(Math.max(0, stride) * 30)
          frontArm(-stride * 18)
          backArm(stride * 18)
          forearm(-8 - Math.max(0, stride) * 14)
          head(Math.sin(phase + .5) * 2)
          bob(-Math.abs(Math.cos(phase)) * 4)
        },
      })
    }, root)
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refresh)
      media.revert()
    }
  }, [])

  return (
    <section ref={root} id="scroll-about" className="creation-about" aria-labelledby="scroll-about-title">
      <div className="creation-about-layout">
        <aside className="creation-journey" aria-hidden="true">
          <div className="creation-journey-track" />
          <div className="creation-journey-steps">{Array.from({ length: 18 }, (_, i) => <i key={i} />)}</div>
          <div className="creation-journey-scenes"><i /><i /><i /></div>
          <div className="creation-journey-sticky"><JourneyCharacter /></div>
        </aside>
        <div className="creation-about-copy">
          <h2 id="scroll-about-title">About &amp; experience<span>.</span></h2>
          <div className="prose-content"><Mdx code={code} className="mdx-shell-about" /></div>
          <a className="creation-about-resume" href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  )
}
