"use client"

// Three command menu layouts share the existing routes through ?variant=A, B, or C.

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { PrototypeSwitcher } from "./prototype-switcher"
import { VariantA } from "./command-quick-prototype"
import { VariantB } from "./command-paper-prototype"
import { VariantC } from "./command-side-prototype"
import type { CommandPrototypeProps } from "./command-prototype-types"
import "./command-menu-study-prototype.css"

const variants = [
  { key: "A", name: "Quick jump" },
  { key: "B", name: "Paper directory" },
  { key: "C", name: "Side index" },
] as const

type StudyProps = Pick<CommandPrototypeProps, "pages" | "groups" | "onSelect"> & {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type BodyProps = Pick<StudyProps, "pages" | "groups" | "onSelect"> & {
  variant: string
  onVariantChange: (key: string) => void
}

function CommandPrototypeBody({ pages, groups, onSelect, variant, onVariantChange }: BodyProps) {
  const [query, setQuery] = useState("")
  const root = useRef<HTMLDivElement>(null)
  const props = { pages, groups, query, onQueryChange: setQuery, onSelect }

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    console.info("[Command menu prototype]", {
      variant,
      name: variants.find(item => item.key === variant)?.name,
      url: window.location.href,
      open: true,
      query,
      destinations: { pages: pages.map(item => ({ title: item.title, href: item.href })), groups: groups.map(group => ({ title: group.title, items: group.items.map(item => ({ title: item.title, href: item.href })) })) },
      renderedResults: Array.from(root.current?.querySelectorAll("[cmdk-item]") ?? []).map(item => item.getAttribute("data-value")),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    })
  }, [variant, query, pages, groups])

  return (
    <div ref={root} className="command-menu-prototype-body">
      {variant === "A" && <VariantA {...props} />}
      {variant === "B" && <VariantB {...props} />}
      {variant === "C" && <VariantC {...props} />}
      <PrototypeSwitcher label="Command menu study" variants={variants} current={variant} onChange={onVariantChange} />
    </div>
  )
}

export function CommandMenuStudyPrototype({ pages, groups, open, onOpenChange, onSelect }: StudyProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const requested = searchParams.get("variant")
  const variant = requested === "B" || requested === "C" ? requested : "A"
  const autoOpen = searchParams.get("command") === "1"

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && autoOpen) onOpenChange(true)
  }, [autoOpen, onOpenChange])

  const changeVariant = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("variant", key)
    router.replace(`${pathname}?${params.toString()}${window.location.hash}`, { scroll: false })
    onOpenChange(true)
  }, [pathname, router, searchParams, onOpenChange])

  return (
    <>
      <DialogContent className="command-menu-prototype-dialog" style={{ translate: "none" }} data-command-variant={variant} data-lenis-prevent>
        <DialogTitle className="sr-only">Search pages and projects</DialogTitle>
        <DialogDescription className="sr-only">Find a destination. Use the arrow keys to move and Enter to open it.</DialogDescription>
        <CommandPrototypeBody pages={pages} groups={groups} onSelect={onSelect} variant={variant} onVariantChange={changeVariant} />
      </DialogContent>
      {!open && <PrototypeSwitcher label="Command menu study" variants={variants} current={variant} onChange={changeVariant} />}
    </>
  )
}
