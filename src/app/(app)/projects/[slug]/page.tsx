import { projects } from "#site/content";
import { Mdx } from "@/components/mdx-components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardTableOfContents } from "@/components/toc";
import { format, parseISO } from "date-fns";
import { Separator } from "@radix-ui/react-separator";

/**
 * Props for the ProjectPage component.
 */
interface ProjectPageProps {
  params: {
    slug: string;
  };
}

/**
 * Retrieves the project based on the provided params.
 * @param params - The project page props.
 * @returns The project matching the slug, or null if not found.
 */
async function getProjectFromParams({ params }: ProjectPageProps) {
  const slug = params.slug || "";
  const project = projects.find((project) => project.slugAsParams === slug);

  if (!project) {
    return null;
  }

  return project;
}

/**
 * Generates metadata for the project page.
 * @param params - The project page props.
 * @returns The generated metadata.
 * @throws Error if the project is not found.
 */
export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await getProjectFromParams({ params });
  if (!project) return {};
  return { title: project.title };
}

/**
 * Generates static params for the project page.
 * @returns The generated static params.
 */
export const generateStaticParams = async () =>
  projects.map((project) => ({ slug: project.slugAsParams }));

/**
 * The layout component for the project page.
 * @param params - The layout component props.
 * @returns The rendered project page layout.
 * @throws Error if the project is not found.
 */
const ProjectLayout = async ({ params }: { params: { slug: string } }) => {
  const project = projects.find(
    (project) => project.slugAsParams === params.slug
  );

  if (!project) throw new Error(`Project not found for slug: ${params.slug}`);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_220px]">
      <div className="mx-auto w-full min-w-0">
        <article>
          <div className="mb-2 text-center w-full">
            <h1 className="xl:text-5xl lg:text-4xl text-3xl font-bold">
              {project.title}
            </h1>
            <div className="flex flex-col space-y-6 border-b border-border py-5">
              <p className="text-sm sm:text-lg">{project.description}</p>

              <div className="flex flex-row justify-between">
                <text className="text-sm">
                  Word Count:{" "}
                  <span className="text-primary">
                    {project.metadata.wordCount}
                  </span>
                </text>
                <text className="text-sm flex flex-col md:flex-row md:gap-2">
                  Last Updated:
                  <time dateTime={project.date} className="text-primary">
                    {format(parseISO(project.date), "LLLL d, yyyy")}
                  </time>
                </text>
                <text className="text-sm">
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
  );
};

export default ProjectLayout;
