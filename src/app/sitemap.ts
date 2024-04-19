import { MetadataRoute } from "next"
import { Project, projects } from "#site/content"

//   The sitemap can be wrapped in a Promise as well
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages = [
    {
      url: "https://r0yce.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://r0yce.com/projects",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // {
    //   url: "https://r0yce.com/contact",
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.9,
    // },
    // other pages
  ]

  const sitemap = [
    ...defaultPages,
    ...projects.map((project: Project) => ({
      url: `https://r0yce.com/${project.slug}`,
      lastModified: project.modifiedDate,
      changeFrequency: "daily",
      priority: 0.8,
    })),
  ]

  return sitemap as MetadataRoute.Sitemap
}
