import Image from "next/image"
import Link from "next/link"
import type { Project } from "#site/content"
import "./projects-split-prototype.css"

function SplitCard({ project, variant = "compact", eager = false }: {
  project: Project
  variant?: "lead" | "secondary" | "compact"
  eager?: boolean
}) {
  return (
    <Link
      href={`/${project.slug.replace(/^\/+/, "")}`}
      className={`psp-card psp-card--${variant}${project.imageSrc ? "" : " psp-card--text-only"}`}
    >
      {project.imageSrc && (
        <div className="psp-preview">
          <Image
            src={project.imageSrc}
            alt=""
            width={1000}
            height={625}
            sizes={variant === "lead"
              ? "(max-width: 700px) 94vw, (max-width: 1200px) 56vw, 760px"
              : "(max-width: 700px) 94vw, (max-width: 1000px) 40vw, 270px"}
            loading={eager ? "eager" : "lazy"}
          />
        </div>
      )}
      <div className="psp-copy">
        <div className="psp-title-row">
          <h2 className="font-display">{project.title}</h2>
          <span className="psp-arrow" aria-hidden="true">↗</span>
        </div>
        <p className="psp-description">{project.description}</p>
        <ul className="psp-tags" aria-label="Technologies">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </Link>
  )
}

export function ProjectsSplitPrototype({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured)
  const remaining = projects.filter((project) => !project.featured)
  const [lead, ...secondary] = featured

  return (
    <main className="projects-index-prototype projects-split-prototype">
      <header className="psp-header">
        <h1 className="font-display">Projects</h1>
      </header>
      {lead && (
        <section className="psp-featured" aria-label="Featured projects">
          <SplitCard project={lead} variant="lead" eager />
          <div className="psp-secondary">
            {secondary.map((project) => (
              <SplitCard key={project.slug} project={project} variant="secondary" />
            ))}
          </div>
        </section>
      )}
      <section className="psp-remaining" aria-label="More projects">
        {remaining.map((project) => <SplitCard key={project.slug} project={project} />)}
      </section>
    </main>
  )
}
