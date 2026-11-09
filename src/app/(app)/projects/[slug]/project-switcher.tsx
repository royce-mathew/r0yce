"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ProjectItem = { title: string; href: string }

export function ProjectSwitcher({ items, currentHref, currentTitle }: {
  items: ProjectItem[]
  currentHref: string
  currentTitle: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="project-switcher-trigger" aria-label={`Switch project, current project: ${currentTitle}`}>
          <span className="project-switcher-title">{currentTitle}</span>
          <span className="project-switcher-hint">Switch</span>
          <span aria-hidden="true">⌄</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} collisionPadding={16} className="project-switcher-popover" aria-label="Choose a project">
        <div className="project-switcher-list">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="project-switcher-option" aria-current={item.href === currentHref ? "page" : undefined} onClick={() => setOpen(false)}>
              <span className="link-underline-target">{item.title}</span>
              {item.href === currentHref && <span className="project-switcher-current">Current</span>}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
