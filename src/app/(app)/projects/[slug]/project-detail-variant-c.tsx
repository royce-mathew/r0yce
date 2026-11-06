import Image from "next/image"
import Link from "next/link"
import type { Project } from "#site/content"
import {
  PrototypeArticle,
  PrototypeFacts,
  PrototypeLinks,
  PrototypeToc,
} from "./project-detail-prototype-parts"
import "./project-detail-variant-c.css"

export function VariantC({ project }: { project: Project }) {
  return (
    <div className="pd-variant-c">
      <aside className="pd-c-identity" aria-label="Project dossier">
        <div className="pd-c-identity-inner">
          <Link className="pd-back" href="/projects">
            <span aria-hidden="true">←</span> All projects
          </Link>
          <header className="pd-c-heading">
            <p className="pd-eyebrow">Project dossier</p>
            <h1>{project.title}</h1>
            <p className="pd-description">{project.description}</p>
          </header>
          {project.imageSrc && (
            <div className="pd-c-image">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 290px, (min-width: 640px) 360px, calc(100vw - 48px)"
              />
            </div>
          )}
          <div className="pd-c-record">
            <PrototypeFacts project={project} />
            <PrototypeLinks project={project} />
          </div>
          {project.hasToc && (
            <section className="pd-c-contents" aria-label="In this project">
              <PrototypeToc project={project} />
            </section>
          )}
        </div>
      </aside>
      <div className="pd-c-story">
        <div className="pd-c-story-label">
          <span className="pd-eyebrow">The project</span>
          <span className="pd-c-reading-label">Notes &amp; details</span>
        </div>
        <PrototypeArticle project={project} />
        <footer className="pd-c-footer">
          <Link className="pd-back" href="/projects">
            <span aria-hidden="true">←</span> Explore all projects
          </Link>
        </footer>
      </div>
    </div>
  )
}
