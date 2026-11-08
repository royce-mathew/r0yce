import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog"
import { BlogIndex } from "./blog-index"

export const metadata: Metadata = {
  title: "Writing — royce.sh",
  description:
    "Essays by Royce Mathew on technology, creativity, and human judgment.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Writing — royce.sh",
    description:
      "Essays by Royce Mathew on technology, creativity, and human judgment.",
    url: "/blog",
    type: "website",
  },
}

export default function BlogPage() {
  return <BlogIndex posts={blogPosts} />
}
