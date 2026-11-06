import Image from "next/image"
import Link from "next/link"
import type { Project } from "#site/content"
import {
  PrototypeArticle,
  PrototypeFacts,
  PrototypeLinks,
  PrototypeToc,
} from "./project-detail-prototype-parts"
import "./project-detail-variant-b.css"

export function VariantB({ project }: { project: Project }) {
  return (
    <div className="pd-variant-b">
      <Link href="/projects" className="pd-back">
        <span aria-hidden="true">←</span> All projects
      </Link>

      <section className="pd-b-opening" aria-labelledby="pd-b-title">
        <figure className="pd-b-cover">
          <div className="pd-b-image-stage">
            <Image
              src={project.imageSrc}
              alt={`${project.title} project preview`}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="pd-b-image"
            />
          </div>
          <figcaption>
            <span>{project.title}</span>
            <span className="pd-eyebrow">Project preview</span>
          </figcaption>
        </figure>

        <header className="pd-b-intro">
          <p className="pd-eyebrow">Project / Case study</p>
          <h1 id="pd-b-title" className="font-display">{project.title}</h1>
          <p className="pd-description">{project.description}</p>
          <PrototypeLinks project={project} />
          <div className="pd-b-metadata">
            <PrototypeFacts project={project} />
          </div>
        </header>
      </section>

      <section className="pd-b-story" aria-label="Project story">
        <div className="pd-b-story-heading">
          <p className="pd-eyebrow">Behind the project</p>
          <a className="pd-b-read" href="#pd-b-article">
            Read the story <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="pd-b-reading-layout">
          <div id="pd-b-article" className="pd-b-article">
            <PrototypeArticle project={project} />
          </div>
          {project.hasToc && (
            <aside className="pd-b-contents" aria-label="On this page">
              <PrototypeToc project={project} />
            </aside>
          )}
        </div>
      </section>
    </div>
  )
}
