"use client"

import { useTheme } from "next-themes"

import { Icons } from "@/config/icons"
import { useMounted } from "@/hooks/use-mounted"

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const mounted = useMounted()
  const { setTheme, theme } = useTheme()

  if (!mounted) {
    return null
  }

  function handleThemeChange(value: string) {
    if (value) {
      setTheme(value)
    }
  }

  return (
    <footer className="dark:border-border/40 bg-background/95 border-t py-6 md:px-8 md:py-0 ">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-muted-foreground text-balance text-center text-sm leading-loose">
          Copyright © {currentYear} Royce Mathew. All rights reserved.
        </p>
        <ToggleGroup
          type="single"
          className="gap-0 rounded-full border"
          size="sm"
          onValueChange={handleThemeChange}
          loop={true}
          value={theme}
          aria-label="Toggle theme mode"
        >
          <ToggleGroupItem
            value="light"
            aria-label="Switch to light mode"
            className="aspect-square rounded-full"
          >
            <Icons.sun />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="system"
            aria-label="Switch to system preferred mode"
            className="aspect-square rounded-full"
          >
            <Icons.deviceStar />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="dark"
            aria-label="Switch to dark mode"
            className="aspect-square rounded-full"
          >
            <Icons.moon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </footer>
  )
}
