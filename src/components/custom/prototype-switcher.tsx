"use client"

import { useEffect } from "react"
import "./prototype-switcher.css"

type Study = { key: string; name: string }

export function PrototypeSwitcher({ studies, current, onChange }: { studies: readonly Study[]; current: string; onChange: (key: string) => void }) {
  const index = studies.findIndex(study => study.key === current)
  const cycle = (direction: number) => onChange(studies[(index + direction + studies.length) % studies.length].key)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return
      if (event.target instanceof Element && event.target.closest("input, textarea, select, button, a, [contenteditable], [role='slider'], [role='combobox'], [role='dialog']")) return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      onChange(studies[(index + (event.key === "ArrowRight" ? 1 : -1) + studies.length) % studies.length].key)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, onChange, studies])

  if (process.env.NODE_ENV === "production") return null

  return (
    <nav className="prototype-switcher" aria-label="Character design comparison">
      <button type="button" aria-label="Previous character design" onClick={() => cycle(-1)}>←</button>
      <span aria-live="polite"><small>Character study</small>{current} · {studies[index].name}</span>
      <button type="button" aria-label="Next character design" onClick={() => cycle(1)}>→</button>
    </nav>
  )
}
