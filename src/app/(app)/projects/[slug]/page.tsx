import { format, parseISO } from "date-fns";
import { allProjects } from ".contentlayer/generated";
import { getTableOfContents } from "@/lib/toc";
import { Mdx } from "@/components/mdx-components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardTableOfContents } from "@/components/toc";

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
  const project = allProjects.find((project) => project.slugAsParams === slug);

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
  allProjects.map((project) => ({ slug: project.slugAsParams }));

/**
 * The layout component for the project page.
 * @param params - The layout component props.
 * @returns The rendered project page layout.
 * @throws Error if the project is not found.
 */
const ProjectLayout = async ({ params }: { params: { slug: string } }) => {
  const project = allProjects.find(
    (project) => project.slugAsParams === params.slug
  );
  // allProjects.map((project) =>
  //   console.log('"', project.slugAsParams, '"', params.slug)
  // );
  if (!project) throw new Error(`Project not found for slug: ${params.slug}`);

  const toc = await getTableOfContents(project.body.raw);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <article>
        <div className="mb-8 text-center">
          {/* <time dateTime={project.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(project.date), "LLLL d, yyyy")}
        </time> */}
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
        <div className="pb-12 pt-8">
          <Mdx code={project.body.code} />
        </div>
      </article>

      {project.toc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <DashboardTableOfContents toc={toc} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectLayout;
