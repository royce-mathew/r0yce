"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/config/docs"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-10 flex items-center space-x-3 group">
        <Image src="/favicon.png" width={22} height={22} alt="Logo" className="opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="font-display text-lg tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
          r0yce
        </span>
      </Link>
      <nav className="flex items-center gap-8">
        {siteConfig.mainNav.map((item, index) => (
          <Link
            key={index}
            href={item.href as string}
            className={cn(
              "link-underline relative text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-colors duration-300",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {pathname === item.href && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 size-1 rounded-full bg-primary" />
            )}
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
