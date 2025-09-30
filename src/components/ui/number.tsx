"use client"

import React from "react"
import NumberFlow, { continuous } from "@number-flow/react"

interface NumberFlowProps
  extends Omit<React.ComponentProps<typeof NumberFlow>, "value"> {
  value: number | string
}

export const NumberFlowComponent: React.FC<NumberFlowProps> = (props) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [displayValue, setDisplayValue] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          setDisplayValue(Number(props.value) || 0)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible, props.value])

  return (
    <div ref={ref}>
      <NumberFlow
        trend={1}
        respectMotionPreference={true}
        plugins={[continuous]}
        {...props}
        value={displayValue}
      />
    </div>
  )
}
