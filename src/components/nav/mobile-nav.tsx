"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence } from "motion/react"
import { siteConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
            "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
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
        <Button variant="icon" className="mr-2 px-0 md:hidden">
          <IconMenu2 className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
      <SheetContent
        side="left"
        className="w-full max-w-sm border-r border-border/30 bg-background/95 backdrop-blur-xl pr-0"
        hideCloseButton
      >
        <div className="flex items-center justify-between px-2 pb-6">
          <MobileLink
            href="/"
            className="group flex items-center space-x-3"
            onOpenChange={setOpen}
          >
            <Image
              src="/favicon.png"
              width={20}
              height={20}
              alt="Logo"
              className="opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="font-display text-lg text-foreground/90 transition-colors group-hover:text-foreground">
              r0yce
            </span>
          </MobileLink>
          <SheetClose asChild>
            <Button variant="icon" className="size-8">
              <IconX className="size-4" />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetClose>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] px-2 pb-10">
          <div className="flex flex-col space-y-1">
            {siteConfig.mainNav.map((item, index) => (
              <div key={index}>
                <MobileLink
                  href={item.href as string}
                  aria-label={item.title}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-3 text-base font-medium transition-colors",
                    firstPath === `${item.href?.slice(1)}`
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  )}
                  onOpenChange={setOpen}
                >
                  <span className="font-display text-xl">{item.title}</span>
                  <IconLink className="size-4 opacity-30" />
                </MobileLink>
                <SubNav
                  titleName={item.title}
                  onOpenChange={setOpen}
                  pathname={pathname}
                />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-border/30" />

          <p className="label-editorial px-3">
            © {new Date().getFullYear()} Royce Mathew
          </p>
        </ScrollArea>
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
