"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { BlogPost } from "#site/content"
import { PrototypeSwitcher } from "@/components/custom/prototype-switcher"
import { CreationHands } from "../creation-hands"
import "./blog-homepage-prototype.css"

const directions = [
  { key: "editorial", name: "Editorial" },
  { key: "notebook", name: "Notebook" },
  { key: "dispatch", name: "Dispatch" },
] as const

type Post = Pick<BlogPost, "title" | "description" | "date" | "author" | "tags" | "slug"> & {
  readingTime: number
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
})

function PostMeta({ post }: { post: Post }) {
  return (
    <p className="bp-meta">
      <span>{post.author}</span>
      <span aria-hidden="true">/</span>
      <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
      <span aria-hidden="true">/</span>
      <span>{Math.ceil(post.readingTime)} min read</span>
    </p>
  )
}

function CodeStudy() {
  return (
    <div className="bp-code-study" aria-hidden="true">
      <span className="bp-art-note">Look a little closer.</span>
      <div className="bp-code-sheet">
        <span className="bp-code-caption">a working system</span>
        <span className="bp-code-brace">&#123;</span>
        <i /><i /><i /><i />
        <span className="bp-code-brace bp-code-close">&#125;</span>
      </div>
      <span className="bp-question">?</span>
      <svg viewBox="0 0 180 100" fill="none" className="bp-art-arrow">
        <path d="M8 12C94-9 153 13 122 52S53 73 62 45s83-11 101 38m-19-9 20 11 1-23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function Editorial({ posts }: { posts: Post[] }) {
  return (
    <div className="bp-editorial-list">
      {posts.map((post, index) => (
        <article key={post.slug} className="bp-editorial-entry">
          <div className="bp-editorial-copy">
            <p className="bp-eyebrow">{index === 0 ? "Latest essay" : "From the archive"}<span>{post.tags.join(" / ")}</span></p>
            <h2><Link href={`/${post.slug}`}>{post.title}</Link></h2>
            <p className="bp-description">{post.description}</p>
            <PostMeta post={post} />
            <Link className="bp-read" href={`/${post.slug}`}>Read the essay <span aria-hidden="true">↗</span></Link>
          </div>
          {index === 0 && <CodeStudy />}
        </article>
      ))}
    </div>
  )
}

export function Notebook({ posts }: { posts: Post[] }) {
  const years = [...new Set(posts.map(post => post.date.slice(0, 4)))]
  return (
    <div className="bp-notebook-years">
      {years.map(year => (
        <section key={year} aria-labelledby={`bp-year-${year}`}>
          <h2 className="bp-year" id={`bp-year-${year}`}>{year}</h2>
          <ol>
            {posts.filter(post => post.date.startsWith(year)).map(post => (
              <li key={post.slug}>
                <article className="bp-notebook-entry">
                  <PostMeta post={post} />
                  <h3><Link href={`/${post.slug}`}>{post.title}<span aria-hidden="true"> ↗</span></Link></h3>
                  <p className="bp-description">{post.description}</p>
                  <p className="bp-notebook-tags">{post.tags.join(" / ")}</p>
                </article>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

export function Dispatch({ posts }: { posts: Post[] }) {
  const [latest, ...archive] = posts
  return (
    <div>
      <article className="bp-dispatch-cover">
        <div className="bp-dispatch-copy">
          <p className="bp-eyebrow">Latest dispatch<span>{latest.tags.join(" / ")}</span></p>
          <h2><Link href={`/${latest.slug}`}>{latest.title}</Link></h2>
          <p className="bp-description">{latest.description}</p>
          <div className="bp-dispatch-bottom">
            <PostMeta post={latest} />
            <Link className="bp-read" href={`/${latest.slug}`}>Read the essay <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="bp-dispatch-art" aria-hidden="true">
          <span className="bp-dispatch-art-label">Creation / comprehension</span>
          <div className="bp-hands"><CreationHands /></div>
          <span className="bp-dispatch-art-word">Mind<br />the gap.</span>
          <span className="bp-dispatch-art-caption">Between making it work<br />and knowing why it works.</span>
        </div>
      </article>
      {archive.length > 0 && (
        <section className="bp-dispatch-archive" aria-labelledby="bp-archive-title">
          <h2 id="bp-archive-title" className="bp-eyebrow">Previously</h2>
          {archive.map(post => (
            <article key={post.slug}>
              <PostMeta post={post} />
              <h3><Link href={`/${post.slug}`}>{post.title} <span aria-hidden="true">↗</span></Link></h3>
              <p className="bp-description">{post.description}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

export function BlogHomepagePrototype({ posts }: { posts: Post[] }) {
  const params = useSearchParams()
  const variant = directions.find(direction => direction.key === params.get("variant"))?.key ?? "editorial"
  const [query, setQuery] = useState(() => params.get("q") ?? "")
  const tag = params.get("tag") ?? ""
  const tags = [...new Set(posts.flatMap(post => post.tags))]
  const visible = posts.filter(post =>
    (!tag || post.tags.includes(tag)) &&
    `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  useEffect(() => {
    function restoreQuery() {
      setQuery(new URL(window.location.href).searchParams.get("q") ?? "")
    }
    window.addEventListener("popstate", restoreQuery)
    return () => window.removeEventListener("popstate", restoreQuery)
  }, [])

  function updateFilters(updates: Record<string, string>) {
    if ("q" in updates) setQuery(updates.q)
    const url = new URL(window.location.href)
    for (const [key, value] of Object.entries(updates)) {
      if (value) url.searchParams.set(key, value)
      else url.searchParams.delete(key)
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return (
    <>
      <main className={`blog-homepage-prototype bp-${variant}`} aria-labelledby="bp-title">
        <div className="bp-inner">
          <header className="bp-masthead">
            <div>
              <p className="bp-eyebrow">Royce Mathew / Writing</p>
              <h1 id="bp-title">Blog<span>.</span></h1>
            </div>
            <div className="bp-intro">
              <p>Notes on software, <br />AI, and building things <br />with a little more thought.</p>
              <span className="bp-eyebrow">{posts.length} {posts.length === 1 ? "essay" : "essays"} & counting</span>
            </div>
          </header>
          <div className="bp-toolbar">
            <div className="bp-topics" role="group" aria-label="Filter essays by topic">
              <button type="button" aria-pressed={!tag} onClick={() => updateFilters({ tag: "" })}>All writing</button>
              {tags.map(topic => (
                <button key={topic} type="button" aria-pressed={tag === topic} onClick={() => updateFilters({ tag: topic })}>{topic}</button>
              ))}
            </div>
            <label className="bp-search">
              <span>Search essays</span>
              <input type="search" value={query} placeholder="Find a thought…" onChange={event => updateFilters({ q: event.target.value })} />
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
            </label>
          </div>
          <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? "essay" : "essays"} found</p>
          <div className="bp-view" key={variant}>
            {visible.length === 0 ? (
              <div className="bp-empty">
                <h2>{posts.length === 0 ? "Nothing published just yet." : "No essays found."}</h2>
                <p>{posts.length === 0 ? "Check back for notes on software and AI." : "Try another search or clear the filters."}</p>
                {posts.length > 0 && <button type="button" onClick={() => updateFilters({ q: "", tag: "" })}>Clear filters ↗</button>}
              </div>
            ) : variant === "notebook" ? <Notebook posts={visible} /> : variant === "dispatch" ? <Dispatch posts={visible} /> : <Editorial posts={visible} />}
          </div>
          <footer className="bp-colophon">
            <span>Written by Royce Mathew.</span>
            <Link href="/projects">See what I’m building <span aria-hidden="true">↗</span></Link>
          </footer>
        </div>
      </main>
      <PrototypeSwitcher directions={directions} activeKey={variant} />
    </>
  )
}
