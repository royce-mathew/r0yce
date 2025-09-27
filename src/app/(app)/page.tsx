import { Metadata } from "next"
import { mainContents } from "#site/content"
import { Mdx } from "@/components/mdx/mdx-components"
import { ProfileSection } from "./profile-section"

export const metadata: Metadata = {
  title: "Home | r0yce",
  description: "r0yce.com - Portfolio website",
  keywords: [
    "developer",
    "python",
    "javascript",
    "react",
    "computer science",
    "data science",
  ],
  openGraph: {
    url: "https://r0yce.com",
    type: "website",
    title: "Home | r0yce",
    description: "r0yce.com - Portfolio website",
    images: [
      {
        url: "https://r0yce.com/images/ProfilePicture2.webp",
        width: 1200,
        height: 630,
        alt: "r0yce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | r0yce",
    description: "r0yce.com - Portfolio website",
    images: [
      {
        url: "https://r0yce.com/images/ProfilePicture2.webp",
        width: 1200,
        height: 630,
        alt: "r0yce",
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
      {/* Profile Information Box */}
      <ProfileSection />

      {/* About Me */}
      <section
        id="about"
        data-section="about"
        className="flex flex-col items-center justify-center bg-black/[2%] p-5 dark:bg-white/[1%]"
      >
        <div className="w-full max-w-[900px]">
          <Mdx code={about.code} />
        </div>
      </section>
    </main>
  )
}
