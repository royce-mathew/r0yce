import type { Metadata } from "next"
import { connection } from "next/server"
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

export default async function BlogPage() {
  await connection()

  return (
    <BlogIndex
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
