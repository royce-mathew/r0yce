"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { useLenisScroll } from "@/components/providers/lenis-provider"

interface MdxMotionBlockProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  scale?: number
}

interface MdxMotionImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
  const { scrollY, viewportHeight } = useLenisScroll()
  const [layout, setLayout] = React.useState({ top: 0, height: 0 })

  React.useLayoutEffect(() => {
    const measure = () => {
      const element = ref.current

      if (!element) {
        return
      }

      const rect = element.getBoundingClientRect()

      setLayout({
        top: rect.top + window.scrollY,
        height: rect.height,
      })
    }

    measure()
    window.addEventListener("resize", measure)

    return () => window.removeEventListener("resize", measure)
  }, [])

  const progress = React.useMemo(() => {
    if (!layout.height || !viewportHeight) {
      return 0
    }

    const rawProgress =
      (scrollY + viewportHeight - layout.top) / (viewportHeight + layout.height)

    return Math.min(1, Math.max(0, rawProgress))
  }, [layout.height, layout.top, scrollY, viewportHeight])

  const y = intensity - progress * intensity * 2
  const opacity = 0.68 + progress * 0.32
  const animatedScale = scale + progress * (1 - scale)
  const transformOrigin = isInsideSteps ? "left center" : "50% 50%"

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={
        prefersReducedMotion
          ? undefined
          : {
              transform: `translate3d(0, ${y}px, 0) scale(${animatedScale})`,
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

  const { scrollY, viewportHeight } = useLenisScroll()
  const [layout, setLayout] = React.useState({ top: 0, height: 0 })

  React.useLayoutEffect(() => {
    const measure = () => {
      const element = ref.current

      if (!element) {
        return
      }

      const rect = element.getBoundingClientRect()

      setLayout({
        top: rect.top + window.scrollY,
        height: rect.height,
      })
    }

    measure()
    window.addEventListener("resize", measure)

    return () => window.removeEventListener("resize", measure)
  }, [])

  const progress = React.useMemo(() => {
    if (!layout.height || !viewportHeight) {
      return 0
    }

    const rawProgress =
      (scrollY + viewportHeight - layout.top) / (viewportHeight + layout.height)

    return Math.min(1, Math.max(0, rawProgress))
  }, [layout.height, layout.top, scrollY, viewportHeight])

  const y = intensity - progress * intensity * 2
  const opacity = 0.68 + progress * 0.32
  const animatedScale = scale + progress * (1 - scale)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
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
              transform: `translate3d(0, ${y}px, 0) scale(${animatedScale})`,
              opacity,
              willChange: "transform",
              transformOrigin: "50% 50%",
            }
      }
      {...props}
    />
  )
}
