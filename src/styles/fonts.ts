import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import localFont from "next/font/local"

export const mangaJapanese = localFont({
  src: [
    { path: "./noto-manga-jp-400.ttf", weight: "400", style: "normal" },
    { path: "./noto-manga-jp-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-japanese",
  display: "swap",
  preload: false,
})

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
  preload: false,
})

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
})

export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
})

export const inter = dmSans // alias for files still importing `inter`
