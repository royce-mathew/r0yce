import Link from "next/link"
import type { DrawerPrototypeProps } from "./drawer-prototype-types"
import "./drawer-paper-prototype.css"


export function VariantB({ pages, groups, pathname, onNavigate }: DrawerPrototypeProps) {
  const projects = groups.flatMap(group => group.items)

  return (
    <div className="drawer-paper-prototype">
      <div className="paper-scroll" data-lenis-prevent>
        <header className="paper-header">
          <p className="paper-kicker">royce.sh <span>/ collection</span></p>
          <h2>Explore the work.</h2>
          <p className="paper-intro">An index of projects, experiments, and things in between.</p>
        </header>

        <div className="paper-directory">
          <nav className="paper-site" aria-label="Main navigation">
            <p className="paper-section-label">Elsewhere on the site</p>
            <div className="paper-site-links">
              {pages.map((page) => page.href ? (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={onNavigate}
                  aria-current={pathname === page.href ? "page" : undefined}
                >
                  {page.title}
                </Link>
              ) : null)}
            </div>
          </nav>

          <nav className="paper-projects" aria-label="Project directory">
            <div className="paper-project-heading">
              <p className="paper-section-label">Projects</p>
              <span className="paper-count">{String(projects.length).padStart(2, "0")} entries</span>
            </div>
            <ol>
              {projects.map((project, index) => (
                <li key={project.href}>
                  <Link
                    href={project.href!}
                    onClick={onNavigate}
                    aria-current={pathname === project.href ? "page" : undefined}
                  >
                    <span className="paper-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="paper-project-title">{project.title}</span>
                    <span className="paper-current" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <footer className="paper-footer">
          <span>© {new Date().getFullYear()} Royce</span>
          <span>Always a work in progress.</span>
        </footer>
      </div>
    </div>
  )
}
