"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertDialogProps } from "@radix-ui/react-alert-dialog"
import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/docs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CommandMenuStudyPrototype } from "./command-menu-study-prototype"

const menuPages: NavItem[] = [
  ...siteConfig.mainNav.filter((navItem) => !navItem.external),
  { title: "Market State", href: "/market-state" },
  { title: "Wordle", href: "/misc/wordle" },
]

export function CommandMenu({ ...props }: AlertDialogProps) {
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
        <Button
          className="relative h-8 w-full justify-start rounded-lg bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
          variant="outline"
          {...props}
        >
          <span className="hidden lg:inline-flex">Search or jump to...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <React.Suspense fallback={null}>
        <CommandMenuStudyPrototype pages={menuPages} groups={siteConfig.sidebarNav} open={open} onOpenChange={setOpen} onSelect={go} />
      </React.Suspense>
    </Dialog>
  )
}
