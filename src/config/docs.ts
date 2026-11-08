import { projects } from "#site/content"
import { blogPosts } from "@/lib/blog"
import type { MainNavItem, SidebarNavItem } from "@/types/nav"

interface SiteConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const siteConfig: SiteConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Writing",
      href: "/blog",
    },
    {
      title: "Kanjou",
      href: "/kanjou",
    },
  ],
  sidebarNav: [
    {
      title: "Projects",
      href: "/projects",
      items: [...projects]
        .sort(
          (a, b) => Date.parse(a.modifiedDate) - Date.parse(b.modifiedDate)
        )
        .reverse()
        .map((project) => ({
          title: project.title,
          href: `/${project.slug}`,
          label: project.label,
          modifiedDate: project.modifiedDate,
          items: [],
        })),
    },
    {
      title: "Writing",
      href: "/blog",
      items: blogPosts.map((post) => ({
        title: post.title,
        href: `/${post.slug}`,
        modifiedDate: post.date,
        items: [],
      })),
    },
  ],
}
