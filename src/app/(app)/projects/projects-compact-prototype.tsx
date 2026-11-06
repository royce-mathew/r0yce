"use client"

import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import type { Project } from "#site/content"
import ProjectButton from "@/components/custom/project-button"
import "./projects-compact-prototype.css"

export function ProjectsCompactPrototype({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sort, setSort] = useState("recent")
  const search = query.trim().toLowerCase()
  const featuredCount = projects.reduce((count, project) => count + Number(project.featured), 0)
  const visible = projects.filter((project) =>
    (!featuredOnly || project.featured) &&
    (!search || project.title.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search) ||
      project.tags.some((tag) => tag.toLowerCase().includes(search)))
  )
  if (sort === "title") visible.sort((a, b) => a.title.localeCompare(b.title))

  function clearFilters() {
    setQuery("")
    setFeaturedOnly(false)
  }

  return (
    <main className="projects-index-prototype projects-compact-prototype" data-projects-variant="A">
      <header className="projects-compact-heading">
        <h1>Projects</h1>
        <p className="projects-prototype-summary">Software, AI, and games.<br />Explore the work and how it was built.</p>
      </header>
      <div className="projects-compact-toolbar" aria-label="Project browsing controls">
        <div className="projects-compact-filters" aria-label="Project selection">
          <button type="button" aria-pressed={!featuredOnly} onClick={() => setFeaturedOnly(false)}>All projects</button>
          <button type="button" aria-pressed={featuredOnly} onClick={() => setFeaturedOnly(true)}>Featured <span>{featuredCount}</span></button>
        </div>
        <label className="projects-compact-search">
          <IconSearch size={17} aria-hidden="true" />
          <span className="sr-only">Search projects or technologies</span>
          <input type="search" placeholder="Search projects or technologies" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className="projects-compact-sort">
          <span className="sr-only">Sort projects</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recent">Recently updated</option>
            <option value="title">Name: A–Z</option>
          </select>
        </label>
      </div>
      <p className="projects-compact-count" role="status" aria-live="polite">{visible.length} {visible.length === 1 ? "project" : "projects"}{featuredOnly ? " · Featured" : ""}{search ? ` matching “${query.trim()}”` : ""}</p>
      {visible.length > 0 ? (
        <ul className="projects-compact-grid" aria-label="Projects">
          {visible.map((project, index) => (
            <li key={project.slug}><ProjectButton project={project} index={index} className="h-full" /></li>
          ))}
        </ul>
      ) : (
        <div className="projects-compact-empty">
          <h2>No matching projects</h2>
          <p>Try another project name or technology.</p>
          <button type="button" onClick={clearFilters}>Clear filters</button>
        </div>
      )}
    </main>
  )
}
