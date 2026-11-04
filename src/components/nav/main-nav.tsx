"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/config/docs"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="manga-desktop-nav hidden md:flex">
      <Link href="/" className="manga-wordmark" aria-label="Royce home">
        r0yce<span aria-hidden="true" className="manga-wordmark-dot">.</span>
      </Link>
      <nav aria-label="Main navigation" className="manga-main-links flex items-center">
        {siteConfig.mainNav.map((item, index) => (
          <Link
            key={index}
            href={item.href as string}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "manga-nav-link",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
