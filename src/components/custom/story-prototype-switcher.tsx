"use client"

import { useEffect } from "react"
import type { StoryVariant } from "@/app/(app)/story-scene-prototype-types"

const choices = ["A", "B", "C"] as const
const names = { A: "Ink Dioramas", B: "Panel Tunnel", C: "Turning Volume" }

export function StoryPrototypeSwitcher({ variant, onChange }: { variant: StoryVariant; onChange: (value: StoryVariant) => void }) {
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target instanceof Element && event.target.closest("input, textarea, select, button, a, [contenteditable], [role='dialog'], [role='slider'], [role='combobox']")) return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      const delta = event.key === "ArrowLeft" ? -1 : 1
      onChange(choices[(choices.indexOf(variant) + delta + 3) % 3])
    }
    window.addEventListener("keydown", keyboard)
    return () => window.removeEventListener("keydown", keyboard)
  }, [variant, onChange])

  if (process.env.NODE_ENV === "production") return null
  return <nav className="story-prototype-switcher" aria-label="Three.js story comparison">
    <button type="button" aria-label="Previous story design" onClick={() => onChange(choices[(choices.indexOf(variant) + 2) % 3])}>←</button>
    <span aria-live="polite"><small>Three.js story study</small>{variant} · {names[variant]}</span>
    <button type="button" aria-label="Next story design" onClick={() => onChange(choices[(choices.indexOf(variant) + 1) % 3])}>→</button>
  </nav>
}
