"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "#site/content"
import "./projects-explorer-prototype.css"

export function ProjectsExplorerPrototype({ projects }: { projects: Project[] }) {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "")
  const selectedProject = projects.find((project) => project.slug === selectedSlug) ?? projects[0]
  const publicationYear = (project: Project) =>
    new Date(project.publishedDate).toLocaleDateString("en-US", { year: "numeric", timeZone: "UTC" })

  return (
    <main className="projects-index-prototype projects-explorer-prototype">
      <header className="projects-explorer-heading">
        <h1 className="font-display">Projects</h1>
        <p className="projects-prototype-summary">Browse a project, then open its case study.</p>
      </header>

      {selectedProject ? (
        <div className="projects-explorer-library">
          <aside className="projects-explorer-index" aria-label="Project index">
            <div className="projects-explorer-index-heading">
              <span>Project index</span>
              <span>Published</span>
            </div>
            <ul>
              {projects.map((project) => (
                <li key={project.slug}>
                  <button
                    type="button"
                    aria-pressed={project.slug === selectedProject.slug}
                    aria-controls="projects-explorer-preview"
                    onClick={() => setSelectedSlug(project.slug)}
                  >
                    <span className="projects-explorer-index-title">{project.title}</span>
                    <time dateTime={project.publishedDate}>{publicationYear(project)}</time>
                    <span className="projects-explorer-selection-mark" aria-hidden="true">↗</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="projects-explorer-detail">
            <div className="projects-explorer-mobile-picker">
              <label htmlFor="projects-explorer-choice">Choose a project</label>
              <select
                id="projects-explorer-choice"
                value={selectedProject.slug}
                onChange={(event) => setSelectedSlug(event.target.value)}
                aria-controls="projects-explorer-preview"
              >
                {projects.map((project) => (
                  <option key={project.slug} value={project.slug}>
                    {project.title} · {publicationYear(project)}
                  </option>
                ))}
              </select>
            </div>

            <article id="projects-explorer-preview" aria-labelledby="projects-explorer-title">
              {selectedProject.imageSrc && (
                <div className="projects-explorer-cover">
                  <Image
                    key={selectedProject.imageSrc}
                    src={selectedProject.imageSrc}
                    alt=""
                    fill
                    sizes="(max-width: 800px) 94vw, (max-width: 1280px) 60vw, 780px"
                    className="projects-explorer-image"
                  />
                </div>
              )}
              <div className="projects-explorer-preview-body">
                <div className="projects-explorer-project-heading">
                  <h2 id="projects-explorer-title" className="font-display">{selectedProject.title}</h2>
                  <time dateTime={selectedProject.publishedDate}>{publicationYear(selectedProject)}</time>
                </div>
                <p className="projects-explorer-description">{selectedProject.description}</p>
                <ul className="projects-explorer-technologies" aria-label="Technologies">
                  {selectedProject.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <Link className="projects-explorer-story" href={`/${selectedProject.slug.replace(/^\/+/, "")}`}>
                  Read case study <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      ) : (
        <p className="projects-prototype-summary">No projects available.</p>
      )}
    </main>
  )
}
