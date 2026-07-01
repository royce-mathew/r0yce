"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

interface ClientHeaderWrapperProps {
  children: React.ReactNode
}

export function ClientHeaderWrapper({ children }: ClientHeaderWrapperProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.header>
  )
}
