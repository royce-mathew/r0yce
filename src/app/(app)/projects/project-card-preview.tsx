"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import "./project-card-preview.css"

const clips: Record<string, string> = {
  "projects/axelot": "/project-previews/axelot.mp4",
  "projects/fotoland": "/project-previews/fotoland.mp4",
  "projects/r0yce": "/project-previews/r0yce.mp4",
  "projects/kanjou": "/project-previews/kanjou.mp4",
}

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
  const [requested, setRequested] = useState(false)
  const stop = useCallback(() => setRequested(false), [])
  useEffect(() => {
    if (!src || !card.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setRequested(false)
    })
    observer.observe(card.current)
    const onVisibility = () => {
      if (document.hidden) setRequested(false)
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [src])

  const startAutomatic = () => {
    if (src && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRequested(true)
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
            onClick={() => setRequested((active) => !active)}
          >
            {requested ? "Pause" : "Preview"}
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
