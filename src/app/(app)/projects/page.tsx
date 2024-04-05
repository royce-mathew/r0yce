import { format, parseISO } from "date-fns";
import { allProjects, Project } from ".contentlayer/generated";
import { getTableOfContents } from "@/lib/toc";
import { Mdx } from "@/components/mdx-components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardTableOfContents } from "@/components/toc";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * The layout component for the project page.
 * @param params - The layout component props.
 * @returns The rendered project page layout.
 * @throws Error if the project is not found.
 */
const AllProjects = async () => {
  // The grid contains 3 columns for each project. Important projects span 2 columns.
  // The array should be organized in a way such that there is a 1:2 ratio of important to non-important projects.
  // This is to ensure that the grid is balanced.
  function organizeProjects(projects: Project[]): Project[] {
    const importantProjects = projects.filter((project) => project.important);
    const nonImportantProjects = projects.filter(
      (project) => !project.important
    );

    const organizedProjects: Project[] = [];

    while (importantProjects.length || nonImportantProjects.length) {
      if (importantProjects.length) {
        organizedProjects.push(importantProjects.shift() as Project);
      }

      if (nonImportantProjects.length) {
        organizedProjects.push(nonImportantProjects.shift() as Project);
      }

      if (nonImportantProjects.length) {
        organizedProjects.push(nonImportantProjects.shift() as Project);
      }
    }

    return organizedProjects;
  }
  // Organize projects for a balanced grid layout
  const projectsSorted = organizeProjects(allProjects);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="font-cal text-2xl md:text-5xl font-bold text-center md:space-x-8 mt-20 mb-12">
        Projects
      </h1>
      <div className="flex relative w-full py-12 justify-center dark:bg-black/15 bg-black/10">
        <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto z-10">
          {projectsSorted.map((project) => (
            <Button
              key={project.slug}
              asChild
              className={cn(
                "row-span-1 justify-between flex flex-col space-y-4 border border-border rounded p-1 bg-background",
                project.important && "md:col-span-2"
              )}
              variant={null}
            >
              <Link
                href={project.slug}
                className="hover:outline hover:outline-blue-500 h-full"
              >
                {project.imageSrc && (
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
                        {project.title}
                      </h1>
                      <p className="text-muted-foreground text-wrap">
                        {project.description}
                      </p>

                      <Separator />
                      <small className="text-sm text-right">
                        {project.date &&
                          format(parseISO(project.date), "MMMM dd, yyyy")}
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
