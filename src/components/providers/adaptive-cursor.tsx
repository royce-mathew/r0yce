import type { Ref } from "react"
import "./adaptive-cursor.css"

export function AdaptiveCursor({
  cursorRef,
  suggested,
}: {
  cursorRef: Ref<HTMLDivElement>
  suggested: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className="adaptive-cursor"
      data-mood-ignore=""
      data-suggested={suggested}
      hidden
      ref={cursorRef}
    >
      <span className="adaptive-cursor-ring" />
      <span className="adaptive-cursor-ripple" />
      <span className="adaptive-cursor-label">
        {suggested ? "Try site search" : "Adaptive help"}
      </span>
    </div>
  )
}

export function trackAdaptiveCursor(cursor: HTMLDivElement) {
  const listeners = new AbortController()
  const ripple = cursor.querySelector(".adaptive-cursor-ripple")
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  let pulse: Animation | undefined
  let frame = 0
  let x = 0
  let y = 0

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
      cursor.toggleAttribute("data-flip-x", x > window.innerWidth - 156)
      cursor.toggleAttribute("data-flip-y", y > window.innerHeight - 48)
      cursor.hidden = false
    })
  }, options)
  window.addEventListener("pointerdown", (event) => {
    if (!follows(event) || event.button !== 0 || cursor.hidden) return
    pulse?.cancel()
    pulse = ripple?.animate(
      [
        { scale: "0.8", opacity: 0.9 },
        { scale: "2", opacity: 0 },
      ],
      { duration: 360, easing: "ease-out" }
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

  return () => {
    listeners.abort()
    hide()
  }
}
