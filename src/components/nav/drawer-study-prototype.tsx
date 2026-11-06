"use client"

// Three Index drawer layouts share the existing routes through ?variant=A, B, or C.
import { useCallback, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IconX } from "@tabler/icons-react"
import { siteConfig } from "@/config/docs"
import { SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { PrototypeSwitcher } from "@/components/custom/prototype-switcher"
import { VariantA } from "./drawer-quiet-prototype"
import { VariantB } from "./drawer-paper-prototype"
import { VariantC } from "./drawer-atlas-prototype"
import "./drawer-study-prototype.css"

const variants = [{ key: "A", name: "Quiet index" }, { key: "B", name: "Paper directory" }, { key: "C", name: "Navigation atlas" }] as const

type DrawerStudyProps = { open: boolean; onOpenChange: (open: boolean) => void }

export function DrawerStudyPrototype({ open, onOpenChange }: DrawerStudyProps) {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const requested = params.get("variant")
  const variant = requested === "B" || requested === "C" ? requested : "A"
  const autoOpen = params.get("drawer") === "1"
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && autoOpen) onOpenChange(true)
  }, [autoOpen, onOpenChange])
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && open) console.info("[Index drawer prototype]", {
      variant, name: variants.find(item => item.key === variant)?.name, open, pathname,
      url: window.location.href, destinations: siteConfig,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    })
  }, [variant, open, pathname])
  const changeVariant = useCallback((key: string) => {
    const next = new URLSearchParams(params.toString())
    next.set("variant", key)
    router.replace(`${pathname}?${next.toString()}${window.location.hash}`, { scroll: false })
    onOpenChange(true)
  }, [params, pathname, router, onOpenChange])
  const props = { pages: siteConfig.mainNav, groups: siteConfig.sidebarNav, pathname, onNavigate: () => onOpenChange(false) }
  const switcher = <PrototypeSwitcher label="Index drawer study" variants={variants} current={variant} onChange={changeVariant} />
  return (
    <>
      <SheetContent side="right" className="drawer-study-prototype" style={{ translate: "none" }} data-drawer-variant={variant} hideCloseButton data-lenis-prevent>
        <SheetTitle className="sr-only">Site navigation</SheetTitle>
        <SheetDescription className="sr-only">Browse pages and projects. Escape closes the menu.</SheetDescription>
        {variant === "A" && <VariantA {...props} />}
        {variant === "B" && <VariantB {...props} />}
        {variant === "C" && <VariantC {...props} />}
        <SheetClose className="drawer-study-close" aria-label="Close navigation"><IconX size={18} /></SheetClose>
        {switcher}
      </SheetContent>
      {!open && switcher}
    </>
  )
}
