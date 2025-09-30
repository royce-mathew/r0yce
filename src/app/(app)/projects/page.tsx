import { Metadata } from "next"
import { Project, projects } from "#site/content"
import { cn } from "@/lib/utils"
import { NumberFlowComponent } from "@/components/ui/number"
import { Separator } from "@/components/ui/separator"
import ProjectButton from "@/components/custom/project-button"

export const metadata: Metadata = {
  title: "Projects | r0yce",
  description: "r0yce.com - List of all projects",
  keywords: [...projects.map((project) => project.title)],
  openGraph: {
    url: "https://r0yce.com/projects",
    type: "website",
    title: "Projects | r0yce",
    description: "r0yce.com - List of all projects",
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
    title: "Projects | r0yce",
    description: "r0yce.com - List of all projects",
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

// Optimize: Pre-compute and memoize sorted projects
function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) =>
      new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()
  )
}

// Pre-compute at build time instead of runtime
const sortedProjects = sortProjects(projects)
const featuredProjects = sortedProjects.filter((project) => project.featured)
const regularProjects = sortedProjects.filter((project) => !project.featured)

// Reusable component for project grid
function ProjectGrid({
  projects,
  title,
}: {
  projects: Project[]
  title: string
}) {
  return (
    <>
      <h2 className="z-10 container mt-16 flex w-full items-center justify-center md:space-x-5 md:text-4xl">
        <Separator className="flex-1" />
        <div className="-my-40 flex-initial px-4 py-1 text-3xl font-bold">
          {title}
        </div>
        <Separator className="flex-1" />
      </h2>

      <div className="relative flex w-full justify-center bg-black/[2%] pt-16 pb-24 dark:bg-black/5">
        <div className="isolate z-10 container mx-auto grid max-w-7xl grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectButton
              key={project.slug}
              project={project}
              className={cn(
                "transform transition-transform hover:z-10",
                project.columnSpan === 1 && "md:col-span-1",
                project.columnSpan === 2 && "md:col-span-2",
                project.columnSpan === 3 && "md:col-span-3"
              )}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default function AllProjects() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container mt-16 flex w-full items-center justify-between py-3">
        <h1 className="font-cal text-5xl font-bold md:space-x-8 md:text-6xl">
          Projects
        </h1>
        <div className="flex items-center space-x-2 text-lg md:text-xl">
          <NumberFlowComponent
            className="font-bold text-primary"
            value={projects.length}
          />
          <span>Total Projects</span>
        </div>
      </div>

      <ProjectGrid projects={featuredProjects} title="Featured Projects" />
      <ProjectGrid projects={regularProjects} title="All Projects" />
    </main>
  )
}
