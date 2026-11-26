"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AdaptiveCursor, trackAdaptiveCursor } from "./adaptive-cursor"

const loadMood =
  process.env.NEXT_PUBLIC_ADAPTIVE_HELP === "1"
    ? () =>
        Promise.all([
          import("#site-mood-engine"),
          import("#site-mood-model"),
        ])
    : null

const AdaptiveHelpContext = createContext<{
  enabled: boolean
  unavailable: boolean
  suggested: boolean
  setEnabled: (enabled: boolean) => void
} | null>(null)

export function AdaptiveHelpProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const [suggested, setSuggested] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = loadMood
    if (!enabled || !load) return

    let cancelled = false
    let stop: (() => void) | undefined
    let stopCursor: (() => void) | undefined
    let wasSuggested = false

    async function start(load: NonNullable<typeof loadMood>) {
      try {
        const [{ createMoodReader }, { default: model }] = await load()
        if (cancelled) return

        const reader = createMoodReader({
          model,
          baselineKey: null,
          onReading({ mood, reaction }) {
            const next = mood !== null && mood !== "away" && reaction >= 0.5
            if (next !== wasSuggested) {
              wasSuggested = next
              setSuggested(next)
            }
          },
        })
        if (!reader.reading.isModelLoaded) {
          setUnavailable(true)
          return
        }
        stop = reader.stop
        reader.start()
        const cursor = cursorRef.current
        if (cursor) stopCursor = trackAdaptiveCursor(cursor)
      } catch {
        stop?.()
        if (!cancelled) setUnavailable(true)
      }
    }

    void start(load)
    return () => {
      cancelled = true
      stop?.()
      stopCursor?.()
    }
  }, [enabled])

  return (
    <AdaptiveHelpContext.Provider
      value={{
        enabled,
        suggested,
        unavailable,
        setEnabled(next) {
          setSuggested(false)
          setUnavailable(false)
          setEnabled(next)
        },
      }}
    >
      {children}
      {enabled && !unavailable && (
        <AdaptiveCursor cursorRef={cursorRef} suggested={suggested} />
      )}
    </AdaptiveHelpContext.Provider>
  )
}

export function useAdaptiveSearchHint() {
  const help = useContext(AdaptiveHelpContext)
  return !!help?.enabled && help.suggested
}

export function AdaptiveHelpSetting() {
  const help = useContext(AdaptiveHelpContext)
  if (!help) return null

  return (
    <div className="space-y-2 border-t border-border pt-3 text-sm">
      <label className="flex min-h-6 items-center gap-2">
        <input
          aria-describedby="adaptive-help-description"
          checked={help.enabled}
          onChange={(event) => help.setEnabled(event.currentTarget.checked)}
          type="checkbox"
        />
        Show adaptive cursor effects
      </label>
      <p className="text-muted-foreground" id="adaptive-help-description">
        See a ring and click ripple by your mouse. If you might be stuck,
        adaptive help also highlights site search. Libraries.dev analyzes
        interaction patterns in this tab without saving or sending them.
      </p>
      {help.enabled && help.unavailable && (
        <p role="status">Adaptive help could not start. Search still works.</p>
      )}
      <a className="underline" href="/licenses/site-mood.txt">
        Libraries.dev Model License
      </a>
    </div>
  )
}
