"use client"

import Link from "next/link"
import type { DrawerPrototypeProps } from "./drawer-prototype-types"
import "./drawer-atlas-prototype.css"

export function VariantC({ pages, groups, pathname, onNavigate }: DrawerPrototypeProps) {
  const projects = groups.flatMap((group) => group.items)

  return (
    <div className="drawer-atlas-prototype" data-lenis-prevent>
      <div className="atlas-content">
        <header className="atlas-header">
          <span className="atlas-eyebrow">royce.sh / navigation</span>
          <h2>Where to?</h2>
          <p>A place to begin. A project to get lost in.</p>
        </header>

        <nav className="atlas-pages" aria-label="Main navigation">
          {pages.map((page, index) => page.href ? (
            <Link
              className="atlas-page"
              href={page.href}
              key={page.href}
              onClick={onNavigate}
              aria-current={pathname === page.href ? "page" : undefined}
            >
              <span className="atlas-page-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{page.href}</span>
              </span>
              <span className="atlas-page-title">{page.title}</span>
            </Link>
          ) : null)}
        </nav>

        <section className="atlas-catalog" aria-labelledby="atlas-project-heading">
          <div className="atlas-catalog-heading">
            <h3 id="atlas-project-heading">The project catalog</h3>
            <span>{String(projects.length).padStart(2, "0")} destinations</span>
          </div>
          <nav className="atlas-projects" aria-label="Project navigation">
            {projects.map((project, index) => project.href ? (
              <Link
                className="atlas-project"
                key={project.href}
                href={project.href}
                onClick={onNavigate}
                aria-current={pathname === project.href ? "page" : undefined}
              >
                <span className="atlas-project-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="atlas-project-title">{project.title}</span>
                <span className="atlas-project-arrow" aria-hidden="true">↗</span>
              </Link>
            ) : null)}
          </nav>
        </section>

        <footer className="atlas-footer">
          <span>© {new Date().getFullYear()} royce.sh</span>
          <span>Find something worth exploring.</span>
        </footer>
      </div>
    </div>
  )
}
