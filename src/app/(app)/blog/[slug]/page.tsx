import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogPosts, getBlogPost } from "@/lib/blog"
import { BlogArticle } from "../blog-article"

type BlogPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slugAsParams }))
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const post = getBlogPost((await params).slug)
  if (!post) notFound()

  return {
    title: `${post.title} | royce.sh`,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = getBlogPost((await params).slug)
  if (!post) notFound()

  return <BlogArticle post={post} />
}
