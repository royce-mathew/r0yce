"use client"

import { useId } from "react"
import { creationHands } from "./creation-hands-paths"

// The fingertips nearly touch here in the traced fresco crop; focus lines and the spark radiate from it.
export const creationGap = { x: 634, y: 225 }

// Uneven rays keep the burst closer to ruled manga ink than a regular sunburst.
const focusLines = Array.from({ length: 76 }, (_, index) => {
  const angle = (index / 76) * Math.PI * 2 + Math.sin(index * 12.9898) * .025
  const inner = 65 + ((index * 37) % 11) * 9
  const point = (radius: number) => `${(creationGap.x + Math.cos(angle) * radius).toFixed(1)} ${(creationGap.y + Math.sin(angle) * radius * .65).toFixed(1)}`
  return `M${point(inner)}L${point(950)}`
}).join("")

const impactShards = Array.from({ length: 23 }, (_, index) => {
  const angle = index / 23 * Math.PI * 2
  const outer = 65 + (index * 31) % 80
  const point = (radius: number, offset = 0) => `${(creationGap.x + Math.cos(angle + offset) * radius).toFixed(1)} ${(creationGap.y + Math.sin(angle + offset) * radius).toFixed(1)}`
  return `M${point(28, -.025)}L${point(outer)}L${point(40, .026)}Z`
}).join("")

function Hand({ name, id }: { name: keyof typeof creationHands, id: string }) {
  const hand = creationHands[name]
  return (
    <g className={`me-creation-hand me-creation-${name}`}>
      <path d={hand.silhouette} fill="var(--me-void-paper)" />
      <g className="me-creation-tone">
        <path d={hand.light} fill={`url(#${id}-light)`} />
        <path d={hand.dense} fill={`url(#${id}-dense)`} />
      </g>
      <path d={hand.ink} fill="currentColor" />
      <path d={hand.silhouette} stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </g>
  )
}

export function CreationHandsPrototype() {
  const id = useId()
  return (
    <svg className="me-creation-art" viewBox="0 100 1215 256" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-light`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="2.5" cy="2.5" r=".75" fill="currentColor" /></pattern>
        <pattern id={`${id}-dense`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="2.5" cy="2.5" r="1.3" fill="currentColor" /></pattern>
        <pattern id={`${id}-sketch`} width="31" height="27" patternUnits="userSpaceOnUse">
          <path d="M-5 29 23-4M4 32 34-3M-8 6 34 23M-6 12 26 26" stroke="var(--me-void-paper)" strokeWidth=".7" opacity=".24" />
          <path d="m0 22 24-26m-6 34 20-24" stroke="currentColor" strokeWidth="1.2" opacity=".65" />
        </pattern>
        <radialGradient id={`${id}-halo`} gradientUnits="userSpaceOnUse" cx="634" cy="225" r="160">
          <stop stopColor="var(--me-void-paper)" />
          <stop offset=".24" stopColor="var(--me-void-accent)" stopOpacity=".7" />
          <stop offset="1" stopColor="var(--me-void-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="me-creation-backdrop">
        <path d="M-500-500H1800V900H-500Z" fill="#353831" />
        <path d="M-500-500H1800V900H-500Z" fill={`url(#${id}-sketch)`} />
        <g stroke="var(--me-void-paper)" strokeWidth="1.1" opacity=".22">
          <path d="M-30 160Q80 112 170 143T340 116Q410 75 495 114M-30 166Q90 122 174 149T342 123M760 112Q820 72 916 108T1100 80Q1200 46 1300 94M-30 331Q120 280 239 327T430 350M810 351Q940 296 1050 337T1300 309" />
          <path d="M70 118q40-32 99-15m50 40q75-51 130-18M874 92q58-42 113-21m62 51q74-38 135-26M70 326q80-29 155 11m670-5q90-37 156 2" strokeDasharray="24 7 5 11" />
        </g>
      </g>
      <g className="me-creation-energy">
        <circle cx="634" cy="225" r="160" fill={`url(#${id}-halo)`} />
        <path d={impactShards} fill="var(--me-void-paper)" opacity=".9" />
        <path d="m634 119-6 55 12-5-7 40m7 40-9 36 11-5-8 58M531 224l48-6-8 9 43-4m42 2 45-8-9 11 45-3" stroke="var(--me-void-accent)" strokeWidth="2.4" strokeLinejoin="round" />
      </g>
      <path className="me-creation-focus" d={focusLines} stroke="var(--me-void-paper)" strokeWidth="1" opacity=".5" />
      <Hand name="adam" id={id} />
      <Hand name="creator" id={id} />
      <g className="me-creation-spark">
        <path d="m634 201 3 19 9 5-9 4-3 20-3-20-8-4 8-5Z" fill="var(--me-void-paper)" stroke="var(--me-void-accent)" strokeWidth="1" />
        <path d="m634 170 2 17m-27 9-9-12m58 12 10-14m-34 79v15" stroke="var(--me-void-accent)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}
