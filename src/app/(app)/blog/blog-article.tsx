import Link from "next/link"
import type { BlogPost } from "#site/content"
import { cn } from "@/lib/utils"
import { BlogByline } from "./blog-byline"
import { BlogComments } from "./blog-comments"
import { BlogProse } from "./blog-prose"
import "./blog.css"

export function BlogArticle({ post }: { post: BlogPost }) {
  const hasContents = post.toc.length > 0

  return (
    <main className="blog-layout">
      <article>
        <div className="blog-topline">
          <Link className="link-underline" href="/blog">
            ← Back to blog
          </Link>
          <span className="label-editorial">A blog by {post.author}</span>
        </div>
        <header className="blog-article-heading">
          {post.tags.length > 0 && (
            <p className="label-editorial text-gold">{post.tags.join(" / ")}</p>
          )}
          <h1 className="font-display">{post.title}</h1>
          <p className="blog-deck">{post.description}</p>
          <BlogByline post={post} />
        </header>
        <div className={cn("blog-reading", hasContents && "blog-has-contents")}>
          {hasContents && (
            <nav className="blog-contents" aria-label="Blog contents">
              <p className="label-editorial">In this blog</p>
              <ol>
                {post.toc.map((item, index) => (
                  <li key={item.url}>
                    <a href={item.url}>
                      <span className="blog-contents-number" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="link-underline-target">
                        {item.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="min-w-0">
            <BlogProse code={post.code} />
            <div className="blog-end" aria-label="End of blog">
              ∎
            </div>
            <BlogComments key={post.slugAsParams} slug={post.slugAsParams} />
          </div>
        </div>
      </article>
    </main>
  )
}
