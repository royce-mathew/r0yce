import Image from "next/image"
import Link from "next/link"
import type { Project } from "#site/content"
import { ProjectCardPreview, ProjectPreviewVideo } from "./project-card-preview"
import { resolveTechnology } from "./technologies"
import "./projects-index.css"

function PortfolioCard({ project, emphasis = "regular", eager = false }: {
  project: Project
  emphasis?: "lead" | "secondary" | "regular"
  eager?: boolean
}) {
  return (
    <ProjectCardPreview slug={project.slug} title={project.title} className={`pfp-card pfp-card--${emphasis}`}>
      <Link href={`/${project.slug.replace(/^\/+/, "")}`} className="project-preview-link">
      {project.imageSrc && (
        <div className="pfp-image">
          <Image
            src={project.imageSrc}
            alt=""
            width={1000}
            height={625}
            sizes={emphasis === "lead"
              ? "(max-width: 700px) 94vw, (max-width: 1000px) 57vw, 720px"
              : emphasis === "secondary"
                ? "(max-width: 700px) 94vw, (max-width: 1000px) 35vw, 440px"
                : "(max-width: 600px) 94vw, (max-width: 1000px) 46vw, 390px"}
            loading={eager ? "eager" : "lazy"}
          />
          <ProjectPreviewVideo />
        </div>
      )}
      <div className="pfp-card-body">
        <div className="pfp-title-row">
          <h2 className="font-display">{project.title}</h2>
          <span className="pfp-arrow" aria-hidden="true">↗</span>
        </div>
        <p className="pfp-description">{project.description}</p>
        <ul className="pfp-tags" aria-label="Technologies">
          {project.tags.map((tag) => {
            const technology = resolveTechnology(tag)
            return (
              <li key={tag} title={technology.name}>
                {technology.logo
                  ? <Image src={`/technology/${technology.logo}.svg`} alt={technology.name} width={24} height={24} />
                  : technology.name}
              </li>
            )
          })}
        </ul>
      </div>
      </Link>
    </ProjectCardPreview>
  )
}

export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured)
  const remaining = projects.filter((project) => !project.featured)
  const [lead, ...highlights] = featured

  return (
    <main className="projects-index">
      <header className="pfp-header">
        <h1 className="font-display">Projects</h1>
      </header>
      {lead && (
        <section className="pfp-curated" aria-label="Featured projects">
          <PortfolioCard project={lead} emphasis="lead" eager />
          <div className="pfp-highlights">
            {highlights.map((project) => (
              <PortfolioCard key={project.slug} project={project} emphasis="secondary" eager />
            ))}
          </div>
        </section>
      )}
      <section className="pfp-grid" aria-label="More projects">
        {remaining.map((project) => <PortfolioCard key={project.slug} project={project} />)}
      </section>
    </main>
  )
}
