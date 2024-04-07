"use client";

import * as React from "react";

import { TocEntry } from "@/types/toc";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Separator } from "./ui/separator";
import { ArrowUpIcon, TextAlignLeftIcon } from "@radix-ui/react-icons";

interface TocProps {
  toc: TocEntry[];
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () =>
      toc
        ? toc
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split("#")[1])
            .filter((id) => id !== undefined) // Filter out undefined values
        : [],
    [toc]
  );
  const activeHeading = useActiveItem(itemIds);
  const mounted = useMounted();

  if (!toc || !mounted) {
    return null;
  }

  // Check if the active heading is the first item in the TOC
  const isOnPageTop = itemIds[0] === activeHeading || activeHeading === null;
  return (
    <div className="space-y-2">
      <div className="flex space-x-3 items-center">
        <TextAlignLeftIcon className="h-4 w-4 inline-block" />
        <p className="font-medium text-base">On this page</p>
      </div>
      <Tree tree={toc} activeItem={activeHeading} />
      <div className="pt-3 space-y-3">
        <Separator className="w-full" />
        <a
          href="#"
          className={cn(
            "text-sm flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-opacity",
            !isOnPageTop ? "opacity-100" : "opacity-0"
          )}
        >
          Back to top <ArrowUpIcon />
        </a>
      </div>
    </div>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TocEntry[];
  level?: number;
  activeItem?: string | null;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.length && level < 3 ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {tree.map((item, index) => {
        return (
          <li key={index} className={cn("mt-0 pt-2")}>
            <a
              href={item.url}
              className={cn(
                "inline-block no-underline transition-colors hover:text-foreground",
                item.url === `#${activeItem}`
                  ? " font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree
                tree={item.items}
                level={level + 1}
                activeItem={activeItem}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : null;
}
