import {
  DM_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Lora,
  Work_Sans,
} from "next/font/google"
import localFont from "next/font/local"

export const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
})

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
})

// Keep existing CalSans for backward compatibility
export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
})

export const calTitle = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  weight: "600",
  display: "swap",
})

// Keep legacy exports for backward compat with velite content
export const inter = dmSans // alias for files still importing `inter`
export const lora = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
})
export const work = Work_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
})

export const fontMapper = {
  "font-cal": calTitle.variable,
  "font-lora": lora.variable,
  "font-work": work.variable,
} as Record<string, string>
