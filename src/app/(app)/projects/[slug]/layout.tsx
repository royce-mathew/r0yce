import { docsConfig } from "@/config/docs";
import { ProjectSidebarNav } from "@/components/sidebar-nav";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b">
      <div className="container items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-6">
        <aside className="flex-grow w-full hidden h-[calc(100vh-3.5rem)] md:sticky md:block">
          <ScrollArea className="h-full py-6 lg:py-8 w-full">
            <ProjectSidebarNav items={docsConfig.sidebarNav} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </div>
  );
}
