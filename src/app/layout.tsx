import "@/styles/globals.css"
import "@/styles/mdx.css"
import "@/styles/manga-prototype.css"
import type { Metadata, Viewport } from "next"
import { Barlow_Condensed } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/components/providers/session"
import { ThemeProvider } from "@/components/providers/theme"
import { cal, dmSans, instrumentSerif, jetbrainsMono } from "@/styles/fonts"

const mangaDisplay = Barlow_Condensed({ subsets: ["latin"], weight: "800", variable: "--font-manga", display: "swap" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://r0yce.com"),
  openGraph: {
    siteName: "r0yce",
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
  applicationName: "r0yce",
  appleWebApp: {
    title: "r0yce",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      // add apple-icon-72x72.png, apple-icon-76x76.png, apple-icon-114x114.png, apple-icon-120x120.png, apple-icon-144x144.png, apple-icon-152x152.png, apple-icon-180x180.png
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: 'document.documentElement.dataset.mangaVariant = ["B","C"].includes(new URLSearchParams(location.search).get("variant")) ? new URLSearchParams(location.search).get("variant") : "A";' }} /></head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          dmSans.variable,
          instrumentSerif.variable,
          jetbrainsMono.variable,
          mangaDisplay.variable,
          cal.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
      {/* Google Analytics */}
      {process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_ID} />
        )}
    </html>
  )
}
