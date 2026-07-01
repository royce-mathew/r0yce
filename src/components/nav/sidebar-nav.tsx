"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "@/types/nav"
import { cn } from "@/lib/utils"

export interface ProjectSidebarNavProps {
  items: SidebarNavItem[]
}

export function ProjectSidebarNav({ items }: ProjectSidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-4")}>
          {item?.items?.length && (
            <ProjectSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null
}

interface ProjectSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function ProjectSidebarNavItems({
  items,
  pathname,
}: ProjectSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex w-full items-center rounded-sm px-2.5 py-1.5 transition-colors duration-200",
              item.disabled && "cursor-not-allowed opacity-60",
              pathname === item.href
                ? "bg-primary/5 text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {pathname === item.href && (
              <span className="mr-2 h-3 w-px bg-primary/60" />
            )}
            <span className="truncate text-[0.8125rem]">{item.title}</span>
            {item.label && (
              <span
                className={cn(
                  "ml-auto text-[0.6rem] font-medium tracking-[0.08em] uppercase text-muted-foreground/60",
                  item.label.className
                )}
              >
                {item.label.text}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              "flex w-full cursor-not-allowed items-center rounded-sm px-2.5 py-1.5 text-muted-foreground/50",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <span className="truncate text-[0.8125rem]">{item.title}</span>
            {item.label && (
              <span className="ml-auto text-[0.6rem] font-medium tracking-[0.08em] uppercase text-muted-foreground/40">
                {item.label.text}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}
