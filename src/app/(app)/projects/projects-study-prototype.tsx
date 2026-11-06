"use client"

import { useCallback, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PrototypeSwitcher } from "@/components/custom/prototype-switcher"
import { VariantA } from "./project-editorial-prototype"
import { VariantB } from "./project-ledger-prototype"
import { VariantC } from "./project-contact-prototype"
import type { ProjectStudyProps, ProjectStudyVariant } from "./project-study-types"

const variants = [
  { key: "A", name: "Editorial" },
  { key: "B", name: "Project ledger" },
  { key: "C", name: "Contact sheet" },
] as const

export function ProjectsStudyPrototype({ projects }: ProjectStudyProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const requested = searchParams.get("variant")
  const variant: ProjectStudyVariant = requested === "B" || requested === "C" ? requested : "A"
  const changeVariant = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("variant", key)
    router.replace(`${pathname}?${params.toString()}${window.location.hash}`, { scroll: false })
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    console.info("[Projects layout prototype]", {
      variant,
      name: variants.find((item) => item.key === variant)?.name,
      url: window.location.href,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      ordering: "modifiedDate descending",
      palette: "fixed dark / ivory / gold",
      projects,
    })
  }, [variant, projects])

  return (
    <main className={`projects-study projects-study--${variant}`} data-project-variant={variant}>
      {variant === "A" && <VariantA projects={projects} />}
      {variant === "B" && <VariantB projects={projects} />}
      {variant === "C" && <VariantC projects={projects} />}
      <PrototypeSwitcher variants={variants} current={variant} onChange={changeVariant} />
    </main>
  )
}
