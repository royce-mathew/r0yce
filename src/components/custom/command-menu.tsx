"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertDialogProps } from "@radix-ui/react-alert-dialog"
import {
  IconArrowUpRight,
  IconCode,
  IconDevicesStar,
  IconLayoutGrid,
  IconLink,
  IconMoonFilled,
  IconSunFilled,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/docs"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const menuPages: NavItem[] = [
  ...siteConfig.mainNav.filter((navItem) => !navItem.external),
  { title: "Market State", href: "/market-state" },
  { title: "Wordle", href: "/misc/wordle" },
]

export function CommandMenu({ ...props }: AlertDialogProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
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

  const selectTheme = React.useCallback(
    (theme: "system" | "light" | "dark") => {
      setOpen(false)
      setTheme(theme)
    },
    [setTheme]
  )

  return (
    <>
      <Button
        className="relative h-8 w-full justify-start rounded-lg bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
        variant="outline"
        {...props}
      >
        <span className="hidden lg:inline-flex">Search or jump to...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <Dialog modal onOpenChange={setOpen} open={open}>
        <DialogContent
          className="max-w-3xl origin-top gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-2xl data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=open]:slide-in-from-top-[46%] sm:rounded-2xl"
          data-lenis-prevent
        >
          <DialogTitle className="sr-only">Command Menu</DialogTitle>
          <Command className="overflow-hidden bg-background sm:rounded-2xl">
            <div className="border-b bg-primary/[0.04] px-5 pt-6 pb-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <IconLayoutGrid className="size-5" />
                </span>
                <p className="text-lg font-semibold">Command Menu</p>
              </div>
              <div className="mx-auto mt-3 max-w-xl rounded-xl border border-border bg-background px-2 shadow-sm">
                <CommandInput
                  autoFocus
                  className="h-12 text-base"
                  placeholder="Search pages, projects, and docs"
                />
              </div>
            </div>
            <CommandList className="max-h-[min(58vh,480px)]">
              <CommandEmpty>
                No matching destination. Try a broader term.
              </CommandEmpty>
              <div className="grid md:grid-cols-[1.4fr_0.6fr]">
                <div className="border-r border-border/70 p-3">
                  <CommandGroup
                    className="p-0 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                    heading="Pages"
                  >
                    {menuPages.map((navItem) => (
                      <CommandItem
                        className="group mb-1 items-start rounded-xl px-3 py-3"
                        key={navItem.href}
                        onSelect={() => go(navItem.href as string)}
                        value={`${navItem.title} ${navItem.href}`}
                      >
                        <span className="mr-3 grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <IconLink className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">
                            {navItem.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {navItem.href}
                          </span>
                        </span>
                        <IconArrowUpRight className="mt-1 size-4 text-muted-foreground group-aria-selected:text-foreground" />
                      </CommandItem>
                    ))}
                    {siteConfig.sidebarNav.flatMap((group) =>
                      group.items.map((navItem: NavItem) => (
                        <CommandItem
                          className="group mb-1 items-start rounded-xl px-3 py-3"
                          key={navItem.href}
                          onSelect={() => go(navItem.href as string)}
                          value={`${group.title} ${navItem.title} ${navItem.href}`}
                        >
                          <span className="mr-3 grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                            <IconCode className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">
                              {navItem.title}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {group.title}
                            </span>
                          </span>
                          <IconArrowUpRight className="mt-1 size-4 text-muted-foreground group-aria-selected:text-foreground" />
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </div>
                <aside className="bg-muted/30 p-5">
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Quick actions
                  </p>
                  <div className="mt-3 space-y-1">
                    <CommandGroup className="p-0">
                      <CommandItem
                        className="rounded-lg px-3 py-2.5"
                        onSelect={() => selectTheme("system")}
                      >
                        <IconDevicesStar className="mr-2 size-4" /> Follow
                        system theme
                      </CommandItem>
                      <CommandItem
                        className="rounded-lg px-3 py-2.5"
                        onSelect={() => selectTheme("light")}
                      >
                        <IconSunFilled className="mr-2 size-4" /> Use light
                        theme
                      </CommandItem>
                      <CommandItem
                        className="rounded-lg px-3 py-2.5"
                        onSelect={() => selectTheme("dark")}
                      >
                        <IconMoonFilled className="mr-2 size-4" /> Use dark
                        theme
                      </CommandItem>
                    </CommandGroup>
                  </div>
                  <div className="mt-6 border-t border-border/70 pt-5 text-xs leading-5 text-muted-foreground">
                    <p className="font-medium text-foreground">Search first</p>
                    <p className="mt-1">
                      Type to narrow every page and documentation destination in
                      one list.
                    </p>
                  </div>
                </aside>
              </div>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
