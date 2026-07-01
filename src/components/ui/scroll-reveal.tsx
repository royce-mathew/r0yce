"use client"

import React, { useRef } from "react"
import { motion, useInView } from "motion/react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  distance?: number
  duration?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  distance = 50,
  duration = 0.8,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-80px" })

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }

  const offset = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: offset.y,
        x: offset.x,
      }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0 }
          : { opacity: 0, y: offset.y, x: offset.x }
      }
      transition={{
        duration,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
