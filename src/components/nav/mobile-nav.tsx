"use client"

import * as React from "react"
import Link from "next/link"
import { IconMenu2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { DrawerStudyPrototype } from "./drawer-study-prototype"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="icon" className="manga-mobile-trigger mr-2 min-h-11 min-w-11 px-0 md:hidden">
          <IconMenu2 className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <Link href="/" className="manga-wordmark manga-mobile-wordmark shrink-0 whitespace-nowrap md:hidden" aria-label="royce.sh home">royce<span className="manga-wordmark-dot" aria-hidden="true">.sh</span></Link>
      <React.Suspense fallback={null}>
        <DrawerStudyPrototype open={open} onOpenChange={setOpen} />
      </React.Suspense>
    </Sheet>
  )
}
