import Image from "next/image"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBrandGithubFilled,
  IconLink,
} from "@tabler/icons-react"
import { projects } from "#site/content"
import { Button } from "@/components/ui/button"
import { TagPill } from "@/components/custom/tag-pill"
import { DashboardTableOfContents } from "@/components/custom/toc"
import { Mdx } from "@/components/mdx/mdx-components"
import { ErrorBoundary } from "@/components/nav/error"

/**
 * Props for the ProjectPage component.
 */
interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Retrieves the project based on the provided params.
 * @param params - The project page props.
 * @returns The project matching the slug, or null if not found.
 */
function getProjectFromParams(slug: string) {
  return projects.find((project) => project.slugAsParams === slug)
}

/**
 * Generates metadata for the project page.
 * @param params - The project page props.
 * @returns The generated metadata.
 * @throws Error if the project is not found.
 */
export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectFromParams(slug)
  if (project == null) return {}
  return {
    title: `${project.title} — r0yce`,
    authors: [
      {
        name: "Royce Mathew",
      },
    ],
    description: project.description,
    keywords: project.tags,
    openGraph: {
      title: `${project.title} — r0yce`,
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
      title: `${project.title} — r0yce`,
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
      canonical: `https://r0yce.com/projects/${project.slug}`,
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
const ProjectLayout = async ({ params }: ProjectPageProps) => {
  const { slug } = await params
  const project = getProjectFromParams(slug)

  // If the project is not found, return an error boundary
  if (!project)
    return (
      <ErrorBoundary
        error={{ message: `Project not found for slug: ${slug}` }}
        rerouteUrl="/projects"
      />
    )

  return (
    <main className="relative">
      {/* Project Hero */}
      <section className="mx-auto w-full max-w-5xl pt-12 pb-8 md:px-8 md:pt-20 md:pb-12">
        {/* Back link */}
        <Link
          href="/projects"
          className="link-underline mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          <span className="tracking-wide">All Projects</span>
        </Link>

        {/* Title & description */}
        <div className="mt-6 space-y-4">
          <span className="label-editorial text-gold">Project</span>
          <h1 className="font-display text-4xl leading-[0.95] md:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {project.description}
          </p>
        </div>

        {/* Meta bar */}
        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-border/20 pt-4">
          {/* Tags */}
          <div className="flex max-w-full flex-wrap gap-2 md:max-w-[380px]">
            {project.tags.map((tag: string) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>

          <div className="hidden h-4 w-px bg-border/30 md:block" />

          {/* Date */}
          <time
            dateTime={project.publishedDate}
            className="text-[0.7rem] font-medium tracking-[0.05em] text-muted-foreground/70 uppercase"
          >
            {new Date(project.publishedDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>

          <div className="hidden h-4 w-px bg-border/30 md:block" />

          {/* Reading time */}
          <span className="text-[0.7rem] font-medium tracking-[0.05em] text-muted-foreground/70 uppercase">
            {project.metadata.readingTime} min read ·{" "}
            {project.metadata.wordCount} words
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* GitHub link */}
          {project.links?.github && (
            <Button
              asChild
              variant="outline"
              size="icon"
              className="size-9 rounded-sm border-border/30 hover:border-primary/30 hover:bg-primary/5"
            >
              <Link
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithubFilled className="size-4" />
              </Link>
            </Button>
          )}
          {/* Website link */}
          {project.links?.website && (
            <Button
              asChild
              variant="outline"
              size="icon"
              className="size-9 rounded-sm border-border/30 hover:border-primary/30 hover:bg-primary/5"
            >
              <Link
                href={project.links.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconLink className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="relative lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
        <div className="mx-auto w-full max-w-5xl pb-16 md:px-8">
          <article>
            <div className="pb-12">
              <Mdx code={project.code} className="mdx-shell-project" />
            </div>
          </article>
        </div>

        {project.hasToc && (
          <div className="hidden text-sm xl:block">
            <div className="sticky top-20 -mt-10 pt-4">
              <div className="h-[calc(100vh-3.5rem)] overflow-visible py-12">
                <DashboardTableOfContents toc={project.toc} />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default ProjectLayout
