import { Suspense } from "react"
import { CommandMenu } from "@/components/custom/command-menu"
import Settings from "@/components/custom/settings"
import { MainNav } from "@/components/nav/main-nav"
import { MobileNav } from "@/components/nav/mobile-nav"
import { ClientHeaderWrapper } from "@/components/nav/client-header-wrapper"
import { IndexHeader } from "./index-header"
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
        <div className="index-header" data-surface="dark">
          <div className="index-header-inner">
            <div className="index-header-brand">{navigation}</div>
            <div className="index-header-tools">{tools}</div>
            <div className="index-header-menu">{mobileNavigation}</div>
          </div>
        </div>
      }>
        <IndexHeader navigation={navigation} mobileNavigation={mobileNavigation} tools={tools} />
      </Suspense>
    </ClientHeaderWrapper>
  )
}
