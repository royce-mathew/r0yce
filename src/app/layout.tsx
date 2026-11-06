import "@/styles/globals.css"
import "@/styles/mdx.css"
import "@/styles/site-theme.css"
import type { Metadata, Viewport } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/components/providers/session"
import { cal, dmSans, instrumentSerif, jetbrainsMono, mangaDisplay, mangaDialogue, mangaJapanese } from "@/styles/fonts"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0c0a",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://royce.sh"),
  openGraph: {
    siteName: "royce.sh",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName: "royce.sh",
  appleWebApp: {
    title: "royce.sh",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          dmSans.variable,
          instrumentSerif.variable,
          jetbrainsMono.variable,
          mangaDisplay.variable,
          mangaDialogue.variable,
          mangaJapanese.variable,
          cal.variable
        )}
      >
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
        <Toaster />
      </body>
      {/* Google Analytics */}
      {process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_ID} />
        )}
    </html>
  )
}
