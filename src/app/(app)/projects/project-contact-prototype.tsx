import Image from "next/image"
import Link from "next/link"
import type { ProjectStudyProps } from "./project-study-types"
import "./project-contact-prototype.css"

export function VariantC({ projects }: ProjectStudyProps) {
  return (
    <div className="project-contact">
      <header className="project-contact-header">
        <div className="project-contact-eyebrow"><span>Royce Mathew / Digital projects</span><span>{String(projects.length).padStart(2, "0")} works</span></div>
        <h1 className="font-display">THE WORK<span aria-hidden="true">↙</span></h1>
        <div className="project-contact-intro"><p>A contact sheet of things built for the web.</p><span>Latest updates first / Select to explore</span></div>
      </header>
      <div className="project-contact-grid">
        {projects.map((project, index) => (
          <Link key={project.slug} href={project.slug} className="project-contact-print" data-project-slug={project.slug}>
            <div className="project-contact-frame">
              <span className="project-contact-number">{String(index + 1).padStart(2, "0")}</span>
              <Image src={project.imageSrc} alt="" width={900} height={650} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 32vw" loading={index < 3 ? "eager" : undefined} />
              <span className="project-contact-open" aria-hidden="true">↗</span>
            </div>
            <div className="project-contact-caption"><h2>{project.title}</h2><time dateTime={project.publishedDate}>{new Date(project.publishedDate).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}</time></div>
            <p className="project-contact-description">{project.description}</p>
            <div className="project-contact-tags">{project.tags.slice(0, 3).join(" / ")}</div>
          </Link>
        ))}
      </div>
      <div className="project-contact-end"><span>End of contact sheet</span><span>{String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span></div>
    </div>
  )
}
