import { MainNavItem, SidebarNavItem } from "@/types/nav";
import { allProjects } from "contentlayer/generated";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Portfolio",
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
      items: allProjects.map((project) => ({
        title: project.title,
        href: project.slug,
        label: project.label,
        items: [],
      })),
    },
  ],
};
