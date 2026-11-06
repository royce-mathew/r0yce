import type { MainNavItem, SidebarNavItem } from "@/types/nav"

export type DrawerPrototypeProps = {
  pages: readonly MainNavItem[]
  groups: readonly SidebarNavItem[]
  pathname: string
  onNavigate: () => void
}
