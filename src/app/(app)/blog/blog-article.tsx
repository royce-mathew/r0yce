import Link from "next/link"
import type { BlogPost } from "#site/content"
import { BlogByline } from "./blog-byline"
import { BlogProse } from "./blog-prose"
import { CreativeDirectionFigure } from "./creative-direction-figure"
import "./blog.css"

export function BlogArticle({ post }: { post: BlogPost }) {
  const hasContents = post.toc.length > 0

  return (
    <main className="blog-layout">
      <article>
        <div className="blog-topline">
          <Link className="link-underline" href="/blog">
            ← Back to writing
          </Link>
          <span className="label-editorial">An essay by {post.author}</span>
        </div>
        <header className="blog-article-heading">
          {post.tags.length > 0 && (
            <p className="label-editorial text-gold">{post.tags.join(" / ")}</p>
          )}
          <h1 className="font-display">{post.title}</h1>
          <p className="blog-deck">{post.description}</p>
          <BlogByline post={post} />
        </header>
        {post.figure === "creative-direction" && <CreativeDirectionFigure />}
        <div
          className={`blog-reading${hasContents ? "blog-has-contents" : ""}`}
        >
          {hasContents && (
            <nav className="blog-contents" aria-label="Essay contents">
              <p className="label-editorial">In this essay</p>
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
            <div className="blog-end" aria-label="End of essay">
              ∎
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
