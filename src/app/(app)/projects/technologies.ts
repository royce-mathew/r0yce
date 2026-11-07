type Technology = { name: string; logo?: string }

const TECHNOLOGIES: Record<string, Technology> = {
  react: { name: "React", logo: "react" },
  "react-native": { name: "React Native", logo: "react" },
  nextjs: { name: "Next.js", logo: "nextjs" },
  typescript: { name: "TypeScript", logo: "typescript" },
  javascript: { name: "JavaScript", logo: "javascript" },
  nodejs: { name: "Node.js", logo: "nodejs" },
  firebase: { name: "Firebase", logo: "firebase" },
  "amazon-ses": { name: "Amazon SES", logo: "amazonwebservices" },
  turnstile: { name: "Cloudflare Turnstile", logo: "cloudflare" },
  discord: { name: "Discord", logo: "discord" },
  flutter: { name: "Flutter", logo: "flutter" },
  dart: { name: "Dart", logo: "dart" },
  python: { name: "Python", logo: "python" },
  pickle: { name: "pickle", logo: "python" },
  flask: { name: "Flask", logo: "flask" },
  selenium: { name: "Selenium", logo: "selenium" },
  rust: { name: "Rust", logo: "rust" },
  roblox: { name: "Roblox", logo: "roblox" },
  "lua-u": { name: "Luau", logo: "luau" },
  svelte: { name: "Svelte", logo: "svelte" },
  sveltekit: { name: "SvelteKit", logo: "svelte" },
  tailwindcss: { name: "Tailwind CSS", logo: "tailwindcss" },
  supabase: { name: "Supabase", logo: "supabase" },
  numpy: { name: "NumPy", logo: "numpy" },
  pandas: { name: "pandas", logo: "pandas" },
  matplotlib: { name: "Matplotlib", logo: "matplotlib" },
  yjs: { name: "Yjs", logo: "yjs" },
}

export function resolveTechnology(tag: string): Technology {
  const key = tag.trim().toLowerCase().replace(/\s+/g, "-")
  return Object.hasOwn(TECHNOLOGIES, key) ? TECHNOLOGIES[key] : { name: tag }
}
