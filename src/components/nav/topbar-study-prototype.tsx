"use client"

// Prototype question: which of three ?variant= topbars fits Creation and the rest of the site?

import { useCallback, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PrototypeSwitcher } from "@/components/custom/prototype-switcher"
import { VariantA } from "./topbar-panel-prototype"
import { VariantB } from "./topbar-masthead-prototype"
import { VariantC } from "./topbar-index-prototype"
import type { TopbarPrototypeProps } from "./topbar-prototype-types"

const variants = [
  { key: "A", name: "Panel strip" },
  { key: "B", name: "Print masthead" },
  { key: "C", name: "Index drawer" },
] as const

type TopbarStudyProps = Omit<TopbarPrototypeProps, "section">

export function TopbarStudyPrototype(props: TopbarStudyProps) {
  const root = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const requested = searchParams.get("variant")
  const variant = requested === "B" || requested === "C" ? requested : "A"
  const section = pathname === "/" ? "Home" : pathname.startsWith("/projects") ? "Projects" : pathname.startsWith("/kanjou") ? "Kanjou" : "Explore"
  const changeVariant = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("variant", key)
    router.replace(`${pathname}?${params.toString()}${window.location.hash}`, { scroll: false })
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    console.info("[Topbar prototype]", {
      variant,
      name: variants.find((item) => item.key === variant)?.name,
      url: window.location.href,
      section,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      headerHeight: root.current?.closest("header")?.getBoundingClientRect().height,
      navigation: Array.from(root.current?.querySelectorAll("nav a") ?? []).map(link => ({ label: link.textContent, href: link.getAttribute("href") })),
      tools: ["Command search", "Account settings", "Navigation sheet"],
      palette: "fixed dark / ivory / gold",
    })
  }, [variant, pathname, section])

  return (
    <div ref={root} className="topbar-study-prototype" data-topbar-variant={variant}>
      {variant === "A" && <VariantA {...props} section={section} />}
      {variant === "B" && <VariantB {...props} section={section} />}
      {variant === "C" && <VariantC {...props} section={section} />}
      <PrototypeSwitcher label="Topbar study" variants={variants} current={variant} onChange={changeVariant} />
    </div>
  )
}
