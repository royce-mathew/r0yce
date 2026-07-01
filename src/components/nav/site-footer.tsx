"use client"

import Link from "next/link"
import {
  IconBrandGithubFilled,
  IconMailFilled,
  IconArrowUp,
} from "@tabler/icons-react"
import { Icons } from "@/config/icons"
import LightSwitch from "../custom/lightswitch"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-border/20">
      {/* Gold accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-primary/30 -translate-y-px" />

      <div className="container mx-auto flex flex-col items-center gap-8 px-6 py-12 md:flex-row md:justify-between md:px-8 md:py-16">
        {/* Left: Branding & Copyright */}
        <div className="flex flex-col items-center gap-3 md:items-start">
          <span className="font-display text-lg text-foreground/80">
            r0yce
          </span>
          <p className="text-[0.7rem] font-medium tracking-[0.08em] uppercase text-muted-foreground/50">
            © {currentYear} Royce Mathew. All rights reserved.
          </p>
        </div>

        {/* Center: Social Links */}
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/royce-mathew"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground/50 transition-colors duration-300 hover:text-foreground"
          >
            <IconBrandGithubFilled className="size-4" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/royce-mathew"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground/50 transition-colors duration-300 hover:text-foreground"
          >
            <Icons.LinkedIn className="size-4" />
          </Link>
          <Link
            href="mailto:royce1mathew@gmail.com"
            aria-label="Email"
            className="text-muted-foreground/50 transition-colors duration-300 hover:text-foreground"
          >
            <IconMailFilled className="size-4" />
          </Link>
        </div>

        {/* Right: Theme toggle + Back to top */}
        <div className="flex items-center gap-4">
          <LightSwitch />
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex size-9 items-center justify-center rounded-full border border-border/30 text-muted-foreground/50 transition-all duration-300 hover:border-primary/30 hover:text-foreground hover:bg-primary/5"
          >
            <IconArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
