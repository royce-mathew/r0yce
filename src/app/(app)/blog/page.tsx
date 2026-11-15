import { Suspense } from "react"
import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog"
import { BlogIndex } from "./blog-index"
import { BlogHomepagePrototype } from "./blog-homepage-prototype"

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

export default function BlogPage() {
  if (process.env.NODE_ENV !== "production") {
    return (
      <Suspense fallback={<BlogIndex posts={blogPosts} />}>
        <BlogHomepagePrototype posts={blogPosts.map(post => ({
          title: post.title,
          description: post.description,
          date: post.date,
          author: post.author,
          tags: post.tags,
          slug: post.slug,
          readingTime: post.metadata.readingTime,
        }))} />
      </Suspense>
    )
  }
  return <BlogIndex posts={blogPosts} />
}
