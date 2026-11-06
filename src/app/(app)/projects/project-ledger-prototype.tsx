"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { ProjectStudyProps } from "./project-study-types"
import "./project-ledger-prototype.css"

export function VariantB({ projects }: ProjectStudyProps) {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug)
  const selected = projects.find((project) => project.slug === selectedSlug) ?? projects[0]
  const selectedIndex = projects.findIndex((project) => project.slug === selected?.slug)

  return (
    <div className="project-ledger">
      <header className="project-ledger__header">
        <div className="project-ledger__eyebrow">
          <span>Royce / Project ledger</span>
          <span>{String(projects.length).padStart(2, "0")} entries</span>
        </div>
        <h1>Work,<br /><span>on record.</span></h1>
        <div className="project-ledger__intro">
          <p>A running index of projects, experiments, and things built.</p>
          <span>Latest updated first ↓</span>
        </div>
      </header>

      <div className="project-ledger__body">
        <section className="project-ledger__index" aria-label="Complete project index">
          <div className="project-ledger__columns" aria-hidden="true">
            <span>No.</span><span>Project / Notes</span><span>Open</span>
          </div>
          <ol className="project-ledger__list">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link
                  href={project.slug}
                  className="project-ledger__row"
                  data-selected={selected?.slug === project.slug}
                  onMouseEnter={() => setSelectedSlug(project.slug)}
                  onFocus={() => setSelectedSlug(project.slug)}
                >
                  <span className="project-ledger__number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="project-ledger__entry">
                    <div className="project-ledger__mobile-cover">
                      <Image src={project.imageSrc} alt="" fill sizes="80px" loading={index === 0 ? "eager" : undefined} />
                    </div>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <div className="project-ledger__metadata">
                      <span className="project-ledger__tags">
                        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </span>
                      <span className="project-ledger__date">Updated <time dateTime={project.modifiedDate}>{project.modifiedDate.slice(0, 10)}</time></span>
                    </div>
                  </div>
                  <span className="project-ledger__arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="project-ledger__end"><span>End of index</span><span>{String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span></div>
        </section>

        {selected && (
          <aside className="project-ledger__preview" aria-label="Selected project preview">
            <div className="project-ledger__preview-label"><span>In view</span><span>/{String(selectedIndex + 1).padStart(2, "0")}</span></div>
            <figure>
              <div className="project-ledger__preview-image">
                <Image src={selected.imageSrc} alt="" fill loading="eager" sizes="(max-width: 760px) 1px, (max-width: 1200px) 35vw, 440px" />
              </div>
              <figcaption><span>{selected.title}</span><span aria-hidden="true">↗</span></figcaption>
            </figure>
            <p className="project-ledger__preview-hint">Hover or focus an entry to inspect.<br />Follow the row to open the project.</p>
          </aside>
        )}
      </div>
    </div>
  )
}
