import Image from "next/image"
import Link from "next/link"
import type { Project } from "#site/content"
import "./projects-overlay-prototype.css"

function OverlayCard({ project, featured = false, lead = false }: {
  project: Project
  featured?: boolean
  lead?: boolean
}) {
  return (
    <Link
      href={`/${project.slug.replace(/^\/+/, "")}`}
      className={`pop-card${featured ? " pop-card--featured" : ""}${lead ? " pop-card--lead" : ""}`}
    >
      <div className="pop-scene">
        {project.imageSrc && (
          <Image
            className="pop-image"
            src={project.imageSrc}
            alt=""
            width={1000}
            height={625}
            sizes={lead
              ? "(max-width: 760px) 94vw, (max-width: 1200px) 58vw, 740px"
              : featured
                ? "(max-width: 760px) 94vw, (max-width: 1200px) 36vw, 460px"
                : "(max-width: 760px) 94vw, (max-width: 1000px) 46vw, 390px"}
            loading={lead ? "eager" : "lazy"}
          />
        )}
        <div className="pop-caption">
          <div className="pop-title-row">
            <h2 className="font-display">{project.title}</h2>
            <span className="pop-arrow" aria-hidden="true">↗</span>
          </div>
          <p>{project.description}</p>
        </div>
      </div>
      <ul className="pop-technologies" aria-label="Technologies">
        {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
    </Link>
  )
}

export function ProjectsOverlayPrototype({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured)
  const remaining = projects.filter((project) => !project.featured)
  const [lead, ...highlights] = featured

  return (
    <main className="projects-index-prototype projects-overlay-prototype">
      <header className="pop-header">
        <h1 className="font-display">Projects</h1>
      </header>
      {lead && (
        <section className="pop-featured" aria-label="Featured projects">
          <OverlayCard project={lead} featured lead />
          <div className="pop-highlights">
            {highlights.map((project) => (
              <OverlayCard key={project.slug} project={project} featured />
            ))}
          </div>
        </section>
      )}
      <section className="pop-grid" aria-label="More projects">
        {remaining.map((project) => <OverlayCard key={project.slug} project={project} />)}
      </section>
    </main>
  )
}
