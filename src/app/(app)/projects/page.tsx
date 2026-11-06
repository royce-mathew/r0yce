import { Metadata } from "next"
import { type Project, projects } from "#site/content"
import { NumberFlowComponent } from "@/components/ui/number"
import ProjectButton from "@/components/custom/project-button"
import { LayoutPrototypeSwitcher } from "@/components/custom/layout-prototype-switcher"
import { ProjectsFeaturedPrototype } from "./projects-featured-prototype"
import { ProjectsEditorialPrototype } from "./projects-editorial-prototype"
import { ProjectsOverlayPrototype } from "./projects-overlay-prototype"
import { ProjectsSplitPrototype } from "./projects-split-prototype"
import "./projects-index-prototype.css"

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
const featuredProjects = sortedProjects.filter((project) => project.featured)
const regularProjects = sortedProjects.filter((project) => !project.featured)

const prototypeDirections = [
  { key: "B", name: "Featured baseline" },
  { key: "D", name: "Editorial gallery" },
  { key: "E", name: "Cinematic cards" },
  { key: "F", name: "Split panels" },
]

function ProjectGrid({ projects, title, label, id }: {
  projects: Project[]
  title: string
  label: string
  id: string
}) {
  return (
    <section className="w-full py-16 md:py-24" aria-labelledby={id}>
      <div className="container mx-auto mb-12 flex max-w-7xl items-end justify-between px-6 md:px-8">
        <div className="space-y-2">
          <span className="label-editorial text-gold">{label}</span>
          <h2 id={id} className="font-display text-3xl md:text-4xl">{title}</h2>
        </div>
        <div className="mb-2 ml-8 hidden h-px max-w-32 flex-1 bg-border/30 md:block" />
      </div>
      <div className="container mx-auto grid max-w-7xl auto-rows-fr grid-cols-1 gap-5 px-6 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectButton key={project.slug} project={project} index={index} className="h-full" />
        ))}
      </div>
    </section>
  )
}

export default async function ProjectsPage({ searchParams }: {
  searchParams: Promise<{ variant?: string | string[] }>
}) {
  if (process.env.NODE_ENV === "production") return <AllProjects />

  const { variant: requested } = await searchParams
  const variant = requested === "D" || requested === "E" || requested === "F" || requested === "current" ? requested : "B"

  return (
    <>
      {variant === "current" ? <AllProjects /> :
        variant === "D" ? <ProjectsEditorialPrototype projects={sortedProjects} /> :
        variant === "E" ? <ProjectsOverlayPrototype projects={sortedProjects} /> :
        variant === "F" ? <ProjectsSplitPrototype projects={sortedProjects} /> :
        <ProjectsFeaturedPrototype projects={sortedProjects} />}
      <LayoutPrototypeSwitcher current={variant} variants={prototypeDirections} pathname="/projects" />
    </>
  )
}

function AllProjects() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="container mx-auto max-w-7xl px-6 pt-20 pb-8 md:px-8 md:pt-28 md:pb-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <span className="label-editorial text-gold">Portfolio</span>
            <h1 className="font-display text-5xl leading-[0.95] md:text-6xl lg:text-7xl">
              Selected
              <br />
              <span className="text-gold italic">Works</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground md:pb-2">
            <NumberFlowComponent className="font-display text-2xl text-primary" value={projects.length} />
            <span className="label-editorial">Total Projects</span>
          </div>
        </div>
        <div className="mt-8 h-px w-full bg-border/30" />
      </section>
      {featuredProjects.length > 0 && (
        <ProjectGrid projects={featuredProjects} title="Featured" label="Highlighted Work" id="featured-projects-title" />
      )}
      <ProjectGrid projects={regularProjects} title="All Projects" label="Complete Archive" id="all-projects-title" />
    </main>
  )
}
