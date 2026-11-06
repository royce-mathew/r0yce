import { Metadata } from "next"
import { projects } from "#site/content"
import "./projects-prototype.css"
import ProjectButton from "@/components/custom/project-button"

export const metadata: Metadata = {
  title: "Projects — royce.sh",
  description: "Selected works and projects by Royce Mathew.",
  keywords: [...projects.map((project) => project.title)],
  openGraph: {
    siteName: "royce.sh",
    url: "https://royce.sh/projects",
    type: "website",
    title: "Projects — royce.sh",
    description: "Selected works and projects by Royce Mathew.",
    images: [
      ...projects.map((project) => ({
        url: project.imageSrc,
        width: 500,
        height: 500,
        alt: project.title,
      })),
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — royce.sh",
    description: "Selected works and projects by Royce Mathew.",
    images: [
      ...projects.map((project) => ({
        url: project.imageSrc,
        width: 500,
        height: 500,
        alt: project.title,
      })),
    ],
  },
  alternates: {
    canonical: "https://royce.sh/projects",
  },
}

const sortedProjects = [...projects].sort((a, b) =>
  b.modifiedDate.localeCompare(a.modifiedDate)
)
function ProjectCollection() {
  return (
    <section className="project-chapter" aria-labelledby="all-projects-title">
      <div className="project-chapter-heading">
        <div>
          <span className="label-editorial">The complete collection / Latest updates first</span>
          <h2 id="all-projects-title" className="font-display">All Projects</h2>
        </div>
        <span className="project-chapter-count">{String(sortedProjects.length).padStart(2, "0")} entries</span>
      </div>
      <div className="project-panel-grid">
        {sortedProjects.map((project, index) => (
          <ProjectButton
            key={project.slug}
            project={project}
            index={index}
            className="h-full"
          />
        ))}
      </div>
    </section>
  )
}

export default function AllProjects() {
  return (
    <main className="projects-prototype">
      <section className="project-index-hero">
        <div className="project-index-heading">
          <div>
            <span className="label-editorial">Portfolio / Collected works</span>
            <h1 className="font-display">
              Selected
              <br />
              <span>Works</span>
            </h1>
          </div>
          <div className="project-index-total">
            <span className="font-display text-primary">{projects.length}</span>
            <span className="label-editorial">Total Projects</span>
          </div>
        </div>

        <div className="project-index-rule" />
      </section>

      <ProjectCollection />
    </main>
  )
}
