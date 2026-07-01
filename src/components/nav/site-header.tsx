import { CommandMenu } from "@/components/custom/command-menu"
import Settings from "@/components/custom/settings"
import { MainNav } from "@/components/nav/main-nav"
import { MobileNav } from "@/components/nav/mobile-nav"
import { ClientHeaderWrapper } from "@/components/nav/client-header-wrapper"

export function SiteHeader() {
  return (
    <ClientHeaderWrapper>
      <div className="container flex h-16 max-w-(--breakpoint-2xl) items-center px-6 md:h-20 md:px-8">
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
    </ClientHeaderWrapper>
  )
}
