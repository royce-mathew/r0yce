export type ComicSettings = {
  brightness: number
  pressure: number
  pen: "fine" | "dip" | "mixed"
  screentone: boolean
  dotSize: number
  ink: string
  paper: string
}

export const defaultComicSettings: ComicSettings = {
  brightness: 50,
  pressure: 2,
  pen: "mixed",
  screentone: true,
  dotSize: 4,
  ink: "#131820",
  paper: "#eee8d8",
}

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value))
}

function ramp(low: number, high: number, value: number): number {
  const t = clamp((value - low) / (high - low), 0, 1)
  return t * t * (3 - 2 * t)
}

function blur(
  source: Float32Array,
  target: Float32Array,
  scratch: Float32Array,
  width: number,
  height: number,
  radius: number
): void {
  const divisor = radius * 2 + 1
  for (let y = 0; y < height; y++) {
    const row = y * width
    let sum = source[row] * (radius + 1)
    for (let x = 1; x <= radius; x++)
      sum += source[row + Math.min(x, width - 1)]
    for (let x = 0; x < width; x++) {
      scratch[row + x] = sum / divisor
      sum +=
        source[row + Math.min(width - 1, x + radius + 1)] -
        source[row + Math.max(0, x - radius)]
    }
  }
  for (let x = 0; x < width; x++) {
    let sum = scratch[x] * (radius + 1)
    for (let y = 1; y <= radius; y++)
      sum += scratch[Math.min(y, height - 1) * width + x]
    for (let y = 0; y < height; y++) {
      target[y * width + x] = sum / divisor
      sum +=
        scratch[Math.min(height - 1, y + radius + 1) * width + x] -
        scratch[Math.max(0, y - radius) * width + x]
    }
  }
}

