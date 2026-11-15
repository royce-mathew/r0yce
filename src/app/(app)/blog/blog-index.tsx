"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { BlogPost } from "#site/content"
import { BlogByline } from "./blog-byline"
import "./blog-index.css"

type BlogSummary = Pick<BlogPost, "title" | "description" | "date" | "author" | "tags" | "slug" | "metadata">

export function BlogIndex({ posts }: { posts: BlogSummary[] }) {
  const params = useSearchParams()
  const query = params.get("q") ?? ""
  const tag = params.get("tag") ?? ""
  const tags = [...new Set(posts.flatMap(post => post.tags))]
  const normalizedQuery = query.trim().toLowerCase()
  const visible = posts.filter(post =>
    (!tag || post.tags.includes(tag)) &&
    `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(normalizedQuery)
  )
  const years = new Map<string, BlogSummary[]>()
  for (const post of visible) {
    const year = post.date.slice(0, 4)
    const entries = years.get(year)
    if (entries) entries.push(post)
    else years.set(year, [post])
  }

  function updateFilters(updates: Record<string, string>) {
    const url = new URL(window.location.href)
    for (const [key, value] of Object.entries(updates)) {
      if (value) url.searchParams.set(key, value)
      else url.searchParams.delete(key)
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return (
    <main className="blog-index" aria-labelledby="blog-title">
      <div className="blog-index-inner">
        <header className="blog-index-heading">
          <p className="blog-index-eyebrow">Royce Mathew / Writing</p>
          <h1 id="blog-title">Blog<span>.</span></h1>
          <div className="blog-index-intro">
            <p>Notes on software, <br />AI, and building things <br />with a little more thought.</p>
            <span className="blog-index-eyebrow">{posts.length} {posts.length === 1 ? "blog" : "blogs"} & counting</span>
          </div>
        </header>
        <div className="blog-index-toolbar">
          <div className="blog-index-topics" role="group" aria-label="Filter blogs by topic">
            <button type="button" aria-pressed={!tag} onClick={() => updateFilters({ tag: "" })}>All blogs</button>
            {tags.map(topic => (
              <button key={topic} type="button" aria-pressed={tag === topic} onClick={() => updateFilters({ tag: topic })}>{topic}</button>
            ))}
          </div>
          <label className="blog-index-search">
            <span>Search blogs</span>
            <input
              type="search"
              defaultValue={query}
              ref={input => {
                if (!input) return
                const currentQuery = new URLSearchParams(window.location.search).get("q") ?? ""
                // URL updates can finish after newer keystrokes; only apply the current URL.
                if (query === currentQuery && input.value !== query) input.value = query
              }}
              placeholder="Find a thought…"
              onChange={event => updateFilters({ q: event.target.value })}
            />
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
          </label>
        </div>
        <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? "blog" : "blogs"} found</p>
        <div className="blog-index-content">
          {visible.length > 0 ? (
            [...years].map(([year, entries]) => (
              <section key={year} aria-labelledby={`blog-year-${year}`}>
                <h2 className="blog-index-year" id={`blog-year-${year}`}>{year}</h2>
                <ol>
                  {entries.map(post => (
                    <li key={post.slug}>
                      <article className="blog-index-entry">
                        <BlogByline post={post} />
                        <h3><Link href={`/${post.slug}`}>{post.title}<span aria-hidden="true"> ↗</span></Link></h3>
                        <p className="blog-index-description">{post.description}</p>
                        {post.tags.length > 0 && <p className="blog-index-tags">{post.tags.join(" / ")}</p>}
                      </article>
                    </li>
                  ))}
                </ol>
              </section>
            ))
          ) : (
            <div className="blog-index-empty">
              <h2>{posts.length === 0 ? "No blogs published yet." : "No blogs found."}</h2>
              <p>{posts.length === 0 ? "Check back for notes on software and AI." : "Try another search or clear the filters."}</p>
              {posts.length > 0 && <button type="button" onClick={() => updateFilters({ q: "", tag: "" })}>Clear filters ↗</button>}
            </div>
          )}
        </div>
        <footer className="blog-index-footer">
          <Link href="/projects">See what I’m building <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </main>
  )
}
