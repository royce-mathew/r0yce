"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { siteConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

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
    <div className="text-l mt-4 flex w-full flex-col space-y-3 border-l px-3">
      {foundSubnav.items.map((subItem, subIndex) => (
        <Button key={subIndex} className="w-full" variant="outline" asChild>
          <MobileLink
            href={subItem.href as string}
            className={cn(
              "hover:text-foreground/80 text-foreground/60 w-full justify-between font-light transition-colors",
              pathname === subItem.href ? "text-primary" : ""
            )}
            aria-label={subItem.title}
            onOpenChange={onOpenChange}
          >
            <span className="w-36 overflow-hidden truncate">
              {subItem.title}
            </span>
            <Icons.code className="size-5" />
          </MobileLink>
        </Button>
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
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.hamburger />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex items-center">
          <span className="text-lg font-bold">Navigation Menu</span>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] px-6 pb-10">
          <div className="flex flex-col space-y-3 text-lg">
            {siteConfig.mainNav.map((item, index) => (
              <div key={index}>
                <Button variant="outline" asChild>
                  <MobileLink
                    key={index}
                    href={item.href as string}
                    aria-label={item.title}
                    className={cn(
                      "hover:text-foreground/80 text-foreground/60 w-full justify-between transition-colors",
                      firstPath === `${item.href?.slice(1)}`
                        ? "text-foreground"
                        : ""
                    )}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                    <Icons.link className="size-5" />
                  </MobileLink>
                </Button>
                <SubNav
                  titleName={item.title}
                  onOpenChange={setOpen}
                  pathname={pathname}
                />
              </div>
            ))}
          </div>
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
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
