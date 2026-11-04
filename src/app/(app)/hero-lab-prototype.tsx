"use client"

import { useState, type CSSProperties } from "react"
import { useSearchParams } from "next/navigation"

const ranges = [
  { key: "size", label: "Name size", min: 80, max: 120, initial: 100 },
  { key: "portrait", label: "Portrait width", min: 38, max: 58, initial: 46 },
  { key: "tone", label: "Screentone", min: 0, max: 60, initial: 22 },
  { key: "lines", label: "Impact lines", min: 0, max: 100, initial: 85 },
] as const

type RangeKey = (typeof ranges)[number]["key"]
type HeroSettings = Record<RangeKey, number> & {
  layout: "split" | "portrait" | "cover"
  type: "sans" | "geometric" | "serif"
}

export function useHeroSettings() {
  const params = useSearchParams()
  const layout = params.get("hero-layout")
  const type = params.get("hero-type")
  const settings: HeroSettings = {
    layout: layout === "portrait" || layout === "cover" ? layout : "split",
    type: type === "geometric" || type === "serif" ? type : "sans",
    size: 100,
    portrait: 46,
    tone: 22,
    lines: 85,
  }
  for (const range of ranges) {
    const raw = params.get(`hero-${range.key}`)
    const value = raw === null || raw === "" ? range.initial : Number(raw)
    settings[range.key] = Number.isFinite(value)
      ? Math.min(range.max, Math.max(range.min, value))
      : range.initial
  }
  const style = {
    "--hero-type-scale": settings.size / 100,
    "--hero-portrait": `${settings.portrait}%`,
    "--hero-tone": settings.tone / 100,
    "--hero-lines": settings.lines / 100,
  } as CSSProperties
  return { settings, style }
}

function updateSetting(key: keyof HeroSettings, value: string) {
  const url = new URL(window.location.href)
  url.searchParams.set(`hero-${key}`, value)
  window.history.replaceState(null, "", url)
}

export function HeroLab({ settings }: { settings: HeroSettings }) {
  const [copyStatus, setCopyStatus] = useState("")
  if (process.env.NODE_ENV === "production") return null

  function reset() {
    const url = new URL(window.location.href)
    for (const key of Object.keys(settings)) url.searchParams.delete(`hero-${key}`)
    window.history.replaceState(null, "", url)
    setCopyStatus("")
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyStatus("Link copied")
    } catch {
      setCopyStatus("Copy failed. Use the address bar.")
    }
  }

  return (
    <details className="hero-lab">
      <summary>Hero lab</summary>
      <div className="hero-lab-controls">
        <label htmlFor="hero-layout">Layout</label>
        <select id="hero-layout" value={settings.layout} onChange={(event) => updateSetting("layout", event.target.value)}>
          <option value="split">Split</option>
          <option value="portrait">Portrait lead</option>
          <option value="cover">Wide cover</option>
        </select>
        <label htmlFor="hero-type">Typeface</label>
        <select id="hero-type" value={settings.type} onChange={(event) => updateSetting("type", event.target.value)}>
          <option value="sans">DM Sans</option>
          <option value="geometric">Cal Sans</option>
          <option value="serif">Instrument Serif</option>
        </select>
        {ranges.map((range) => (
          <div className="hero-lab-range" data-hero-control={range.key} key={range.key}>
            <label htmlFor={`hero-${range.key}`}>{range.label}</label>
            <output htmlFor={`hero-${range.key}`}>{settings[range.key]}%</output>
            <input id={`hero-${range.key}`} type="range" min={range.min} max={range.max} value={settings[range.key]} disabled={range.key === "portrait" && settings.layout === "cover"} onChange={(event) => updateSetting(range.key, event.target.value)}/>
          </div>
        ))}
        <div className="hero-lab-actions">
          <button type="button" onClick={reset}>Reset</button>
          <button type="button" onClick={copyLink}>Copy link</button>
        </div>
        <span className="hero-lab-status" role="status">{copyStatus}</span>
      </div>
    </details>
  )
}
