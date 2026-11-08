"use client"

import { useCallback, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import "./prototype-switcher.css"

const variants = [
  { key: "editorial", label: "A · Editorial" },
  { key: "fieldnotes", label: "B · Field notes" },
  { key: "visual", label: "C · Visual essay" },
] as const

type Variant = typeof variants[number]["key"]

export function PrototypeSwitcher({ variant, view }: { variant: Variant; view: "article" | "index" }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const current = variants.findIndex((item) => item.key === variant)
  const navigate = useCallback((key: string, value: string) => {
    const query = new URLSearchParams(searchParams.toString())
    query.set(key, value)
    startTransition(() => router.replace(`/prototype/blog?${query}`, { scroll: false }))
  }, [router, searchParams])
  const cycle = useCallback((direction: number) => {
    navigate("variant", variants[(current + direction + variants.length) % variants.length].key)
  }, [current, navigate])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], [role='textbox']")) return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      cycle(event.key === "ArrowRight" ? 1 : -1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cycle])

  return (
    <nav className="prototype-switcher" aria-label="Blog prototype controls" aria-busy={pending}>
      <span className="prototype-switcher-tag">Prototype</span>
      <div className="prototype-switcher-cycle">
        <button aria-label="Previous style" onClick={() => cycle(-1)} disabled={pending}>←</button>
        <span aria-live="polite" className="prototype-switcher-label">{variants[current].label}</span>
        <button aria-label="Next style" onClick={() => cycle(1)} disabled={pending}>→</button>
      </div>
      <div className="prototype-switcher-views" role="group" aria-label="Preview page">
        <button aria-pressed={view === "index"} onClick={() => navigate("view", "index")} disabled={pending}>Index</button>
        <button aria-pressed={view === "article"} onClick={() => navigate("view", "article")} disabled={pending}>Article</button>
      </div>
    </nav>
  )
}
