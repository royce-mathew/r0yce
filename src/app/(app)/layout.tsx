import React from "react"
import { SiteFooter } from "@/components/nav/site-footer"
import { SiteHeader } from "@/components/nav/site-header"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div id="site-content" tabIndex={-1}>{children}</div>
      <SiteFooter />
    </>
  )
}
