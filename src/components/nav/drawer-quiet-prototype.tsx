import Link from "next/link"
import type { DrawerPrototypeProps } from "./drawer-prototype-types"
import "./drawer-quiet-prototype.css"

export function VariantA({ pages, groups, pathname, onNavigate }: DrawerPrototypeProps) {
  return (
    <div className="drawer-quiet-prototype">
      <header><span className="quiet-brand">royce<span>.sh</span></span><p>Around here.</p></header>
      <div className="quiet-drawer-scroll" data-drawer-scroll data-lenis-prevent>
        <nav aria-label="Site navigation" className="quiet-site-links">
          {pages.map((item, index) => item.href && (
            <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={pathname === item.href ? "page" : undefined}>
              <span className="quiet-number">0{index + 1}</span><span>{item.title}</span><span className="quiet-link-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        {groups.map(group => (
          <nav key={group.title} aria-label={`${group.title} collection`} className="quiet-project-links">
            <h2>{group.title}<span>{String(group.items.length).padStart(2, "0")}</span></h2>
            {group.items.map(item => item.href && (
              <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={pathname === item.href ? "page" : undefined}>
                <span>{item.title}</span><span className="quiet-link-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        ))}
        <footer>© {new Date().getFullYear()} Royce Mathew</footer>
      </div>
    </div>
  )
}
