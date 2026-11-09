import "server-only"
import { posts } from "#site/content"

export const blogPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date))

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slugAsParams === slug)
}
