import type { MoodReading } from "#site-mood-engine"
import type { Ref } from "react"
import "./adaptive-cursor.css"

export function AdaptiveCursor({ cursorRef }: { cursorRef: Ref<HTMLDivElement> }) {
  return (
    <div
      aria-hidden="true"
      className="adaptive-cursor"
      data-mood-ignore=""
      hidden
      ref={cursorRef}
    >
      <svg className="adaptive-cursor-reticle" viewBox="0 0 32 32">
        <path d="M9 2H2v7m21-7h7v7M2 23v7h7m21-7v7h-7" />
      </svg>
      <svg className="adaptive-cursor-sparks" viewBox="0 0 80 80">
        <path d="m22 19 8 8M14 47l11-3m26 9 9 9" />
        <rect x="17" y="14" width="5" height="5" />
        <rect x="10" y="46" width="4" height="4" />
        <rect x="58" y="61" width="4" height="4" />
        <rect x="59" y="23" width="3" height="3" />
        <rect x="32" y="63" width="3" height="3" />
      </svg>
      <svg className="adaptive-cursor-lead" viewBox="0 0 22 23">
        <path d="M1 22V12l10-10h10" />
      </svg>
      <div className="adaptive-cursor-panel">
        <span className="adaptive-cursor-stamp">
          <span className="adaptive-cursor-swatch" />
          <span data-cursor-reading>Neutral · 0.00</span>
        </span>
        <span className="adaptive-cursor-detail" data-cursor-position />
        <span className="adaptive-cursor-detail" data-cursor-signals />
      </div>
    </div>
  )
}

export type CursorHud = {
  update(reading: MoodReading): void
  stop(): void
}

export function trackAdaptiveCursor(cursor: HTMLDivElement): CursorHud {
  const listeners = new AbortController()
  const sparks = cursor.querySelector(".adaptive-cursor-sparks")
  const headline = cursor.querySelector("[data-cursor-reading]")!
  const position = cursor.querySelector("[data-cursor-position]")!
  const signals = cursor.querySelector("[data-cursor-signals]")!
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  let pulse: Animation | undefined
  let frame = 0
  let x = 0
  let y = 0
  let latest: MoodReading | undefined

  function showReading({ mood, score, probabilities, fast }: MoodReading) {
    const state = mood ?? "neutral"
    const title = `${state} · ${score.toFixed(2)}`
    const detail = `L${probability(probabilities?.lost ?? 0)} C${probability(probabilities?.confused ?? 0)} F${probability((probabilities?.frustrated ?? 0) + (probabilities?.blocked ?? 0))} I${probability(fast)}`
    if (cursor.dataset.mood !== state) cursor.dataset.mood = state
    if (headline.textContent !== title) headline.textContent = title
    if (signals.textContent !== detail) signals.textContent = detail
  }

  function probability(value: number) {
    return value.toFixed(2).replace(/^0/, "")
  }

  function hide() {
    cancelAnimationFrame(frame)
    frame = 0
    cursor.hidden = true
    pulse?.cancel()
  }

  function follows(event: PointerEvent) {
    return (
      event.pointerType === "mouse" &&
      !reducedMotion.matches &&
      !(event.target instanceof Element && event.target.closest("[data-mood-ignore]"))
    )
  }

  const options = { passive: true, signal: listeners.signal }
  window.addEventListener("pointermove", (event) => {
    if (!follows(event)) {
      hide()
      return
    }

    x = event.clientX
    y = event.clientY
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const width = window.innerWidth
      const height = window.innerHeight
      cursor.toggleAttribute("data-flip-x", x > Math.max(width / 2, width - 218))
      cursor.toggleAttribute("data-flip-y", y < 70)
      position.textContent = `X${(x / width).toFixed(3).replace(/^0/, "")} Y${(y / height).toFixed(3).replace(/^0/, "")}`
      if (cursor.hidden && latest) showReading(latest)
      cursor.hidden = false
    })
  }, options)
  window.addEventListener("pointerdown", (event) => {
    if (!follows(event) || event.button !== 0 || cursor.hidden) return
    pulse?.cancel()
    pulse = sparks?.animate(
      [
        { scale: "0.5", opacity: 1 },
        { scale: "1", opacity: 0.85, offset: 0.35 },
        { scale: "1.35", opacity: 0.25 },
      ],
      { duration: 390, easing: "ease-out" }
    )
  }, options)
  document.documentElement.addEventListener("pointerleave", hide, options)
  window.addEventListener("blur", hide, options)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide()
  }, options)
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) hide()
  }, options)

  return {
    update(reading: MoodReading) {
      latest = reading
      if (!cursor.hidden) showReading(reading)
    },
    stop() {
      listeners.abort()
      hide()
    },
  }
}
