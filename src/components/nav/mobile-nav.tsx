"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { siteConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IconCode, IconLink } from "@tabler/icons-react"

export function SubNav({
  titleName,
  pathname,
  onOpenChange,
}: {
  titleName: string
  pathname: string
  onOpenChange?: (open: boolean) => void
}) {
  const foundSubnav = siteConfig.sidebarNav.find(
    (item) => item.title === titleName
  )

  if (foundSubnav === undefined) return null

  return (
    <div className="mt-3 flex w-full flex-col space-y-2 border-l border-border/30 pl-4">
      {foundSubnav.items.map((subItem, subIndex) => (
        <MobileLink
          key={subIndex}
          href={subItem.href as string}
          className={cn(
            "manga-mobile-sublink flex min-h-11 items-center justify-between px-3 py-2 text-base transition-colors",
            pathname === subItem.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
          aria-label={subItem.title}
          onOpenChange={onOpenChange}
        >
          <span className="truncate">{subItem.title}</span>
          <IconCode className="size-4 opacity-40" />
        </MobileLink>
      ))}
    </div>
  )
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const firstPath = pathname.split("/")[1]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="icon" className="manga-mobile-trigger mr-2 min-h-11 min-w-11 px-0 md:hidden">
          <IconMenu2 className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <Link href="/" className="manga-wordmark manga-mobile-wordmark shrink-0 whitespace-nowrap md:hidden" aria-label="royce.sh home">royce<span className="manga-wordmark-dot" aria-hidden="true">.sh</span></Link>
      <SheetContent
        side="left"
        className="manga-mobile-sheet w-[min(100vw,24rem)] max-w-full overflow-hidden border-r-2 bg-background p-5"
        hideCloseButton
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex items-center justify-between px-2 pb-6">
          <MobileLink
            href="/"
            className="manga-wordmark"
            aria-label="royce.sh home"
            onOpenChange={setOpen}
          >
            royce<span className="manga-wordmark-dot" aria-hidden="true">.sh</span>
          </MobileLink>
          <SheetClose asChild>
            <Button variant="icon" className="min-h-11 min-w-11">
              <IconX className="size-4" />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetClose>
        </div>

        <div className="manga-mobile-scroll overflow-y-auto pb-10">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {siteConfig.mainNav.map((item, index) => (
              <div key={index}>
                <MobileLink
                  href={item.href as string}
                  aria-label={item.title}
                  className={cn(
                    "manga-mobile-link flex min-h-11 items-center justify-between border-b px-3 py-3 text-base font-medium transition-colors",
                    firstPath === `${item.href?.slice(1)}`
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  )}
                  onOpenChange={setOpen}
                >
                  <span className="font-display text-2xl">{item.title}</span>
                  <IconLink className="size-4 opacity-30" />
                </MobileLink>
                <SubNav
                  titleName={item.title}
                  onOpenChange={setOpen}
                  pathname={pathname}
                />
              </div>
            ))}
          </nav>

          <div className="my-6 h-px bg-border/30" />

          <p className="px-3 text-sm">
            © {new Date().getFullYear()} Royce Mathew
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => onOpenChange?.(false)}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
