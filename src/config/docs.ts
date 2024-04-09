import { MainNavItem, SidebarNavItem } from "@/types/nav";
import { projects } from "#site/content";

interface SiteConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
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
};
