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
          <h3 className="text-md mb-1 rounded-md px-2 py-1 text-lg font-semibold">
            {item.href ? (
              <Link href={item.href}>{item.title}</Link>
            ) : (
              item.title
            )}
          </h3>
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
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex w-full items-center px-2 py-1",
              item.disabled && "cursor-not-allowed opacity-60",
              pathname === item.href
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span className=" group-hover:underline">{item.title}</span>
            {item.label && (
              <span
                className={cn(
                  "bg-primary text-background ml-2 rounded-md px-1.5 py-0.5 text-xs leading-none",
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
              "text-muted-foreground flex w-full cursor-not-allowed items-center rounded-md p-2 hover:underline",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            {item.title}
            {item.label && (
              <span className="bg-muted text-muted-foreground ml-2 rounded-md px-1.5 py-0.5 text-xs leading-none no-underline group-hover:no-underline">
                {item.label.text}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}
