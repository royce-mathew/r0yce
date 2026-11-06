import Link from "next/link"
import type { Project } from "#site/content"
import { IconChevronDown } from "@tabler/icons-react"
import { siteConfig } from "@/config/docs"

export function ProjectPrototypeNavigation({ project, variant }: { project: Project; variant: "A" | "B" | "C" }) {
  const links = siteConfig.sidebarNav.map(group => (
    <ul key={group.title}>
      {group.items?.map(item => item.href && !item.disabled ? (
        <li key={item.href}>
          <Link href={`${item.href}?variant=${variant}`} aria-current={item.href === `/${project.slug}` ? "page" : undefined}>
            <span>{item.title}</span>
            {item.label && <small>{item.label.text}</small>}
          </Link>
        </li>
      ) : <li key={item.title}><span aria-disabled="true">{item.title}</span></li>)}
    </ul>
  ))

  return (
    <>
      <nav className="pd-project-rail" aria-label="Projects">
        <p className="pd-eyebrow">Projects</p>
        {links}
      </nav>
      <nav className="pd-project-picker" aria-label="Projects">
        <details key={project.slug}>
          <summary><span>Browse projects</span><strong>{project.title}</strong><IconChevronDown size={16} aria-hidden="true" /></summary>
          {links}
        </details>
      </nav>
    </>
  )
}
