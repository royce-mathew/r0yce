import { Metadata } from "next"
import { mainContents } from "#site/content"
import { CreationHome } from "./creation-home"

export const metadata: Metadata = {
  title: "royce.sh | Royce Mathew, Software Developer & AI Engineer",
  description:
    "Portfolio of Royce Mathew: Software Developer, AI Engineer, and Game Developer based in Canada.",
  keywords: [
    "developer",
    "python",
    "javascript",
    "react",
    "computer science",
    "AI engineer",
    "portfolio",
    "royce mathew",
  ],
  openGraph: {
    siteName: "royce.sh",
    url: "https://royce.sh",
    type: "website",
    title: "royce.sh | Royce Mathew, Software Developer & AI Engineer",
    description:
      "Portfolio of Royce Mathew: Software Developer, AI Engineer, and Game Developer based in Canada.",
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
    title: "royce.sh | Royce Mathew, Software Developer & AI Engineer",
    description:
      "Portfolio of Royce Mathew: Software Developer, AI Engineer, and Game Developer based in Canada.",
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

  return <CreationHome code={about.code} />
}
