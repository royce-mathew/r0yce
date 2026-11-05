"use client"

import { useId } from "react"
import { creationHands } from "./creation-hands-paths"

// The fingertips nearly touch here in the traced fresco crop; focus lines and the spark radiate from it.
export const creationGap = { x: 634, y: 225 }

// Manga focus lines: uneven angles and lengths so the burst reads hand-ruled, not a perfect sunburst.
const focusLines = Array.from({ length: 44 }, (_, index) => {
  const angle = (index / 44) * Math.PI * 2 + Math.sin(index * 12.9898) * .05
  const inner = 150 + ((index * 37) % 7) * 18
  const point = (radius: number) => `${(creationGap.x + Math.cos(angle) * radius).toFixed(1)} ${(creationGap.y + Math.sin(angle) * radius * .6).toFixed(1)}`
  return `M${point(inner)}L${point(900)}`
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
      </defs>
      <path className="me-creation-focus" d={focusLines} stroke="currentColor" strokeWidth=".8" opacity=".28" />
      <Hand name="adam" id={id} />
      <Hand name="creator" id={id} />
      <g className="me-creation-spark" stroke="var(--me-void-accent)" strokeWidth="2.2" strokeLinecap="round">
        <path d={`M${creationGap.x} ${creationGap.y - 26}v-14M${creationGap.x} ${creationGap.y + 26}v14M${creationGap.x - 20} ${creationGap.y - 18}l-9-9M${creationGap.x + 20} ${creationGap.y - 18}l9-9M${creationGap.x - 20} ${creationGap.y + 18}l-9 9M${creationGap.x + 20} ${creationGap.y + 18}l9 9`} />
      </g>
    </svg>
  )
}
