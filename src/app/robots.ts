import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/auth"],
    },
    sitemap: ["https://r0yce.com/sitemap.xml"],
  }
}
