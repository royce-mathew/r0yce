import type { Metadata } from "next"
import { blogPrototypePosts } from "#site/content"
import { BlogPrototype } from "./blog-prototype"
import { PrototypeSwitcher } from "@/components/prototype/prototype-switcher"

export const metadata: Metadata = {
  title: "Blog design prototype — royce.sh",
  description: "Three visual directions for Royce’s Markdown-backed writing.",
  robots: { index: false, follow: false },
}

export default async function BlogPrototypePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const variant = query.variant === "fieldnotes" || query.variant === "visual" ? query.variant : "editorial"
  const view = query.view === "index" ? "index" : "article"

  return (
    <>
      <BlogPrototype post={blogPrototypePosts[0]} variant={variant} view={view} />
      {process.env.NODE_ENV !== "production" && <PrototypeSwitcher variant={variant} view={view} />}
    </>
  )
}
