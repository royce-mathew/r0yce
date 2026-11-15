"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import "./prototype-switcher.css"

type Direction = { key: string; name: string }

export function PrototypeSwitcher({
  directions,
  activeKey,
}: {
  directions: readonly Direction[]
  activeKey: string
}) {
  const router = useRouter()
  const index = Math.max(0, directions.findIndex(({ key }) => key === activeKey))

  function cycle(offset: number) {
    const url = new URL(window.location.href)
    url.searchParams.set("variant", directions[(index + offset + directions.length) % directions.length].key)
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false })
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target instanceof Element && event.target.closest(
        "input, textarea, select, button, a, [contenteditable]:not([contenteditable='false']), [role='slider'], [role='spinbutton'], [role='tablist'], [role='listbox'], [role='menu'], [role='tree'], [role='grid'], [role='radiogroup']"
      )) return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      cycle(event.key === "ArrowLeft" ? -1 : 1)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  if (process.env.NODE_ENV === "production") return null

  return (
    <nav className="prototype-switcher" aria-label="Blog prototype directions">
      <button type="button" aria-label="Previous prototype direction" onClick={() => cycle(-1)}>←</button>
      <div className="prototype-switcher-label">
        <span>Prototype · {index + 1} / {directions.length}</span>
        <strong role="status" aria-live="polite">{directions[index].name}</strong>
      </div>
      <button type="button" aria-label="Next prototype direction" onClick={() => cycle(1)}>→</button>
      <span className="prototype-switcher-hint">← → to compare</span>
    </nav>
  )
}
