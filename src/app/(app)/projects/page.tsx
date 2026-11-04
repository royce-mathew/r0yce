import { Metadata } from "next"
import { Project, projects } from "#site/content"
import "./projects-prototype.css"
import { cn } from "@/lib/utils"
import ProjectButton from "@/components/custom/project-button"

export const metadata: Metadata = {
  title: "Projects — r0yce",
  description: "Selected works and projects by Royce Mathew.",
  keywords: [...projects.map((project) => project.title)],
  openGraph: {
    url: "https://r0yce.com/projects",
    type: "website",
    title: "Projects — r0yce",
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
    title: "Projects — r0yce",
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
    canonical: "https://r0yce.com/projects",
  },
}

const sortedProjects = [...projects].sort((a, b) =>
  b.modifiedDate.localeCompare(a.modifiedDate)
)
const featuredProjects = sortedProjects.filter((project) => project.featured)
const regularProjects = sortedProjects.filter((project) => !project.featured)

function ProjectGrid({
  projects,
  title,
  label,
}: {
  projects: Project[]
  title: string
  label?: string
}) {
  return (
    <section className={cn("project-chapter", label === "Highlighted Work" ? "project-chapter-featured" : "project-chapter-archive")}>
      <div className="project-chapter-heading">
        <div>
          {label && <span className="label-editorial">{label}</span>}
          <h2 className="font-display">{title}</h2>
        </div>
        <span className="project-chapter-count">{String(projects.length).padStart(2, "0")} entries</span>
      </div>
      <div className="project-panel-grid">
        {projects.map((project, index) => (
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

      {/* Featured */}
      {featuredProjects.length > 0 && (
        <ProjectGrid
          projects={featuredProjects}
          title="Featured"
          label="Highlighted Work"
        />
      )}

      {/* All Projects */}
      <ProjectGrid
        projects={regularProjects}
        title="All Projects"
        label="Complete Archive"
      />
    </main>
  )
}