export function renderComic(
  source: CanvasImageSource,
  output: HTMLCanvasElement,
  settings: ComicSettings
): void {
  const width = output.width
  const height = output.height
  if (!width || !height) return
  const context = output.getContext("2d")
  if (!context) throw new Error("Canvas rendering is unavailable.")

  const sample = document.createElement("canvas")
  sample.width = width
  sample.height = height
  const input = sample.getContext("2d", { willReadFrequently: true })
  if (!input) throw new Error("Canvas rendering is unavailable.")

  input.fillStyle = "#ffffff"
  input.fillRect(0, 0, width, height)
  input.fillStyle = settings.paper
  input.fillRect(0, 0, width, height)
  const paper = input.getImageData(0, 0, 1, 1).data
  input.fillStyle = settings.ink
  input.fillRect(0, 0, 1, 1)
  const ink = input.getImageData(0, 0, 1, 1).data
  input.fillStyle = `rgb(${paper[0]}, ${paper[1]}, ${paper[2]})`
  input.fillRect(0, 0, width, height)
  input.imageSmoothingEnabled = true
  input.imageSmoothingQuality = "high"
  // The five-argument form includes the whole image, including density-scaled sources.
  input.drawImage(source, 0, 0, width, height)
  const pixels = input.getImageData(0, 0, width, height)
  const count = width * height
  const luminance = new Float32Array(count)
  const smooth = new Float32Array(count)
  const local = new Float32Array(count)
  const broad = settings.pen === "fine" ? null : new Float32Array(count)
  const scratch = new Float32Array(count)
  const strokes = new Float32Array(count)
  const brightness = (clamp(settings.brightness, 0, 100) - 50) / 100
  const pressure = clamp(settings.pressure, 0, 4) / 4
  const scale = Math.max(width, height) / 1000

  for (let i = 0; i < count; i++) {
    const p = i * 4
    luminance[i] = clamp(
      (pixels.data[p] * 0.2126 +
        pixels.data[p + 1] * 0.7152 +
        pixels.data[p + 2] * 0.0722) /
        255 +
        brightness * 0.7,
      0,
      1
    )
  }

  blur(
    luminance,
    smooth,
    scratch,
    width,
    height,
    Math.max(1, Math.round(scale))
  )
  blur(
    smooth,
    local,
    scratch,
    width,
    height,
    Math.max(2, Math.round(scale * 3))
  )
  if (broad) {
    blur(
      smooth,
      broad,
      scratch,
      width,
      height,
      Math.max(4, Math.round(scale * 9))
    )
  }

  const fineThreshold = 0.033 - pressure * 0.018
  const broadThreshold = 0.045 - pressure * 0.024
  for (let y = 0; y < height; y++) {
    const top = Math.max(0, y - 1) * width
    const row = y * width
    const bottom = Math.min(height - 1, y + 1) * width
    for (let x = 0; x < width; x++) {
      const left = Math.max(0, x - 1)
      const right = Math.min(width - 1, x + 1)
      const i = row + x
      const gx =
        (smooth[top + right] +
          2 * smooth[row + right] +
          smooth[bottom + right] -
          smooth[top + left] -
          2 * smooth[row + left] -
          smooth[bottom + left]) *
        0.25
      const gy =
        (smooth[bottom + left] +
          2 * smooth[bottom + x] +
          smooth[bottom + right] -
          smooth[top + left] -
          2 * smooth[top + x] -
          smooth[top + right]) *
        0.25
      const gradient = Math.sqrt(gx * gx + gy * gy)
      // Dark-side contrast keeps pale skin and paper free of doubled outlines.
      const fineContrast = Math.max(0, local[i] - smooth[i])
      const fine =
        ramp(fineThreshold, fineThreshold + 0.06, gradient) *
        ramp(0.001, 0.018, fineContrast)
      if (broad) {
        const broadContrast = Math.max(0, broad[i] - smooth[i])
        const dip =
          ramp(broadThreshold, broadThreshold + 0.075, broadContrast) *
          ramp(0.008, 0.045, gradient + fineContrast)
        strokes[i] =
          settings.pen === "dip"
            ? Math.max(dip, fine * 0.48)
            : Math.max(fine, dip * 0.95)
      } else {
        strokes[i] = fine
      }
    }
  }

  const spread =
    (settings.pen === "fine" ? 0.12 : settings.pen === "dip" ? 0.9 : 0.5) *
    (0.35 + pressure * 1.65) *
    Math.max(0.65, scale)
  const radius = Math.ceil(spread)
  // Two short max filters widen strokes without a square neighborhood scan per pixel.
  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      let value = strokes[row + x]
      for (let offset = 1; offset <= radius; offset++) {
        const weight = clamp(spread - offset + 1, 0, 1)
        value = Math.max(
          value,
          weight * strokes[row + Math.max(0, x - offset)],
          weight * strokes[row + Math.min(width - 1, x + offset)]
        )
      }
      scratch[row + x] = value
    }
  }

  const spacing = Math.max(2, settings.dotSize)
  const rotation = Math.SQRT1_2
  const shadowThreshold = 0.105 + pressure * 0.105
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      let line = scratch[i]
      for (let offset = 1; offset <= radius; offset++) {
        const weight = clamp(spread - offset + 1, 0, 1)
        line = Math.max(
          line,
          weight * scratch[Math.max(0, y - offset) * width + x],
          weight * scratch[Math.min(height - 1, y + offset) * width + x]
        )
      }
      const shadow =
        1 - ramp(shadowThreshold - 0.012, shadowThreshold + 0.012, smooth[i])
      let coverage = Math.max(line, shadow)
      if (settings.screentone) {
        const darkness = 1 - (smooth[i] * 0.7 + local[i] * 0.3)
        const tone = 0.7 * ramp(0.12, 0.87, darkness)
        const u = ((x + y) * rotation) / spacing
        const v = ((y - x) * rotation) / spacing
        const dx = (u - Math.floor(u) - 0.5) * spacing
        const dy = (v - Math.floor(v) - 0.5) * spacing
        const distance = Math.sqrt(dx * dx + dy * dy)
        const dotRadius = spacing * Math.sqrt(tone / Math.PI)
        const dot =
          tone > 0 ? 1 - ramp(dotRadius - 0.5, dotRadius + 0.5, distance) : 0
        coverage = Math.max(coverage, dot)
      }
      const p = i * 4
      pixels.data[p] = paper[0] + (ink[0] - paper[0]) * coverage
      pixels.data[p + 1] = paper[1] + (ink[1] - paper[1]) * coverage
      pixels.data[p + 2] = paper[2] + (ink[2] - paper[2]) * coverage
      pixels.data[p + 3] = 255
    }
  }
  context.putImageData(pixels, 0, 0)
}
