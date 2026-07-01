import { Metadata } from "next"
import { mainContents } from "#site/content"
import { Mdx } from "@/components/mdx/mdx-components"
import { ProfileSection } from "./profile-section"
import { AboutSection } from "./about-section"

export const metadata: Metadata = {
  title: "Royce Mathew — Developer & Data Scientist",
  description:
    "Portfolio of Royce Mathew — Software Developer, Data Scientist, and Game Developer based in Canada.",
  keywords: [
    "developer",
    "python",
    "javascript",
    "react",
    "computer science",
    "data science",
    "portfolio",
    "royce mathew",
  ],
  openGraph: {
    url: "https://r0yce.com",
    type: "website",
    title: "Royce Mathew — Developer & Data Scientist",
    description:
      "Portfolio of Royce Mathew — Software Developer, Data Scientist, and Game Developer based in Canada.",
    images: [
      {
        url: "https://r0yce.com/images/ProfilePicture2.webp",
        width: 1200,
        height: 630,
        alt: "Royce Mathew",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royce Mathew — Developer & Data Scientist",
    description:
      "Portfolio of Royce Mathew — Software Developer, Data Scientist, and Game Developer based in Canada.",
    images: [
      {
        url: "https://r0yce.com/images/ProfilePicture2.webp",
        width: 1200,
        height: 630,
        alt: "Royce Mathew",
      },
    ],
  },
  alternates: {
    canonical: "https://r0yce.com",
  },
}

export default function Home() {
  const about = mainContents.find((base) => base.slugAsParams === "about")
  if (!about) {
    throw new Error("About base not found")
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <ProfileSection />

      {/* About Me */}
      <AboutSection code={about.code} />
    </main>
  )
}
