import { existsSync } from "node:fs"
import type { NextConfig } from "next"

const adaptiveHelp = process.env.NEXT_PUBLIC_ADAPTIVE_HELP === "1"
const moodFiles = {
  "#site-mood-engine": "./.site-mood/mood-recognition/engine.ts",
  "#site-mood-model": "./.site-mood/MoodRecognition.json",
}

if (
  adaptiveHelp &&
  ![...Object.values(moodFiles), "./public/licenses/site-mood.txt"].every(
    (file) => existsSync(file)
  )
) {
  throw new Error("Install the Libraries.dev files as described in README.md.")
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["next-auth"],
  reactStrictMode: true,
  env: { NEXT_PUBLIC_ADAPTIVE_HELP: adaptiveHelp ? "1" : "0" },
  ...(adaptiveHelp && { turbopack: { resolveAlias: moodFiles } }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // swcMinify: true,
  reactCompiler: true,
}

export default nextConfig
