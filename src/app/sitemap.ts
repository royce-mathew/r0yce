import { MetadataRoute } from "next"
import { Project, projects } from "#site/content"

//   The sitemap can be wrapped in a Promise as well
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages = [
    {
      url: "https://royce.sh",
      lastModified: new Date("2025-04-12"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://royce.sh/projects",
      lastModified: new Date("2025-04-12"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://royce.sh/kanjou",
      lastModified: new Date("2025-04-12"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://royce.sh/market-state",
      lastModified: new Date("2026-08-30"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // other pages
  ]

  const sitemap = [
    ...defaultPages,
    ...projects.map((project: Project) => ({
      url: `https://royce.sh/${project.slug}`,
      lastModified: project.modifiedDate,
      changeFrequency: "daily",
      priority: 0.8,
    })),
  ]

  return sitemap as MetadataRoute.Sitemap
}
