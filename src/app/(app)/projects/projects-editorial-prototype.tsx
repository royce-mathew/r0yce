import Image from "next/image"
import Link from "next/link"
import type { Project } from "#site/content"
import "./projects-editorial-prototype.css"

function EditorialProject({ project, emphasis = "regular", eager = false }: {
  project: Project
  emphasis?: "lead" | "highlight" | "regular"
  eager?: boolean
}) {
  return (
    <Link
      href={`/${project.slug.replace(/^\/+/, "")}`}
      className={`pep-project pep-project--${emphasis}`}
    >
      {project.imageSrc && (
        <div className="pep-image">
          <Image
            src={project.imageSrc}
            alt=""
            width={1200}
            height={750}
            sizes={emphasis === "lead"
              ? "(max-width: 760px) 94vw, (max-width: 1200px) 58vw, 760px"
              : emphasis === "highlight"
                ? "(max-width: 760px) 94vw, (max-width: 1200px) 32vw, 420px"
                : "(max-width: 760px) 94vw, (max-width: 1200px) 45vw, 580px"}
            loading={eager ? "eager" : "lazy"}
          />
        </div>
      )}
      <div className="pep-caption">
        <div className="pep-title">
          <h2 className="font-display">{project.title}</h2>
          <span aria-hidden="true">↗</span>
        </div>
        <p className="pep-description">{project.description}</p>
        <ul className="pep-tags" aria-label="Technologies">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </Link>
  )
}

export function ProjectsEditorialPrototype({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured)
  const remaining = projects.filter((project) => !project.featured)
  const [lead, ...highlights] = featured

  return (
    <main className="projects-index-prototype projects-editorial-prototype">
      <header className="pep-header">
        <h1 className="font-display">Projects</h1>
      </header>
      {lead && (
        <section className="pep-featured" aria-label="Featured projects">
          <EditorialProject project={lead} emphasis="lead" eager />
          <div className="pep-highlights">
            {highlights.map((project) => (
              <EditorialProject key={project.slug} project={project} emphasis="highlight" />
            ))}
          </div>
        </section>
      )}
      <section className="pep-gallery" aria-label="More projects">
        {remaining.map((project) => <EditorialProject key={project.slug} project={project} />)}
      </section>
    </main>
  )
}
