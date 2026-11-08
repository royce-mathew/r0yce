import { MetadataRoute } from "next"
import { projects } from "#site/content"
import { blogPosts } from "@/lib/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
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
      url: "https://royce.sh/blog",
      lastModified: blogPosts[0]?.date,
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
    {
      url: "https://royce.sh/misc/image-to-comic",
      lastModified: new Date("2026-11-03"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  const sitemap: MetadataRoute.Sitemap = [
    ...defaultPages,
    ...projects.map((project): MetadataRoute.Sitemap[number] => ({
      url: `https://royce.sh/${project.slug}`,
      lastModified: project.modifiedDate,
      changeFrequency: "daily",
      priority: 0.8,
    })),
    ...blogPosts.map((post): MetadataRoute.Sitemap[number] => ({
      url: `https://royce.sh/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ]

  return sitemap
}
