"use client"

import type { HTMLAttributes } from "react"
import type { Project } from "#site/content"
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react"
import { Mdx } from "@/components/mdx/mdx-components"
import { DashboardTableOfContents } from "@/components/custom/toc"

const headings = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
}

export function PrototypeArticle({ project }: { project: Project }) {
  return <article className="pd-prose"><Mdx code={project.code} components={headings} /></article>
}

export function PrototypeFacts({ project }: { project: Project }) {
  return (
    <div className="pd-facts">
      <div className="pd-tags" aria-label="Technologies">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="pd-date"><time dateTime={project.publishedDate}>{new Date(project.publishedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time><span>{project.metadata.readingTime} min read</span></div>
    </div>
  )
}

export function PrototypeLinks({ project }: { project: Project }) {
  if (!project.links?.website && !project.links?.github) return null
  return (
    <div className="pd-actions">
      {project.links?.website && <a className="pd-action" href={project.links.website} target="_blank" rel="noopener noreferrer">Visit project <IconArrowUpRight size={16} aria-hidden="true" /></a>}
      {project.links?.github && <a className="pd-action pd-action-secondary" href={project.links.github} target="_blank" rel="noopener noreferrer"><IconBrandGithub size={16} aria-hidden="true" /> Source code</a>}
    </div>
  )
}

export function PrototypeToc({ project }: { project: Project }) {
  if (!project.hasToc) return null
  return <nav className="pd-toc" aria-label="Article contents"><DashboardTableOfContents toc={project.toc} /></nav>
}
