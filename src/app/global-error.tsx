"use client"

import { cn } from "@/lib/utils"
import { ErrorBoundary } from "@/components/nav/error"
import { cal, inter } from "@/styles/fonts"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          cal.variable,
          inter.variable
        )}
      >
        <ErrorBoundary error={error} reset={reset} />
      </body>
    </html>
  )
}
