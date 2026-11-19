"use client"

import * as React from "react"
import { IconClipboardCheck, IconClipboardCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  content: string
}

export function CopyButton({ className, content, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setHasCopied(true)

    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }
  return (
    <Button
      aria-label={hasCopied ? "Copied" : "Copy code"}
      variant="ghost"
      className={cn(
        "relative z-10 w-fit rounded-lg bg-black/10 p-2 text-foreground opacity-0 transition-opacity duration-200 ease-in-out hover:bg-black/15 hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100",
        className
      )}
      onClick={handleCopy}
      {...props}
    >
      {hasCopied ? (
        <div className="flex items-center space-x-3">
          <div>Copied</div>
          <div>
            <IconClipboardCheck className="size-6" aria-hidden="true" />
          </div>
        </div>
      ) : (
        <IconClipboardCopy className="size-6" aria-hidden="true" />
      )}
    </Button>
  )
}
