"use client"

import { useEffect } from "react"
import "./prototype-switcher.css"

type PrototypeSwitcherProps = {
  label: string
  variants: readonly { key: string; name: string }[]
  current: string
  onChange: (key: string) => void
}

export function PrototypeSwitcher({ label, variants, current, onChange }: PrototypeSwitcherProps) {
  const index = variants.findIndex((variant) => variant.key === current)
  const cycle = (direction: number) => onChange(variants[(index + direction + variants.length) % variants.length].key)

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='combobox'], [role='slider'], [role='dialog']")) return
      if (target?.closest("a, button") && !target.closest("[data-prototype-switcher]")) return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      onChange(variants[(index + (event.key === "ArrowRight" ? 1 : -1) + variants.length) % variants.length].key)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [index, variants, onChange])

  if (process.env.NODE_ENV === "production") return null

  return (
    <aside className="prototype-switcher" data-prototype-switcher aria-label="Prototype layout comparison">
      <button type="button" onClick={() => cycle(-1)} aria-label="Previous layout">←</button>
      <div className="prototype-switcher-label"><span>{label}</span><strong aria-live="polite">{current} / {variants[index].name}</strong></div>
      <button type="button" onClick={() => cycle(1)} aria-label="Next layout">→</button>
    </aside>
  )
}
