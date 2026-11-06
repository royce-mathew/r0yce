import type { Project } from "#site/content"
import Image from "next/image"
import Link from "next/link"
import { IconArrowDown, IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react"
import { DashboardTableOfContents } from "@/components/custom/toc"
import { Button } from "@/components/ui/button"
import { ProjectArticle } from "./project-article"
import { ProjectNavigation } from "./project-navigation"
import { ProjectTechnologies } from "./project-technologies"
import "./project-detail.css"

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main className="project-detail">
      <ProjectNavigation project={project} />
      <section className="project-opening" aria-labelledby="project-title">
        <figure className="project-cover">
          <div className="project-image-stage">
            <Image
              src={project.imageSrc}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 1440px) 840px, (min-width: 1024px) 62vw, 100vw"
              className="project-image"
            />
          </div>
          <figcaption>Preview</figcaption>
        </figure>
        <header className="project-intro">
          <h1 id="project-title" className="font-display">{project.title}</h1>
          <p className="project-description">{project.description}</p>
          <ProjectTechnologies tags={project.tags} />
          {(project.links?.website || project.links?.github) && (
            <div className="project-actions">
              {project.links.website && (
                <Link href={project.links.website} target="_blank" rel="noopener noreferrer">
                  Visit website <IconArrowUpRight size={16} aria-hidden="true" />
                </Link>
              )}
              {project.links.github && (
                <Button asChild variant="secondary" className="project-source-button rounded-sm">
                  <Link href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <IconBrandGithub size={16} aria-hidden="true" /> Source code
                  </Link>
                </Button>
              )}
            </div>
          )}
          <div className="project-facts">
            <time dateTime={project.publishedDate}>
              {new Date(project.publishedDate).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
              })}
            </time>
            <span>{project.metadata.readingTime} min read · {project.metadata.wordCount} words</span>
          </div>
          <a className="project-read" href="#project-article">
            Read the story <IconArrowDown size={15} aria-hidden="true" />
          </a>
        </header>
      </section>
      <section className={`project-reading-layout${project.hasToc ? " project-has-toc" : ""}`} aria-label="Project story">
        <article id="project-article" className="project-article">
          <ProjectArticle code={project.code} />
        </article>
        {project.hasToc && (
          <aside className="project-contents" aria-label="On this page">
            <DashboardTableOfContents toc={project.toc} />
          </aside>
        )}
      </section>
    </main>
  )
}
