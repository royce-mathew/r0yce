import type { Project } from "#site/content"
import Link from "next/link"
import { siteConfig } from "@/config/docs"
import { ProjectSwitcher } from "./project-switcher"
import "./project-navigation.css"

export function ProjectNavigation({ project }: { project: Project }) {
  const items = (siteConfig.sidebarNav.find((item) => item.href === "/projects")?.items ?? [])
    .flatMap((item) => item.href ? [{ title: item.title, href: item.href }] : [])
  const currentHref = `/${project.slug}`
  const currentIndex = items.findIndex((item) => item.href === currentHref)
  const previous = items[(currentIndex - 1 + items.length) % items.length]
  const next = items[(currentIndex + 1) % items.length]

  return (
    <nav className="project-navigation" aria-label="Project navigation">
      <ProjectSwitcher items={items} currentHref={currentHref} currentTitle={project.title} />
      <div className="project-navigation-steps">
        <Link href="/projects" className="project-navigation-step"><span className="link-underline-target">All projects</span></Link>
        {previous && (
          <Link href={previous.href} className="project-navigation-step" aria-label={`Previous project: ${previous.title}`}>
            <span aria-hidden="true">←</span> <span className="link-underline-target">Previous</span>
          </Link>
        )}
        {next && (
          <Link href={next.href} className="project-navigation-step" aria-label={`Next project: ${next.title}`}>
            <span className="link-underline-target">Next</span> <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
