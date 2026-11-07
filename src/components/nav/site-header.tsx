import { Suspense } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/custom/command-menu"
import Settings from "@/components/custom/settings"
import { IndexDrawer } from "@/components/nav/index-drawer"
import { ClientHeaderWrapper } from "@/components/nav/client-header-wrapper"
import { IndexHeader } from "./index-header"
import "./site-shell.css"

export function SiteHeader() {
  const brand = (
    <Link href="/" className="manga-wordmark" aria-label="royce.sh home">
      royce<span aria-hidden="true" className="manga-wordmark-dot">.sh</span>
    </Link>
  )
  const drawer = <IndexDrawer />
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
            <div className="index-header-brand">{brand}</div>
            <div className="index-header-tools">{tools}</div>
            <div className="index-header-menu">{drawer}</div>
          </div>
        </div>
      }>
        <IndexHeader brand={brand} drawer={drawer} tools={tools} />
      </Suspense>
    </ClientHeaderWrapper>
  )
}
