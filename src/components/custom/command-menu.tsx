"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconSearch } from "@tabler/icons-react"
import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/docs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import "./command-menu.css"

const menuPages: NavItem[] = [
  ...siteConfig.mainNav.filter((navItem) => !navItem.external),
  { title: "Market State", href: "/market-state" },
  { title: "Wordle", href: "/misc/wordle" },
  { title: "Image to comic", href: "/misc/image-to-comic" },
]

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        event.key === "/"
      ) {
        if (
          (event.target instanceof HTMLElement &&
            event.target.isContentEditable) ||
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement
        ) {
          return
        }

        event.preventDefault()
        setOpen((isOpen) => !isOpen)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const go = React.useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  return (
    <Dialog modal onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="icon" aria-label="Search pages and projects">
          <IconSearch className="size-6" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="quick-jump-dialog" style={{ translate: "none" }} data-lenis-prevent>
        <DialogTitle className="sr-only">Search pages and projects</DialogTitle>
        <DialogDescription className="sr-only">Use the arrow keys to move and Enter to open a destination.</DialogDescription>
        <Command className="quick-jump-menu" label="Jump to a destination">
          <header className="quick-heading">
            <span className="quick-slash" aria-hidden="true">/</span>
            <span>Jump to</span>
          </header>
          <CommandInput placeholder="Find a page or project…" aria-label="Search pages and projects" autoFocus />
          <CommandPrimitive.List className="quick-results" aria-label="Destinations">
            <CommandEmpty>No destinations found. Try another search.</CommandEmpty>
            <CommandGroup heading="Pages">
              {menuPages.map(page => (
                <CommandItem key={page.href} value={`${page.title} ${page.href} Pages`} onSelect={() => go(page.href as string)}>
                  <span className="quick-destination">{page.title}</span>
                  <span className="quick-path">{page.href}</span>
                  <span className="quick-arrow" aria-hidden="true">↗</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {siteConfig.sidebarNav.map(group => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map(item => (
                  <CommandItem key={item.href} value={`${item.title} ${item.href} ${group.title}`} onSelect={() => go(item.href as string)}>
                    <span className="quick-destination">{item.title}</span>
                    <span className="quick-path">{item.href}</span>
                    <span className="quick-arrow" aria-hidden="true">↗</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandPrimitive.List>
          <footer className="quick-help">
            <span><kbd>↑↓</kbd> move</span>
            <span><kbd>Enter</kbd> open</span>
            <span><kbd>Esc</kbd> close</span>
          </footer>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
