import type { NavItem, SidebarNavItem } from "@/types/nav"

export type CommandPrototypeProps = {
  pages: readonly NavItem[]
  groups: readonly SidebarNavItem[]
  query: string
  onQueryChange: (query: string) => void
  onSelect: (href: string) => void
}
