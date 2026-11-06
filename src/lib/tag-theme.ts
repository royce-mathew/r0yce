import type { CSSProperties } from "react"
import {
  LogoDart,
  LogoLuau,
  LogoNumpy,
  LogoPandas,
  LogoRoblox,
  LogoFlask,
  LogoSelenium,
  LogoYjs,
  LogoMatplotlib,
} from "@/components/custom/technology-logos"
import {
  IconBrandReact,
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandSvelte,
  IconBrandRust,
  IconBrandPython,
  IconBrandTypescript,
  IconBrandJavascript,
  IconBrandNodejs,
  IconBrandDiscordFilled,
  IconBrandFirebase,
  IconBrandFlutter,
  IconBrandAws,
  IconBrandCloudflare,
  IconBrandSupabase,
  IconCpu,
  IconBrain,
  IconDatabaseFilled,
  IconChartBar,
  IconGhostFilled,
  IconDeviceGamepad2Filled,
  IconStethoscope,
  IconBoltFilled,
  IconTrendingUp,
  IconCloudFilled,
  IconSpiderFilled,
  IconCode,
} from "@tabler/icons-react"

type TagTheme = {
  accent: string
  accentBorder: string
}

const TAG_THEME_PRESETS: Record<string, TagTheme> = {
  ai: { accent: "172 38% 36%", accentBorder: "172 28% 68%" },
  "neural-networks": { accent: "172 38% 36%", accentBorder: "172 28% 68%" },
  neat: { accent: "172 38% 36%", accentBorder: "172 28% 68%" },
  api: { accent: "342 30% 46%", accentBorder: "342 25% 72%" },
  scraping: { accent: "342 30% 46%", accentBorder: "342 25% 72%" },
  selenium: { accent: "342 30% 46%", accentBorder: "342 25% 72%" },
  yjs: { accent: "342 30% 46%", accentBorder: "342 25% 72%" },
  "data-analysis": { accent: "85 24% 40%", accentBorder: "85 20% 66%" },
  numpy: { accent: "85 24% 40%", accentBorder: "85 20% 66%" },
  pandas: { accent: "85 24% 40%", accentBorder: "85 20% 66%" },
  discord: { accent: "268 28% 46%", accentBorder: "268 22% 70%" },
  mobile: { accent: "268 28% 46%", accentBorder: "268 22% 70%" },
  dart: { accent: "200 45% 42%", accentBorder: "200 35% 68%" },
  flutter: { accent: "200 45% 42%", accentBorder: "200 35% 68%" },
  firebase: { accent: "18 55% 46%", accentBorder: "18 40% 70%" },
  flask: { accent: "215 32% 46%", accentBorder: "215 24% 70%" },
  forex: { accent: "42 55% 42%", accentBorder: "42 40% 68%" },
  game: { accent: "30 20% 44%", accentBorder: "30 15% 66%" },
  roblox: { accent: "30 20% 44%", accentBorder: "30 15% 66%" },
  horror: { accent: "355 45% 40%", accentBorder: "355 35% 66%" },
  javascript: { accent: "48 60% 40%", accentBorder: "48 45% 68%" },
  "lua-u": { accent: "220 48% 44%", accentBorder: "220 38% 70%" },
  medical: { accent: "145 28% 40%", accentBorder: "145 22% 66%" },
  nextjs: { accent: "220 8% 38%", accentBorder: "220 8% 64%" },
  nodejs: { accent: "155 35% 38%", accentBorder: "155 28% 66%" },
  supabase: { accent: "155 35% 38%", accentBorder: "155 28% 66%" },
  python: { accent: "225 35% 46%", accentBorder: "225 28% 72%" },
  react: { accent: "195 48% 40%", accentBorder: "195 38% 68%" },
  "react-native": { accent: "195 48% 40%", accentBorder: "195 38% 68%" },
  rust: { accent: "24 60% 44%", accentBorder: "24 45% 68%" },
  svelte: { accent: "12 65% 46%", accentBorder: "12 50% 70%" },
  sveltekit: { accent: "12 65% 46%", accentBorder: "12 50% 70%" },
  tailwindcss: { accent: "185 42% 40%", accentBorder: "185 32% 66%" },
  typescript: { accent: "210 40% 42%", accentBorder: "210 30% 68%" },
  realtime: { accent: "110 22% 42%", accentBorder: "110 18% 66%" },
  pickle: { accent: "110 22% 42%", accentBorder: "110 18% 66%" },
}

const TAG_ICONS: Record<string, React.ComponentType<any>> = {
  react: IconBrandReact,
  "react-native": IconBrandReact,
  nextjs: IconBrandNextjs,
  tailwindcss: IconBrandTailwind,
  svelte: IconBrandSvelte,
  sveltekit: IconBrandSvelte,
  rust: IconBrandRust,
  python: IconBrandPython,
  typescript: IconBrandTypescript,
  javascript: IconBrandJavascript,
  nodejs: IconBrandNodejs,
  discord: IconBrandDiscordFilled,
  firebase: IconBrandFirebase,
  flutter: IconBrandFlutter,
  dart: LogoDart,
  ai: IconBrain,
  "neural-networks": IconCpu,
  neat: IconCpu,
  supabase: IconBrandSupabase,
  sqlite: IconDatabaseFilled,
  postgres: IconDatabaseFilled,
  mysql: IconDatabaseFilled,
  mongodb: IconDatabaseFilled,
  database: IconDatabaseFilled,
  "data-analysis": IconChartBar,
  pandas: LogoPandas,
  numpy: LogoNumpy,
  matplotlib: LogoMatplotlib,
  flask: LogoFlask,
  pickle: IconBrandPython,
  "amazon-ses": IconBrandAws,
  turnstile: IconBrandCloudflare,
  horror: IconGhostFilled,
  game: IconDeviceGamepad2Filled,
  roblox: LogoRoblox,
  "lua-u": LogoLuau,
  medical: IconStethoscope,
  health: IconStethoscope,
  realtime: IconBoltFilled,
  forex: IconTrendingUp,
  api: IconCloudFilled,
  scraping: IconSpiderFilled,
  selenium: LogoSelenium,
  yjs: LogoYjs,
}

function hashTag(value: string): number {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

export function getTagTheme(tag: string) {
  const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, "-")
  const fallbackHues = [18, 32, 45, 85, 110, 145, 172, 195, 210, 225, 268, 300, 342]
  const fallbackHue = fallbackHues[hashTag(normalizedTag) % fallbackHues.length]
  const preset = TAG_THEME_PRESETS[normalizedTag]
  
  const accent = preset?.accent ?? `${fallbackHue} 35% 46%`
  const accentBorder = preset?.accentBorder ?? `${fallbackHue} 28% 68%`

  return {
    style: {
      "--tag-accent": accent,
      "--tag-accent-border": accentBorder,
    } as CSSProperties,
    className: "tag-pill-themed",
  }
}

export function getTagIcon(tag: string): React.ComponentType<any> {
  const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, "-")
  return TAG_ICONS[normalizedTag] ?? IconCode
}
