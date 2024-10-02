import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Project, projects } from "#site/content"
import { format, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"
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

// The grid contains 3 columns for each project. Important projects span 2 columns.
// The array should be organized in a way such that there is a 1:2 ratio of important to non-important projects.
// This is to ensure that the grid is balanced. There is a value called gridSpan in the project schema
function sortProjects(projects: Project[]): Project[] {
  const organizedProjects = [...projects] // Create a copy to work with

  // Shuffle for randomness
  for (let i = organizedProjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[organizedProjects[i], organizedProjects[j]] = [
      organizedProjects[j],
      organizedProjects[i],
    ]
  }

  // Rearranging logic
  let columnCursor = 0
  for (let i = 0; i < organizedProjects.length; i++) {
    if (organizedProjects[i].columnSpan === 3) {
      // Move wide items (columnSpan 3) to the beginning
      if (i !== 0) {
        organizedProjects.unshift(organizedProjects.splice(i, 1)[0]) // Remove from current position and Insert at the beginning
      }
      columnCursor = 3 // Skip to the end to avoid overlaps
    } else if (organizedProjects[i].columnSpan === 2) {
      if (columnCursor >= 2) {
        // Move to an available earlier slot
        organizedProjects.splice(
          columnCursor - 2,
          0,
          organizedProjects.splice(i, 1)[0]
        )
      }
      columnCursor = (columnCursor + 2) % 3 // Move to the next valid column
    } else {
      columnCursor = (columnCursor + 1) % 3
    }
  }

  return organizedProjects
}

const projectsSorted = sortProjects(projects)

/**
 * The layout component for the project page.
 * @param params - The layout component props.
 * @returns The rendered project page layout.
 * @throws Error if the project is not found.
 */
export default function AllProjects() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="font-cal mb-5 mt-16 w-full py-3 text-center text-5xl font-bold md:space-x-8 md:text-6xl">
        Projects
      </h1>
      <Separator className="container mb-5" />

      <div className="container flex w-fit flex-col items-center justify-center rounded bg-black/5 dark:bg-black/15">
        <h2 className="flex w-full items-center justify-center md:space-x-8 md:text-4xl">
          <Separator className="flex-1" />
          <div className="flex-initial py-2 text-2xl font-semibold">
            Featured Project
          </div>
          <Separator className="flex-1" />
        </h2>

        <div className="mb-5 max-w-[420px]">
          <ProjectButton
            project={projectsSorted.find((project) => project.featured)}
          />
        </div>
      </div>

      <h2 className="container mb-6 mt-16 flex w-full items-center justify-center md:space-x-8 md:text-4xl">
        <Separator className="flex-1" />
        <div className="flex-initial text-3xl font-bold">All Projects</div>
        <Separator className="flex-1" />
      </h2>

      <div className="relative flex w-full justify-center bg-black/10 pb-24 pt-16 dark:bg-black/15">
        <div className="container z-10 mx-auto grid max-w-7xl grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectsSorted.map((project: Project) => (
            <ProjectButton
              key={project.slug}
              project={project}
              className={cn(
                project.columnSpan == 1 && `md:col-span-1`,
                project.columnSpan == 2 && `md:col-span-2`,
                project.columnSpan == 3 && `md:col-span-3`
              )}
            />
          ))}
        </div>
        <BackgroundBeams className=" z-0" />
      </div>
    </main>
  )
}
