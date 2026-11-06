import { Metadata } from "next"
import { projects } from "#site/content"
import { Suspense } from "react"
import { ProjectsStudyPrototype } from "./projects-study-prototype"
import { VariantA } from "./project-editorial-prototype"

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
const projectSummaries = sortedProjects.map(({ slug, title, description, imageSrc, tags, publishedDate, modifiedDate }) => ({
  slug, title, description, imageSrc, tags, publishedDate, modifiedDate,
}))

export default function AllProjects() {
  return (
    <Suspense fallback={<main className="projects-study"><VariantA projects={projectSummaries} /></main>}>
      <ProjectsStudyPrototype projects={projectSummaries} />
    </Suspense>
  )
}
