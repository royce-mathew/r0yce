"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import "./layout-prototype-switcher.css"

export function LayoutPrototypeSwitcher({ current, variants, pathname }: {
  current: string
  variants: { key: string; name: string }[]
  pathname: string
}) {
  const router = useRouter()
  const currentIndex = variants.findIndex((variant) => variant.key === current)
  const choose = useCallback((key: string) => {
    router.replace(`${pathname}?variant=${encodeURIComponent(key)}`, { scroll: false })
  }, [pathname, router])
  const move = useCallback((direction: number) => {
    const start = currentIndex < 0 ? (direction > 0 ? -1 : 0) : currentIndex
    choose(variants[(start + direction + variants.length) % variants.length].key)
  }, [choose, currentIndex, variants])

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]")) return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      move(event.key === "ArrowLeft" ? -1 : 1)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [move])

  if (process.env.NODE_ENV === "production") return null

  return (
    <nav className="layout-prototype-switcher" aria-label="Layout prototype comparison">
      <button type="button" aria-label="Previous layout prototype" onClick={() => move(-1)}><IconArrowLeft size={18} aria-hidden="true" /></button>
      <label>
        <span aria-live="polite">Layout prototype · {currentIndex < 0 ? "Original" : `${currentIndex + 1}/${variants.length}`}</span>
        <select aria-label="Choose layout prototype" value={current} onChange={(event) => choose(event.target.value)}>
          {variants.map((variant) => <option key={variant.key} value={variant.key}>{variant.key} · {variant.name}</option>)}
          <option value="current">Original page</option>
        </select>
      </label>
      <button type="button" aria-label="Next layout prototype" onClick={() => move(1)}><IconArrowRight size={18} aria-hidden="true" /></button>
    </nav>
  )
}
