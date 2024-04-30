import Link from "next/link"
import { projects } from "#site/content"
import { format, parseISO } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"
import { Mdx } from "@/components/mdx-components"
import { DashboardTableOfContents } from "@/components/toc"

/**
 * Props for the ProjectPage component.
 */
interface ProjectPageProps {
  params: {
    slug: string
  }
}

/**
 * Retrieves the project based on the provided params.
 * @param params - The project page props.
 * @returns The project matching the slug, or null if not found.
 */
async function getProjectFromParams({ params }: ProjectPageProps) {
  const slug = params.slug || ""
  const project = projects.find((project) => project.slugAsParams === slug)

  if (!project) {
    return null
  }

  return project
}

/**
 * Generates metadata for the project page.
 * @param params - The project page props.
 * @returns The generated metadata.
 * @throws Error if the project is not found.
 */
export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await getProjectFromParams({ params })
  if (!project) return {}
  return {
    title: `${project.title} | r0yce`,
    authors: [
      {
        name: "Royce Mathew",
      },
    ],
    description: project.description,
    keywords: project.tags,
    openGraph: {
      title: `${project.title} | r0yce`,
      description: project.description,
      type: "article",
      url: `https://r0yce.com/${project.slug}`,
      publishedTime: project.publishedDate,
      modifiedTime: project.modifiedDate,
      authors: ["https://r0yce.com/"],
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
      // site: "@r0yce02",
      // creator: "@r0yce02",
      title: `${project.title} | r0yce`,
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
      canonical: `https://r0yce.com/${project.slug}`,
    },
  }
}

/**
 * Generates static params for the project page.
 * @returns The generated static params.
 */
export const generateStaticParams = async () =>
  projects.map((project) => ({ slug: project.slugAsParams }))

/**
 * The layout component for the project page.
 * @param params - The layout component props.
 * @returns The rendered project page layout.
 * @throws Error if the project is not found.
 */
const ProjectLayout = async ({ params }: { params: { slug: string } }) => {
  const project = projects.find(
    (project) => project.slugAsParams === params.slug
  )

  if (!project) throw new Error(`Project not found for slug: ${params.slug}`)

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_220px]">
      <div className="mx-auto w-full min-w-0">
        <article>
          <div className="border-border mb-2 w-full border-b text-center">
            <h1 className="text-3xl font-bold lg:text-4xl xl:text-5xl">
              {project.title}
            </h1>

            {/* Project Information */}
            <div className="flex flex-col space-y-6 py-5">
              <p className="text-xs md:text-lg">{project.description}</p>
              {/* Tags and attached links */}
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-wrap space-x-2">
                  {project.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      // className="bg-primary text-background mb-2 rounded-md px-1.5 py-0.5 text-xs"
                      variant="defaultNonInteractive"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div>
                  {project.links?.github && (
                    <Button asChild variant="outline" size="icon">
                      <Link
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icons.github className="size-5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-row justify-between text-xs md:text-base">
                <text>
                  Word Count:{" "}
                  <span className="text-primary">
                    {project.metadata.wordCount}
                  </span>
                </text>
                <text className="flex flex-col md:flex-row md:gap-2">
                  Published Date:
                  <time
                    dateTime={project.publishedDate}
                    className="text-primary"
                  >
                    {format(parseISO(project.publishedDate), "LLLL d, yyyy")}
                  </time>
                </text>
                <text>
                  Reading Time:{" "}
                  <span className="text-primary">
                    {project.metadata.readingTime}m
                  </span>
                </text>
              </div>
            </div>
          </div>
          <div className="pb-12 pt-6">
            <Mdx code={project.code} />
          </div>
        </article>
      </div>

      {project.hasToc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <DashboardTableOfContents toc={project.toc} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProjectLayout
