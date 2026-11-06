import { Suspense } from "react"
import { CommandMenu } from "@/components/custom/command-menu"
import Settings from "@/components/custom/settings"
import { MainNav } from "@/components/nav/main-nav"
import { MobileNav } from "@/components/nav/mobile-nav"
import { ClientHeaderWrapper } from "@/components/nav/client-header-wrapper"
import { TopbarStudyPrototype } from "./topbar-study-prototype"
import "./site-shell.css"

export function SiteHeader() {
  const navigation = <MainNav />
  const mobileNavigation = <MobileNav />
  const tools = (
    <div className="manga-header-tools flex flex-1 items-center justify-end gap-2">
      <div className="manga-search min-w-0 flex-1 md:flex-none"><CommandMenu /></div>
      <div className="manga-settings flex shrink-0 items-center"><Settings /></div>
    </div>
  )

  return (
    <ClientHeaderWrapper>
      <a className="manga-skip-link" href="#site-content">Skip to content</a>
      <Suspense fallback={
        <div className="manga-header-inner container flex max-w-(--breakpoint-2xl) items-center">
          {navigation}{mobileNavigation}{tools}
        </div>
      }>
        <TopbarStudyPrototype navigation={navigation} mobileNavigation={mobileNavigation} tools={tools} />
      </Suspense>
    </ClientHeaderWrapper>
  )
}
