"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconMenu2, IconX } from "@tabler/icons-react"
import type { siteConfig } from "@/config/docs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import "./index-drawer.css"

export function IndexDrawer({ navigation }: { navigation: typeof siteConfig }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="icon" className="index-drawer-trigger min-h-11 min-w-11 px-0">
          <IconMenu2 className="size-5" />
          <span className="sr-only">Open site index</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="index-drawer" style={{ translate: "none" }} hideCloseButton data-lenis-prevent>
        <SheetTitle className="sr-only">Site navigation</SheetTitle>
        <SheetDescription className="sr-only">Browse pages and projects. Escape closes the menu.</SheetDescription>
        <div className="index-drawer-body">
          <header><span className="quiet-brand">royce<span>.sh</span></span><p>Around here.</p></header>
          <div className="quiet-drawer-scroll" data-lenis-prevent>
            <nav aria-label="Site navigation" className="quiet-site-links">
              {navigation.mainNav.map((item, index) => item.href && (
                <Link key={item.href} href={item.href} onClick={close} aria-current={pathname === item.href ? "page" : undefined}>
                  <span className="quiet-number">0{index + 1}</span><span className="link-underline-target">{item.title}</span><span className="quiet-link-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
            {navigation.sidebarNav.map(group => (
              <nav key={group.title} aria-label={`${group.title} collection`} className="quiet-project-links">
                <h2>{group.title}<span>{String(group.items.length).padStart(2, "0")}</span></h2>
                {group.items.map(item => item.href && (
                  <Link key={item.href} href={item.href} onClick={close} aria-current={pathname === item.href ? "page" : undefined}>
                    <span className="link-underline-target">{item.title}</span><span className="quiet-link-arrow" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </nav>
            ))}
            <footer>© {new Date().getFullYear()} Royce Mathew</footer>
          </div>
        </div>
        <SheetClose className="index-drawer-close" aria-label="Close navigation"><IconX size={18} /></SheetClose>
      </SheetContent>
    </Sheet>
  )
}
