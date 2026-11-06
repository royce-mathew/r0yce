import Image from "next/image"
import Link from "next/link"
import type { ProjectStudyProps } from "./project-study-types"
import "./project-editorial-prototype.css"

const publishedDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

export function VariantA({ projects }: ProjectStudyProps) {
  const [lead, ...index] = projects

  return (
    <div className="project-editorial">
      <header className="project-editorial__masthead">
        <div className="project-editorial__edition">
          <span>Royce Mathew / Collected work</span>
          <span>{String(projects.length).padStart(2, "0")} projects · Latest updates first</span>
        </div>
        <h1>The project<br /><span>edition.</span></h1>
        <div className="project-editorial__strapline">
          <span>A collection of things I’ve made.</span>
          <span>Design / Code / Experiments</span>
        </div>
      </header>

      {lead && (
        <section className="project-editorial__feature" aria-labelledby="editorial-lead-title">
          <Link href={lead.slug} className="project-editorial__feature-link">
            <div className="project-editorial__feature-image">
              <Image src={lead.imageSrc} alt="" fill loading="eager" sizes="(max-width: 760px) 100vw, 60vw" />
              <span className="project-editorial__image-label">01 / Opening story</span>
            </div>
            <div className="project-editorial__feature-copy">
              <div className="project-editorial__eyebrow">The latest update</div>
              <h2 id="editorial-lead-title">{lead.title}</h2>
              <p>{lead.description}</p>
              <div className="project-editorial__tags">
                {lead.tags?.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="project-editorial__feature-bottom">
                <span>Published <time dateTime={lead.publishedDate}>{publishedDate.format(new Date(lead.publishedDate))}</time></span>
                <span className="project-editorial__read">Read the project <span aria-hidden="true">↗</span></span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {index.length > 0 && (
        <section className="project-editorial__index" aria-labelledby="editorial-index-title">
          <div className="project-editorial__index-heading">
            <h2 id="editorial-index-title">Further reading<span aria-hidden="true">.</span></h2>
            <span>{String(index.length).padStart(2, "0")} more projects / In order of last update</span>
          </div>
          <ol start={2} className="project-editorial__entries">
            {index.map((project, position) => (
              <li key={project.slug}>
                <Link href={project.slug} className="project-editorial__entry">
                  <span className="project-editorial__number">{String(position + 2).padStart(2, "0")}</span>
                  <div className="project-editorial__thumbnail">
                    <Image src={project.imageSrc} alt="" fill sizes="(max-width: 560px) 72px, (max-width: 760px) 90px, 120px" />
                  </div>
                  <div className="project-editorial__entry-copy">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-editorial__tags">
                      {project.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                  <div className="project-editorial__entry-meta">
                    <span>Published</span>
                    <time dateTime={project.publishedDate}>{publishedDate.format(new Date(project.publishedDate))}</time>
                    <span className="project-editorial__entry-arrow" aria-hidden="true">↗</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          <div className="project-editorial__endnote"><span>End of this edition</span><span>{String(projects.length).padStart(2, "0")} projects, collected.</span></div>
        </section>
      )}
    </div>
  )
}
