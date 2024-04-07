import { MainNavItem, SidebarNavItem } from "@/types/nav";
import { projects } from "#site/content";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
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
