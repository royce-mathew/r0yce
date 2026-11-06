import { getTagTheme } from "@/lib/tag-theme"
import { cn } from "@/lib/utils"

interface TagPillProps {
  tag: string
  className?: string
}

export function TagPill({ tag, className }: TagPillProps) {
  const theme = getTagTheme(tag)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[0.56rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:-translate-y-0.5",
        theme.className,
        className
      )}
      style={theme.style}
    >
      {tag}
    </span>
  )
}
