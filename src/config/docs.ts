import { projects } from "#site/content"

import { MainNavItem, SidebarNavItem } from "@/types/nav"

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
      title: "Kanjou",
      href: "/kanjou",
    },
    {
      title: "Projects",
      href: "/projects",
    },
  ],
  sidebarNav: [
    {
      title: "Projects",
      href: "/projects",
      items: projects.map((project) => ({
        title: project.title,
        href: `/${project.slug}`,
        label: project.label,
        items: [],
      })),
    },
  ],
}
