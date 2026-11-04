import { Suspense } from "react"
import { Metadata } from "next"
import { mainContents, projects } from "#site/content"
import { MangaHomePrototype } from "./manga-home-prototype"

export const metadata: Metadata = {
  title: "royce.sh — Royce Mathew, Developer & Data Scientist",
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
    siteName: "royce.sh",
    url: "https://royce.sh",
    type: "website",
    title: "royce.sh — Royce Mathew, Developer & Data Scientist",
    description:
      "Portfolio of Royce Mathew — Software Developer, Data Scientist, and Game Developer based in Canada.",
    images: [
      {
        url: "https://royce.sh/images/ProfilePicture2.webp",
        width: 1200,
        height: 630,
        alt: "Royce Mathew",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "royce.sh — Royce Mathew, Developer & Data Scientist",
    description:
      "Portfolio of Royce Mathew — Software Developer, Data Scientist, and Game Developer based in Canada.",
    images: [
      {
        url: "https://royce.sh/images/ProfilePicture2.webp",
        width: 1200,
        height: 630,
        alt: "Royce Mathew",
      },
    ],
  },
  alternates: {
    canonical: "https://royce.sh",
  },
}

export default function Home() {
  const about = mainContents.find((base) => base.slugAsParams === "about")
  if (!about) {
    throw new Error("About base not found")
  }

  const works = [...projects].filter(project => project.featured).sort((a, b) => b.modifiedDate.localeCompare(a.modifiedDate)).slice(0, 2).map(({ title, description, imageSrc, slug }) => ({ title, description, imageSrc, slug }))
  return (
    <Suspense>
      <MangaHomePrototype code={about.code} works={works} />
    </Suspense>
  )
}
