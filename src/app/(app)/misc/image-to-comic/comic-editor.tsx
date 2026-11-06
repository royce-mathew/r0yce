"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  defaultComicSettings,
  renderComic,
  type ComicSettings,
} from "@/lib/comic-renderer"
import styles from "./comic-editor.module.css"

type LoadedSource = { image: HTMLImageElement; name: string }

export default function ComicEditor() {
  const [selection, setSelection] = useState<{ file: File | null }>({
    file: null,
  })
  const [source, setSource] = useState<LoadedSource | null>(null)
  const [settings, setSettings] = useState<ComicSettings>({
    ...defaultComicSettings,
  })
  const [ready, setReady] = useState(false)
  const [hasOutput, setHasOutput] = useState(false)
  const [view, setView] = useState<"comic" | "compare" | "original">("comic")
  const [status, setStatus] = useState("Loading image…")
  const [error, setError] = useState("")
  const [exporting, setExporting] = useState(false)
  const originalRef = useRef<HTMLCanvasElement>(null)
  const outputRef = useRef<HTMLCanvasElement>(null)
  const revision = useRef(0)
  const downloadUrls = useRef(new Set<string>())
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    const urls = downloadUrls.current
    return () => {
      mounted.current = false
      revision.current += 1
      for (const url of urls) URL.revokeObjectURL(url)
      urls.clear()
    }
  }, [])

  useEffect(() => {
    let canceled = false
    const file = selection.file
    const url = file
      ? URL.createObjectURL(file)
      : "/images/comic-sample-ameyoko.jpg"
    const image = new window.Image()
    if (originalRef.current) originalRef.current.width = 0
    if (outputRef.current) outputRef.current.width = 0

    image.onload = () => {
      if (canceled) return
      if (!image.naturalWidth || !image.naturalHeight) {
        setError("This image has no readable pixels. Choose another file.")
        setStatus("")
        return
      }
      const scale = Math.min(
        1,
        1600 / Math.max(image.naturalWidth, image.naturalHeight)
      )
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      const original = originalRef.current
      const output = outputRef.current
      const context = original?.getContext("2d")
      if (!original || !output || !context) {
        setError("Canvas is unavailable in this browser.")
        setStatus("")
        return
      }
      original.width = output.width = width
      original.height = output.height = height
      context.drawImage(image, 0, 0, width, height)
      setStatus("Rendering…")
      setSource({ image, name: file?.name ?? "Ameyoko sample" })
    }
    image.onerror = () => {
      if (canceled) return
      setError(
        "Could not read this image. Choose a browser-supported image file."
      )
      setStatus("")
    }
    image.src = url
    return () => {
      canceled = true
      image.onload = null
      image.onerror = null
      image.src = ""
      if (file) URL.revokeObjectURL(url)
    }
  }, [selection])

  useEffect(() => {
    if (!source) return
    let frame = 0
    const currentRevision = revision.current
    const timer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(() => {
        if (currentRevision !== revision.current || !outputRef.current) return
        try {
          renderComic(source.image, outputRef.current, settings)
          setReady(true)
          setHasOutput(true)
          setError("")
          setStatus(
            `Ready · ${outputRef.current.width} × ${outputRef.current.height}`
          )
        } catch {
          setReady(false)
          setError(
            "Could not render this image. Try another image or reset the settings."
          )
          setStatus("")
        }
      })
    }, 100)
    return () => {
      window.clearTimeout(timer)
      window.cancelAnimationFrame(frame)
    }
  }, [source, settings])

  function invalidate() {
    revision.current += 1
    setReady(false)
    if (source) {
      setError("")
      setStatus("Rendering…")
    }
  }

  function update<K extends keyof ComicSettings>(
    key: K,
    value: ComicSettings[K]
  ) {
    invalidate()
    setSettings((previous) => ({ ...previous, [key]: value }))
  }

  function choose(file: File | null) {
    invalidate()
    setError("")
    setSource(null)
    setHasOutput(false)
    setStatus("Loading image…")
    setSelection({ file })
  }

  function download() {
    const canvas = outputRef.current
    if (!canvas || !ready || exporting || !source) return
    const currentRevision = revision.current
    setExporting(true)
    try {
      canvas.toBlob((blob) => {
        if (!mounted.current) return
        setExporting(false)
        if (currentRevision !== revision.current) return
        if (!blob) {
          setError("Could not export the PNG. Try again.")
          return
        }
        const url = URL.createObjectURL(blob)
        downloadUrls.current.add(url)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `${source.name.replace(/\.[^.]+$/, "")}-comic.png`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        window.setTimeout(() => {
          URL.revokeObjectURL(url)
          downloadUrls.current.delete(url)
        }, 1000)
      }, "image/png")
    } catch {
      setExporting(false)
      setError("Could not export the PNG. Try again.")
    }
  }

  return (
    <div className={styles.editor}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <Link href="/" className={styles.home} aria-label="Back to home">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m14 6-6 6 6 6M8 12h13" />
            </svg>
          </Link>
          <h1>Image to comic</h1>
        </div>
        <div className={styles.actions}>
          <input
            id="comic-file"
            className={styles.srOnly}
            type="file"
            accept="image/*,.bmp,.gif,.jpg,.jpeg,.png,.webp"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0]
              if (file) choose(file)
              event.currentTarget.value = ""
            }}
          />
          <label className={styles.fileLabel} htmlFor="comic-file">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" />
            </svg>
            Open image
          </label>
          <button
            className={styles.download}
            type="button"
            disabled={!ready || exporting}
            onClick={download}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v12m-5-5 5 5 5-5M4 16v4h16v-4" />
            </svg>
            {exporting ? "Exporting…" : "Download PNG"}
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.preview} aria-label="Image preview">
          <div className={styles.previewToolbar}>
            <span className={styles.filename} title={source?.name}>
              {source?.name ?? selection.file?.name ?? "Ameyoko sample"}
            </span>
            <fieldset className={styles.viewModes}>
              <legend className={styles.srOnly}>Preview view</legend>
              {(["comic", "compare", "original"] as const).map((mode) => (
                <label key={mode}>
                  <input
                    className={styles.srOnly}
                    type="radio"
                    name="comic-view"
                    value={mode}
                    checked={view === mode}
                    onChange={() => setView(mode)}
                  />
                  <span>
                    {mode === "comic"
                      ? "Comic"
                      : mode === "compare"
                        ? "Compare"
                        : "Original"}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
          <div
            className={styles.stage}
            data-view={view}
            style={{
              aspectRatio:
                (source
                  ? source.image.naturalWidth / source.image.naturalHeight
                  : 4 / 3) * (view === "compare" ? 2 : 1),
            }}
            aria-label="Image comparison"
            aria-busy={!ready && !error}
          >
            <figure className={styles.original}>
              <figcaption>Original</figcaption>
              <canvas
                ref={originalRef}
                className={!source ? styles.hidden : undefined}
                aria-label="Original image"
                role="img"
              />
            </figure>
            <figure className={styles.comic}>
              <figcaption>Comic</figcaption>
              <canvas
                ref={outputRef}
                className={!hasOutput ? styles.hidden : undefined}
                aria-label="Rendered comic image"
                role="img"
              />
            </figure>
            {!source && (
              <span className={styles.emptyState}>
                {error ? "Choose another image." : "Loading image…"}
              </span>
            )}
          </div>
          <footer className={styles.previewFooter}>
            <span
              className={styles.status}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span
                className={styles.statusDot}
                data-ready={ready}
                aria-hidden="true"
              />
              {error ? "Error" : status}
            </span>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => choose(null)}
            >
              Use sample
            </button>
          </footer>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </section>

        <aside className={styles.controls} aria-label="Comic settings">
          <div className={styles.controlsHeader}>
            <h2>Adjustments</h2>
            <button
              type="button"
              className={styles.textButton}
              aria-label="Reset settings"
              onClick={() => {
                invalidate()
                setSettings({ ...defaultComicSettings })
              }}
            >
              Reset
            </button>
          </div>
          <div className={styles.controlGroup}>
            <fieldset className={styles.penChoices}>
              <legend>Pen</legend>
              {(["fine", "dip", "mixed"] as const).map((pen) => (
                <label key={pen}>
                  <input
                    className={styles.srOnly}
                    type="radio"
                    name="comic-pen"
                    value={pen}
                    checked={settings.pen === pen}
                    onChange={() => update("pen", pen)}
                  />
                  <span
                    className={styles.penMark}
                    data-pen={pen}
                    aria-hidden="true"
                  />
                  <span>
                    {pen === "fine" ? "Fine" : pen === "dip" ? "Dip" : "Mixed"}
                  </span>
                </label>
              ))}
            </fieldset>
            <label className={styles.range} htmlFor="comic-brightness">
              <span>
                Brightness <output>{settings.brightness}</output>
              </span>
              <input
                id="comic-brightness"
                type="range"
                min="0"
                max="100"
                value={settings.brightness}
                onChange={(event) =>
                  update("brightness", Number(event.target.value))
                }
              />
            </label>
            <label className={styles.range} htmlFor="comic-pressure">
              <span>
                Pressure <output>{settings.pressure}</output>
              </span>
              <input
                id="comic-pressure"
                type="range"
                min="0"
                max="4"
                step="1"
                value={settings.pressure}
                onChange={(event) =>
                  update("pressure", Number(event.target.value))
                }
              />
            </label>
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.toggle}>
              Screentone
              <input
                type="checkbox"
                checked={settings.screentone}
                onChange={(event) => update("screentone", event.target.checked)}
              />
            </label>
            <label
              className={styles.range}
              htmlFor="comic-dot-size"
              data-disabled={!settings.screentone}
            >
              <span>
                Dot size <output>{settings.dotSize}</output>
              </span>
              <input
                id="comic-dot-size"
                type="range"
                min="2"
                max="12"
                step="1"
                disabled={!settings.screentone}
                value={settings.dotSize}
                onChange={(event) =>
                  update("dotSize", Number(event.target.value))
                }
              />
            </label>
          </div>
          <details className={styles.colorDetails}>
            <summary>Ink &amp; paper</summary>
            <div className={styles.colors}>
              <label>
                <input
                  type="color"
                  value={settings.ink}
                  onChange={(event) => update("ink", event.target.value)}
                />
                Ink
              </label>
              <label>
                <input
                  type="color"
                  value={settings.paper}
                  onChange={(event) => update("paper", event.target.value)}
                />
                Paper
              </label>
            </div>
          </details>
        </aside>
      </div>
    </div>
  )
}
