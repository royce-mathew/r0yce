"use client"

import { cn } from "@/lib/utils"
import { ErrorBoundary } from "@/components/error"
import { ThemeProvider } from "@/components/providers"
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
          "bg-background min-h-screen antialiased",
          cal.variable,
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary error={error} reset={reset} />
        </ThemeProvider>
      </body>
    </html>
  )
}
