import { CommandMenu } from "@/components/custom/command-menu"
import Settings from "@/components/custom/settings"
import { MainNav } from "@/components/nav/main-nav"
import { MobileNav } from "@/components/nav/mobile-nav"
import { ClientHeaderWrapper } from "@/components/nav/client-header-wrapper"
import "./site-shell.css"

export function SiteHeader() {
  return (
    <ClientHeaderWrapper>
      <a className="manga-skip-link" href="#site-content">Skip to content</a>
      <div className="manga-header-inner container flex max-w-(--breakpoint-2xl) items-center">
        <MainNav />
        <MobileNav />
        <div className="manga-header-tools flex flex-1 items-center justify-end gap-2">
          <div className="manga-search min-w-0 flex-1 md:flex-none">
            <CommandMenu />
          </div>
          <div className="manga-settings flex shrink-0 items-center">
            <Settings />
          </div>
        </div>
      </div>
    </ClientHeaderWrapper>
  )
}
