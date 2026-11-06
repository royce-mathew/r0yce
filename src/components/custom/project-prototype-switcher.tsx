"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

const variants = ["A", "B", "C"] as const
const names = { A: "Quiet editorial", B: "Visual case study", C: "Project dossier" }

export function ProjectPrototypeSwitcher({ current }: { current: "A" | "B" | "C" }) {
  const router = useRouter()
  const cycle = useCallback((step: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set("variant", variants[(variants.indexOf(current) + step + variants.length) % variants.length])
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: true })
  }, [current, router])

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='dialog']")) return
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault()
        cycle(event.key === "ArrowRight" ? 1 : -1)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cycle])

  if (process.env.NODE_ENV === "production") return null
  return (
    <nav className="pd-switcher" aria-label="Project page prototypes">
      <button onClick={() => cycle(-1)} aria-label="Previous prototype"><IconArrowLeft size={18} aria-hidden="true" /></button>
      <span aria-live="polite"><small>Prototype {current} · {variants.indexOf(current) + 1}/3</small><strong>{names[current]}</strong></span>
      <button onClick={() => cycle(1)} aria-label="Next prototype"><IconArrowRight size={18} aria-hidden="true" /></button>
    </nav>
  )
}
