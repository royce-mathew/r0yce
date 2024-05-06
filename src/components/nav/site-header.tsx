import { CommandMenu } from "@/components/custom/command-menu"
import Settings from "@/components/custom/settings"
import { MainNav } from "@/components/nav/main-nav"
import { MobileNav } from "@/components/nav/mobile-nav"

export function SiteHeader() {
  return (
    <header className="dark:border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b bg-black backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <div className="flex w-10 items-center">
            <Settings />
          </div>
        </div>
      </div>
    </header>
  )
}
