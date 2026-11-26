declare module "#site-mood-engine" {
  export function createMoodReader(options: {
    model: unknown
    baselineKey: null
    onReading: (reading: {
      mood: "frustrated" | "confused" | "lost" | "away" | null
      reaction: number
    }) => void
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
