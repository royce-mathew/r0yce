import { siteConfig } from "@/config/docs"
import { ProjectSidebarNav } from "@/components/nav/sidebar-nav"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b border-border/20">
      <div className="container items-start md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden h-[calc(100vh-5rem)] w-full grow md:sticky md:top-20 md:block">
          <div className="size-full overflow-visible py-8">
            <div className="mb-4">
              <span className="label-editorial text-gold">Projects</span>
            </div>
            <ProjectSidebarNav items={siteConfig.sidebarNav} />
          </div>
        </aside>
        {children}
      </div>
    </div>
  )
}
