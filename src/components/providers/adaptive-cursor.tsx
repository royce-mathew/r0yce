import type { MoodReading } from "#site-mood-engine"
import type { Ref } from "react"
import "./adaptive-cursor.css"

const CONTROL = 'a[href],button,input:not([type="hidden"]),select,textarea,summary,[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="radio"],[role="switch"],[role="menuitem"],[role="option"]'
const IGNORED = "[data-mood-ignore]"
const BURST = [[-27, -18], [22, -28], [31, 11], [-20, 26], [8, 33], [-34, 5], [3, -19], [19, 16]]
const PARTICLE_COUNT = 20
const PANEL_CLEARANCE = 252
const PANEL_TOP_ZONE = 176

function controlName(control: Element) {
  const labelledBy = control.getAttribute("aria-labelledby")?.trim()
  const label = labelledBy?.split(/\s+/)
    .map((id) => document.getElementById(id)?.textContent)
    .join(" ").trim()
  return (label || control.getAttribute("aria-label")?.trim() ||
    (control.matches("button,a,summary,[role]") ? control.textContent?.trim() : "") ||
    control.getAttribute("role") || control.localName).replace(/\s+/g, " ").slice(0, 64)
}

export function AdaptiveCursor({ cursorRef }: { cursorRef: Ref<HTMLDivElement> }) {
  return (
    <div
      aria-hidden="true"
      className="adaptive-cursor"
      data-mood-ignore=""
      hidden
      ref={cursorRef}
    >
      <div className="adaptive-cursor-reticle">
        <i /><i /><i /><i />
      </div>
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <span className="adaptive-cursor-particle" key={index} />
      ))}
      <div className="adaptive-cursor-anchor">
        <svg className="adaptive-cursor-lead" viewBox="0 0 22 23">
          <path d="M1 22V12l10-10h10" />
        </svg>
        <div className="adaptive-cursor-panel">
          <span className="adaptive-cursor-stamp">
            <span className="adaptive-cursor-swatch" />
            <span data-cursor-reading>Neutral-0.00</span>
          </span>
          <span className="adaptive-cursor-detail" data-cursor-position />
          <span className="adaptive-cursor-detail" data-cursor-signals />
          <span className="adaptive-cursor-target" data-cursor-target hidden />
        </div>
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
  const reticle = cursor.querySelector<HTMLElement>(".adaptive-cursor-reticle")!
  const anchor = cursor.querySelector<HTMLElement>(".adaptive-cursor-anchor")!
  const particles = cursor.querySelectorAll<HTMLElement>(".adaptive-cursor-particle")
  const targetText = cursor.querySelector<HTMLElement>("[data-cursor-target]")!
  const headline = cursor.querySelector("[data-cursor-reading]")!
  const position = cursor.querySelector("[data-cursor-position]")!
  const signals = cursor.querySelector("[data-cursor-signals]")!
  const motion = window.matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)")
  let particleIndex = 0
  const animations: (Animation | undefined)[] = Array(PARTICLE_COUNT)
  let pulse: Animation | undefined
  let frame = 0
  let x = 0
  let y = 0
  let visible = false
  let trailX = 0
  let trailY = 0
  let target: Element | null = null
  let frameX = NaN
  let frameY = NaN
  let frameWidth = NaN
  let frameHeight = NaN
  let anchorX = NaN
  let anchorY = NaN
  let flipX = false
  let flipY = false
  let latest: MoodReading | undefined

  function showReading({ mood, score, probabilities, fast }: MoodReading) {
    const state = mood ?? "neutral"
    const title = `${state}-${score.toFixed(2)}`
    const detail = `L${probability(probabilities?.lost ?? 0)} C${probability(probabilities?.confused ?? 0)} F${probability((probabilities?.frustrated ?? 0) + (probabilities?.blocked ?? 0))} I${probability(fast)}`
    if (cursor.dataset.mood !== state) cursor.dataset.mood = state
    if (headline.textContent !== title) headline.textContent = title
    if (signals.textContent !== detail) signals.textContent = detail
  }

  function probability(value: number) {
    return value.toFixed(2).replace(/^0/, "")
  }

  function emit(px: number, py: number, dx: number, dy: number, size: number, trail = false) {
    const slot = particleIndex
    particleIndex = (slot + 1) % PARTICLE_COUNT
    const particle = particles[slot]
    animations[slot]?.cancel()
    const angle = trail ? Math.atan2(-dy, -dx) : 0
    particle.style.width = particle.style.height = `${size}px`
    particle.style.setProperty("--tether", `${trail ? Math.min(46, Math.hypot(dx, dy) * 3) : 0}px`)
    particle.toggleAttribute("data-solid", size < 4)
    animations[slot] = particle.animate(
      [
        { transform: `translate3d(${px}px, ${py}px, 0) rotate(${angle}rad)`, opacity: trail ? 0.5 : 0.95 },
        { transform: `translate3d(${px + dx}px, ${py + dy}px, 0) rotate(${angle}rad)`, opacity: 0 },
      ],
      { duration: trail ? 310 : 460, easing: "cubic-bezier(.15,.65,.35,1)" }
    )
  }

  function hide() {
    cancelAnimationFrame(frame)
    frame = 0
    if (!visible) return
    visible = false
    target = null
    frameX = NaN
    cursor.hidden = true
    cursor.removeAttribute("data-locked")
    pulse?.cancel()
    for (const animation of animations) animation?.cancel()
  }

  function paint() {
    frame = 0
    const width = window.innerWidth
    const height = window.innerHeight
    const hit = document.elementFromPoint(x, y)
    if (!hit || hit.closest(IGNORED)) {
      hide()
      return
    }

    let control = hit.closest(CONTROL)
    let bounds = control?.getBoundingClientRect()
    if (!control && target?.isConnected) {
      const previous = target.getBoundingClientRect()
      if (x >= previous.left - 6 && x <= previous.right + 6 &&
          y >= previous.top - 6 && y <= previous.bottom + 6) {
        control = target
        bounds = previous
      }
    }
    if (control !== target) {
      target = control
      cursor.toggleAttribute("data-locked", control !== null)
    }

    const disabled = !!control?.matches(':disabled,[aria-disabled="true"]')
    const description = control ? `▸ ${controlName(control)}${disabled ? " · disabled" : ""}` : ""
    if (targetText.textContent !== description) {
      targetText.textContent = description
      targetText.hidden = !control
      targetText.toggleAttribute("data-disabled", disabled)
    }

    const left = bounds ? Math.max(2, bounds.left - 4) : x - 16
    const top = bounds ? Math.max(2, bounds.top - 4) : y - 16
    const right = bounds ? Math.min(width - 2, bounds.right + 4) : x + 16
    const bottom = bounds ? Math.min(height - 2, bounds.bottom + 4) : y + 16
    const boxWidth = right - left
    const boxHeight = bottom - top
    if (frameX !== left || frameY !== top || frameWidth !== boxWidth || frameHeight !== boxHeight) {
      frameX = left
      frameY = top
      frameWidth = boxWidth
      frameHeight = boxHeight
      reticle.style.transform = `translate3d(${left}px, ${top}px, 0)`
      reticle.style.width = `${boxWidth}px`
      reticle.style.height = `${boxHeight}px`
    }

    const leftSide = right + PANEL_CLEARANCE > width && (left >= PANEL_CLEARANCE || x > width / 2)
    const corner = leftSide ? left : right
    const ax = leftSide ? Math.max(corner, Math.min(PANEL_CLEARANCE, width - 2))
      : Math.min(corner, Math.max(2, width - PANEL_CLEARANCE))
    const below = top < PANEL_TOP_ZONE && height - bottom > top
    const ay = below ? bottom : top
    if (ax !== anchorX || ay !== anchorY || leftSide !== flipX || below !== flipY) {
      anchorX = ax
      anchorY = ay
      flipX = leftSide
      flipY = below
      anchor.style.transform = `translate3d(${ax}px, ${ay}px, 0)`
      anchor.toggleAttribute("data-flip-x", leftSide)
      anchor.toggleAttribute("data-flip-y", below)
    }

    const coordinates = `X${(x / width).toFixed(3).replace(/^0/, "")} Y${(y / height).toFixed(3).replace(/^0/, "")}`
    if (position.textContent !== coordinates) position.textContent = coordinates
    if (cursor.hidden && latest) showReading(latest)
    cursor.hidden = false

    const dx = x - trailX
    const dy = y - trailY
    if (dx * dx + dy * dy >= 196) {
      emit(trailX, trailY, -dx * 0.18, -dy * 0.18, 5, true)
      trailX = x
      trailY = y
    }
  }

  function schedule() {
    if (visible && !frame) frame = requestAnimationFrame(paint)
  }

  const options = { passive: true, signal: listeners.signal }
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || motion.matches ||
        (event.target instanceof Element && event.target.closest(IGNORED))) {
      hide()
      return
    }
    x = event.clientX
    y = event.clientY
    if (!visible) {
      visible = true
      trailX = x
      trailY = y
    }
    schedule()
  }, options)
  window.addEventListener("pointerdown", (event) => {
    if (!visible || event.pointerType !== "mouse" || event.button !== 0 ||
        (event.target instanceof Element && event.target.closest(IGNORED))) return
    for (let i = 0; i < BURST.length; i++) {
      const [dx, dy] = BURST[i]
      emit(event.clientX, event.clientY, dx, dy, i % 2 ? 3 : 6)
    }
    if (target) {
      pulse?.cancel()
      pulse = reticle.animate([{ opacity: 1 }, { opacity: 0.32 }, { opacity: 1 }], { duration: 220 })
    }
  }, options)
  window.addEventListener("scroll", schedule, { ...options, capture: true })
  window.addEventListener("resize", schedule, options)
  document.documentElement.addEventListener("pointerleave", hide, options)
  window.addEventListener("blur", hide, options)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide()
  }, options)
  motion.addEventListener("change", () => {
    if (motion.matches) hide()
  }, options)

  return {
    update(reading: MoodReading) {
      latest = reading
      if (!cursor.hidden) showReading(reading)
      if (target) schedule()
    },
    stop() {
      listeners.abort()
      hide()
    },
  }
}
