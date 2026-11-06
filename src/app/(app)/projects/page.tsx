import { Metadata } from "next"
import { projects } from "#site/content"
import { NumberFlowComponent } from "@/components/ui/number"
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

export default function AllProjects() {
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
      <section className="w-full py-16 md:py-24" aria-labelledby="all-projects-title">
        <div className="container mx-auto mb-12 flex max-w-7xl items-end justify-between px-6 md:px-8">
          <div className="space-y-2">
            <span className="label-editorial text-gold">Complete Archive</span>
            <h2 id="all-projects-title" className="font-display text-3xl md:text-4xl">All Projects</h2>
          </div>
          <div className="mb-2 ml-8 hidden h-px max-w-32 flex-1 bg-border/30 md:block" />
        </div>
        <div className="container mx-auto grid max-w-7xl auto-rows-fr grid-cols-1 gap-5 px-6 md:grid-cols-2 md:px-8 lg:grid-cols-3">
          {sortedProjects.map((project, index) => (
            <ProjectButton key={project.slug} project={project} index={index} className="h-full" />
          ))}
        </div>
      </section>
    </main>
  )
}
