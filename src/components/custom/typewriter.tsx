"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

interface TypewriterProps {
  text: string
  className?: string
  typingSpeed?: number
  startDelay?: number
  cursorClassName?: string
}

export function Typewriter({
  text,
  className = "",
  typingSpeed = 200,
  startDelay = 200,
  cursorClassName = "text-foreground",
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const indexRef = useRef(0) // Store the current index in a ref to avoid closure issues

  useEffect(() => {
    // Reset state
    setDisplayText("")
    setIsTypingComplete(false)
    indexRef.current = 0 // Reset index when text changes

    // Use interval for more reliable typing
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (indexRef.current < text.length) {
          // Use functional update to ensure we're working with the latest state
          setDisplayText(text.substring(0, indexRef.current + 1))
          indexRef.current += 1

          // Check if this is the last character
          if (indexRef.current === text.length) {
            setIsTypingComplete(true)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
          }
        }
      }, typingSpeed)
    }, startDelay)

    // Clean up on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [text, typingSpeed, startDelay])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        className={`inline-block ${cursorClassName}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1] }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 0.8,
        }}
      >
        |
      </motion.span>
    </span>
  )
}
