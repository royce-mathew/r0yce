"use client"

import * as React from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

interface MdxMotionBlockProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  scale?: number
}

/**
 * React's drag/animation handler and `style` types collide with Motion's
 * equivalents, so plain `ImgHTMLAttributes` is not assignable to the props of
 * `motion.img`. MDX-rendered images never supply any of them — the animated
 * style is owned by this component — so drop them from the accepted props.
 */
export type MdxImgAttributes = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  | "style"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>

interface MdxMotionImageProps extends MdxImgAttributes {
  intensity?: number
  scale?: number
}

export const StepsContext = React.createContext<boolean>(false)

export function MdxMotionBlock({
  children,
  className,
  intensity = 12,
  scale = 0.992,
}: MdxMotionBlockProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isInsideSteps = React.useContext(StepsContext)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // The parallax drift stays monotonic — it should track the scroll direction.
  // Opacity and scale peak while the block sits mid-viewport and ease off at
  // both ends, with a plateau through the middle so the top of the peak isn't
  // a single instant. Mapping them 0 → 1 put full brightness at the moment the
  // block left the top of the screen.
  const y = useTransform(scrollYProgress, [0, 1], [intensity, -intensity])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.68, 1, 1, 0.68]
  )
  const animatedScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [scale, 1, 1, scale]
  )
  const transformOrigin = isInsideSteps ? "left center" : "50% 50%"

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={
        prefersReducedMotion
          ? undefined
          : {
              y,
              scale: animatedScale,
              opacity,
              transformOrigin,
            }
      }
    >
      {children}
    </motion.div>
  )
}

export function MdxMotionImage({
  className,
  intensity = 18,
  scale = 0.985,
  alt,
  ...props
}: MdxMotionImageProps) {
  const ref = React.useRef<HTMLImageElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Same curve as MdxMotionBlock: brightest through the middle of the pass.
  const y = useTransform(scrollYProgress, [0, 1], [intensity, -intensity])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.68, 1, 1, 0.68]
  )
  const animatedScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [scale, 1, 1, scale]
  )

  return (
    <motion.img
      ref={ref}
      className={cn(
        "mx-auto block rounded-2xl border border-border/70 shadow-[0_30px_90px_rgba(0,0,0,0.12)]",
        className
      )}
      alt={alt ?? ""}
      style={
        prefersReducedMotion
          ? undefined
          : {
              y,
              scale: animatedScale,
              opacity,
              transformOrigin: "50% 50%",
            }
      }
      {...props}
    />
  )
}
