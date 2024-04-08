import { format, parseISO } from "date-fns";
import { projects, Project } from "#site/content";
import Image from "next/image";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

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
};

/**
 * The layout component for the project page.
 * @param params - The layout component props.
 * @returns The rendered project page layout.
 * @throws Error if the project is not found.
 */
const AllProjects = async () => {
  // The grid contains 3 columns for each project. Important projects span 2 columns.
  // The array should be organized in a way such that there is a 1:2 ratio of important to non-important projects.
  // This is to ensure that the grid is balanced. There is a value called gridSpan in the project schema
  function sortProjects(projects: Project[]): Project[] {
    const organizedProjects = [...projects]; // Create a copy to work with

    // Shuffle for randomness
    for (let i = organizedProjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [organizedProjects[i], organizedProjects[j]] = [
        organizedProjects[j],
        organizedProjects[i],
      ];
    }

    // Rearranging logic
    let columnCursor = 0;
    for (let i = 0; i < organizedProjects.length; i++) {
      if (organizedProjects[i].columnSpan === 3) {
        // Move wide items (columnSpan 3) to the beginning
        if (i !== 0) {
          organizedProjects.unshift(organizedProjects.splice(i, 1)[0]); // Remove from current position and Insert at the beginning
        }
        columnCursor = 3; // Skip to the end to avoid overlaps
      } else if (organizedProjects[i].columnSpan === 2) {
        if (columnCursor >= 2) {
          // Move to an available earlier slot
          organizedProjects.splice(
            columnCursor - 2,
            0,
            organizedProjects.splice(i, 1)[0]
          );
        }
        columnCursor = (columnCursor + 2) % 3; // Move to the next valid column
      } else {
        columnCursor = (columnCursor + 1) % 3;
      }
    }

    return organizedProjects;
  }
  // Organize projects for a balanced grid layout
  const projectsSorted = sortProjects(projects);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="font-cal text-5xl md:text-6xl font-bold text-center md:space-x-8 mt-16 mb-6">
        Projects
      </h1>
      <div className="flex relative w-full pt-16 pb-24 justify-center dark:bg-black/15 bg-black/10">
        <div className="container grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto z-10">
          {projectsSorted.map((project: Project) => (
            <Button
              key={project?.slug}
              asChild
              // Weird bug with classNames not being applied when doing md:col-span-${project.columnSpan}
              className={cn(
                "row-span-1 justify-between flex flex-col space-y-4 border border-border rounded p-1 bg-background hover:brightness-70 hover:scale-[102%] duration-200 hover:shadow-xl transition-all",
                project.columnSpan == 1 && `md:col-span-1`,
                project.columnSpan == 2 && `md:col-span-2`,
                project.columnSpan == 3 && `md:col-span-3`
              )}
              variant={null}
            >
              <Link href={project?.slug ?? "/"} className="h-full w-full">
                {project?.imageSrc && (
                  <div className="flex flex-col justify-between h-full w-full">
                    <div className="relative p-1">
                      <Image
                        src={project.imageSrc}
                        alt="Profile Picture"
                        className="h-full w-full max-h-64 object-cover rounded"
                        width={1000}
                        height={1000}
                      />
                      <div className="absolute inset-0 halftone" />
                      <div className="absolute inset-0  bg-gradient-to-t from-background from-5% to-25% to-transparent bg-size-150% bg-pos-10%" />
                    </div>

                    <div className="flex flex-col px-1 pt-4 pb-2 space-y-2 text-wrap">
                      <h1 className="text-xl md:text-2xl font-semibold text-balance">
                        {project?.title}
                      </h1>
                      <p className="text-muted-foreground text-wrap">
                        {project?.description}
                      </p>

                      <Separator />
                      <small className="text-sm text-right">
                        {project?.publishedDate &&
                          format(parseISO(project.publishedDate), "MMMM dd, yyyy")}
                      </small>
                    </div>
                  </div>
                )}
              </Link>
            </Button>
          ))}
        </div>
        <BackgroundBeams className=" z-0" />
      </div>
    </main>
  );
};

export default AllProjects;
