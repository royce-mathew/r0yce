"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

interface TypewriterProps {
  text: string
  className?: string
  typingSpeed?: number
  startDelay?: number
  cursorClassName?: string
}

type TypewriterAnimationProps = Required<TypewriterProps>

export function Typewriter({
  text,
  className = "",
  typingSpeed = 200,
  startDelay = 200,
  cursorClassName = "text-foreground",
}: TypewriterProps) {
  // A changed script or timing should start from an empty line, not resume the old one.
  return (
    <TypewriterAnimation
      key={`${text}:${typingSpeed}:${startDelay}`}
      text={text}
      className={className}
      typingSpeed={typingSpeed}
      startDelay={startDelay}
      cursorClassName={cursorClassName}
    />
  )
}

function TypewriterAnimation({
  text,
  className,
  typingSpeed,
  startDelay,
  cursorClassName,
}: TypewriterAnimationProps) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let index = 0
    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1
        setDisplayText(text.slice(0, index))

        if (index >= text.length && intervalId !== undefined) {
          window.clearInterval(intervalId)
        }
      }, typingSpeed)
    }, startDelay)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
      }
    }
  }, [startDelay, text, typingSpeed])

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
