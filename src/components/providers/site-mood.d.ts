declare module "#site-mood-engine" {
  export type MoodReading = {
    mood: "frustrated" | "confused" | "lost" | "away" | null
    reaction: number
    score: number
    fast: number
    probabilities: Record<"lost" | "confused" | "frustrated" | "blocked", number> | null
  }

  export function createMoodReader(options: {
    model: unknown
    baselineKey: null
    onReading: (reading: MoodReading) => void
  }): {
    readonly reading: { isModelLoaded: boolean }
    start(): void
    stop(): void
  }
}

declare module "#site-mood-model" {
  const model: unknown
  export default model
}
