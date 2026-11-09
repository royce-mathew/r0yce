import Link from "next/link"
import type { BlogPost } from "#site/content"
import { BlogByline } from "./blog-byline"
import "./blog.css"

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  return (
    <main className="blog-layout" aria-labelledby="blog-title">
      <header className="blog-index-heading">
        <h1 id="blog-title">Blog</h1>
      </header>
      {posts.length > 0 ? (
        <ol className="blog-post-list">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <Link className="blog-post-entry" href={`/${post.slug}`}>
                <div className="blog-thumbnail" aria-hidden="true">
                  <span className="blog-thumbnail-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="label-editorial text-gold">
                    {String(index + 1).padStart(2, "0")}
                    {post.tags.length > 0 && ` / ${post.tags.join(" · ")}`}
                  </p>
                  <h2>
                    <span className="link-underline-target">{post.title}</span>
                  </h2>
                  <p className="blog-entry-description">{post.description}</p>
                  <BlogByline post={post} />
                  <span className="blog-read">
                    <span className="link-underline-target">Read the blog</span>
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-12 text-muted-foreground">No blogs published yet.</p>
      )}
    </main>
  )
}
