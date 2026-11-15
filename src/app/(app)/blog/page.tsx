import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog"
import { BlogIndex } from "./blog-index"

export const metadata: Metadata = {
  title: "Blog | royce.sh",
  description: "Posts by Royce Mathew.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | royce.sh",
    description: "Posts by Royce Mathew.",
    url: "/blog",
    type: "website",
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; tag?: string | string[] }>
}) {
  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""
  const tag = typeof params.tag === "string" ? params.tag : ""

  return (
    <BlogIndex
      key={JSON.stringify([query, tag])}
      posts={blogPosts.map(post => ({
        title: post.title,
        description: post.description,
        date: post.date,
        author: post.author,
        tags: post.tags,
        slug: post.slug,
        metadata: post.metadata,
      }))}
    />
  )
}
