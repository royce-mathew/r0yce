"use client";

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Icons } from "./icons";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const mounted = useMounted();
  const { setTheme, theme } = useTheme();

  if (!mounted) {
    return null;
  }

  function handleThemeChange(value: string) {
    if (value) {
      setTheme(value);
    }
  }

  return (
    <footer className="py-6 md:px-8 md:py-0 border-t dark:border-border/40 bg-background/95 ">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          Copyright © {currentYear} Royce Mathew. All rights reserved.
        </p>
        <ToggleGroup
          type="single"
          className="border rounded-full gap-0"
          size="sm"
          onValueChange={handleThemeChange}
          loop={true}
          value={theme}
        >
          <ToggleGroupItem value="light" className="rounded-full aspect-square">
            <Icons.sun />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="system"
            className="rounded-full aspect-square"
          >
            <Icons.deviceStar />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="rounded-full aspect-square">
            <Icons.moon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </footer>
  );
}
