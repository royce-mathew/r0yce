import { projects } from "#site/content"
import { ErrorBoundary } from "@/components/nav/error"
import { ProjectDetail } from "./project-detail"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

function getProjectFromParams(slug: string) {
  return projects.find((project) => project.slugAsParams === slug)
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectFromParams(slug)
  if (project == null) return {}
  return {
    title: `${project.title} | royce.sh`,
    authors: [
      {
        name: "Royce Mathew",
      },
    ],
    description: project.description,
    keywords: project.tags,
    openGraph: {
      siteName: "royce.sh",
      title: `${project.title} | royce.sh`,
      description: project.description,
      type: "article",
      url: `https://royce.sh/${project.slug}`,
      publishedTime: project.publishedDate,
      modifiedTime: project.modifiedDate,
      authors: ["https://royce.sh/"],
      tags: project.tags,
      images: [
        {
          url: project.imageSrc,
          width: 500,
          height: 500,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | royce.sh`,
      description: project.description,
      images: [
        {
          url: project.imageSrc,
          width: 500,
          height: 500,
          alt: project.title,
        },
      ],
    },
    alternates: {
      canonical: `https://royce.sh/${project.slug}`,
    },
  }
}

export const generateStaticParams = async () =>
  projects.map((project) => ({ slug: project.slugAsParams }))

const ProjectLayout = async ({ params }: ProjectPageProps) => {
  const { slug } = await params
  const project = getProjectFromParams(slug)

  if (!project)
    return (
      <ErrorBoundary
        error={{ message: `Project not found for slug: ${slug}` }}
        rerouteUrl="/projects"
      />
    )

  return <ProjectDetail project={project} />
}

export default ProjectLayout
