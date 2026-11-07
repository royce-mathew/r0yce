"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from "@tabler/icons-react"
import "./project-card-preview.css"

const clips: Record<string, string> = {
  "projects/axelot": "/project-previews/axelot.mp4",
  "projects/fotoland": "/project-previews/fotoland.mp4",
  "projects/r0yce": "/project-previews/r0yce.mp4",
  "projects/kanjou": "/project-previews/kanjou.mp4",
}

type Playback = "stopped" | "automatic" | "explicit"

const PreviewContext = createContext<{
  src?: string
  requested: boolean
  stop: () => void
} | null>(null)

export function ProjectCardPreview({ slug, title, className, children }: {
  slug: string
  title: string
  className: string
  children: ReactNode
}) {
  const src = clips[slug]
  const card = useRef<HTMLElement>(null)
  const [playback, setPlayback] = useState<Playback>("stopped")
  const requested = playback !== "stopped"
  const stop = useCallback(() => setPlayback("stopped"), [])
  useEffect(() => {
    if (!src || !card.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop()
    })
    observer.observe(card.current)
    const onVisibility = () => {
      if (document.hidden) stop()
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [src, stop])

  useEffect(() => {
    if (!src) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onPreferenceChange = () => {
      if (preference.matches) {
        setPlayback((current) => current === "automatic" ? "stopped" : current)
      }
    }
    preference.addEventListener("change", onPreferenceChange)
    return () => preference.removeEventListener("change", onPreferenceChange)
  }, [src])

  const startAutomatic = () => {
    if (src && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlayback((current) => current === "explicit" ? current : "automatic")
    }
  }

  return (
    <PreviewContext.Provider value={{ src, requested, stop }}>
      <article
        ref={card}
        className={`${className} project-preview-card`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") startAutomatic()
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") stop()
        }}
        onFocus={(event) => {
          if (event.target instanceof HTMLAnchorElement) startAutomatic()
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) stop()
        }}
      >
        {children}
        {src && (
          <button
            type="button"
            className="project-preview-toggle"
            aria-label={`${requested ? "Pause" : "Preview"} ${title} demo`}
            aria-pressed={requested}
            title={`${requested ? "Pause" : "Preview"} ${title} demo`}
            onClick={() => setPlayback((current) => current === "stopped" ? "explicit" : "stopped")}
          >
            {requested
              ? <IconPlayerPauseFilled size={14} aria-hidden="true" />
              : <IconPlayerPlayFilled size={14} aria-hidden="true" />}
          </button>
        )}
      </article>
    </PreviewContext.Provider>
  )
}

export function ProjectPreviewVideo() {
  const preview = useContext(PreviewContext)
  if (!preview?.src || !preview.requested) return null
  return <PlayingPreview src={preview.src} onStop={preview.stop} />
}

function PlayingPreview({ src, onStop }: { src: string; onStop: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const element = video.current
    if (!element) return
    let active = true
    void element.play().catch(() => {
      if (active) onStop()
    })
    return () => {
      active = false
      element.pause()
    }
  }, [onStop])

  return (
    <video
      ref={video}
      className={`project-preview-video${playing ? " is-playing" : ""}`}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      onError={onStop}
    />
  )
}
