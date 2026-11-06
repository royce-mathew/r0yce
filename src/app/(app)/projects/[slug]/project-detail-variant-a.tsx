import Link from "next/link"
import type { Project } from "#site/content"
import { IconArrowLeft } from "@tabler/icons-react"
import { PrototypeArticle, PrototypeFacts, PrototypeLinks, PrototypeToc } from "./project-detail-prototype-parts"

export function VariantA({ project }: { project: Project }) {
  return (
    <div className="pd-variant-a">
      <header className="pd-a-intro">
        <Link className="pd-back" href="/projects"><IconArrowLeft size={16} aria-hidden="true" /> All projects</Link>
        <p className="pd-eyebrow">Project notes</p>
        <h1>{project.title}</h1>
        <p className="pd-description">{project.description}</p>
        <PrototypeFacts project={project} />
        <PrototypeLinks project={project} />
      </header>
      <div className="pd-a-reading">
        <PrototypeArticle project={project} />
        <aside><PrototypeToc project={project} /></aside>
      </div>
    </div>
  )
}
