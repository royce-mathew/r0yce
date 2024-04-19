"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";

const sizeClass = "h-5 w-9";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const mounted = useMounted(); // Wait for mounted to show Switch
  const { setTheme, theme, systemTheme } = useTheme();

  if (!mounted) {
    return <Skeleton className={sizeClass} />;
  }

  return (
    <SwitchPrimitives.Root
      checked={
        theme === "dark" || (theme === "system" && systemTheme === "dark")
      }
      aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      className={cn(
        sizeClass,
        "focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch as ModeToggle };
