"use client"

import Link from "next/link"
import { IconBrandGithubFilled, IconMailFilled, IconArrowUp } from "@tabler/icons-react"
import { Icons } from "@/config/icons"
import "./site-shell.css"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    })
  }

  return (
    <footer className="manga-site-footer">
      <div className="manga-footer-inner container mx-auto">
        <div className="manga-footer-brand">
          <Link href="/" className="manga-wordmark" aria-label="royce.sh home">royce<span className="manga-wordmark-dot" aria-hidden="true">.sh</span></Link>
          <p>© {currentYear} Royce Mathew. All rights reserved.</p>
        </div>
        <nav aria-label="Social links" className="manga-footer-social">
          <Link href="https://github.com/royce-mathew" target="_blank" rel="noopener noreferrer">
            <IconBrandGithubFilled className="size-4" /> <span className="link-underline-target">GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/royce-mathew" target="_blank" rel="noopener noreferrer">
            <Icons.LinkedIn className="size-4" /> <span className="link-underline-target">LinkedIn</span>
          </Link>
          <Link href="mailto:royce1mathew@gmail.com">
            <IconMailFilled className="size-4" /> <span className="link-underline-target">Email</span>
          </Link>
        </nav>
        <div className="manga-footer-tools">
          <button type="button" onClick={scrollToTop} className="manga-back-top">
            Back to top <IconArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
