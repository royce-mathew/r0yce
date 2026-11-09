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

export default function BlogPage() {
  return <BlogIndex posts={blogPosts} />
}
