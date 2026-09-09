import { createElement } from "react"
import { getTagIcon, getTagTheme } from "@/lib/tag-theme"
import { cn } from "@/lib/utils"

interface TagPillProps {
  tag: string
  className?: string
}

export function TagPill({ tag, className }: TagPillProps) {
  const theme = getTagTheme(tag)
  const icon = createElement(getTagIcon(tag), {
    className: "w-3 h-3",
    strokeWidth: 1.6,
    "aria-hidden": true,
  })

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[0.56rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:-translate-y-0.5",
        theme.className,
        className
      )}
      style={theme.style}
    >
      <span className="icon inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
        {icon}
      </span>
      <span className="ml-0.5">{tag}</span>
    </span>
  )
}
