"use client"

import { useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PrototypeSwitcher } from "@/components/custom/prototype-switcher"
import { CreationAbout } from "./creation-about"

// Three manga character treatments share the homepage through ?variant=A, B, or C.
const studies = [
  { key: "A", name: "Margin Walk" },
  { key: "B", name: "Cinema Panels" },
  { key: "C", name: "Chapter Journey" },
] as const

function CharacterComparison({ code }: { code: string }) {
  const params = useSearchParams()
  const router = useRouter()
  const requested = params.get("variant")
  const variant = requested === "B" || requested === "C" ? requested : "A"
  const change = useCallback((key: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("variant", key)
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false })
  }, [router])

  useEffect(() => {
    console.info("[Character prototype]", {
      variant,
      treatment: studies.find(study => study.key === variant)!.name,
      route: window.location.href,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      palette: "Creation: ink / ivory / gold",
    })
  }, [variant])

  return <><CreationAbout code={code} variant={variant} /><PrototypeSwitcher studies={studies} current={variant} onChange={change} /></>
}

export function CreationAboutPrototype({ code }: { code: string }) {
  if (process.env.NODE_ENV === "production") return <CreationAbout code={code} />
  return <CharacterComparison code={code} />
}
