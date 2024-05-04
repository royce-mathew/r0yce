import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { mainContents } from "#site/content"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Mdx } from "@/components/mdx-components"

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
      <div className="my-24 flex flex-col items-center justify-center md:flex-row md:space-x-8">
        {/* Profile Image */}
        <Image
          className="size-32 rounded-full md:size-[230px]"
          src="/images/ProfilePicture2.webp"
          width={500}
          height={500}
          quality={100}
          alt="Profile"
        />

        <div className="mt-4 space-y-2 px-2">
          {/* Name */}
          <h1 className="font-cal text-center text-2xl font-bold sm:text-3xl md:text-5xl dark:text-white">
            Royce Mathew
          </h1>

          {/* Badges */}
          <div className="flex items-center space-x-2">
            <Badge variant="defaultNonInteractive">🎓 3rd Year Student</Badge>
            <Badge variant="defaultNonInteractive">💻 Software Engineer</Badge>
            <Badge variant="defaultNonInteractive">🎮 Game Developer</Badge>
          </div>

          {/* Contact Information */}
          <div className="flex items-center justify-between ">
            <div className="space-x-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://github.com/royce-mathew"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.github className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://www.linkedin.com/in/royce-mathew"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.linkedin className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a
                  href="mailto:royce1mathew@gmail.com"
                  aria-label="Email to user"
                >
                  <Icons.envelope className="size-5" />
                </a>
              </Button>
            </div>
            <Button asChild variant="outline">
              <Link
                href="/files/resume.pdf"
                aria-label="Resume"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.pnpm className="mr-2 size-4" /> Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/* About Me */}
      <div className="flex flex-col items-center justify-center bg-black/[5%] p-5 dark:bg-black/[10%]">
        <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          {about?.title}
        </h2>
        <div className="max-w-[900px]">
          <Mdx code={about.code} />
        </div>
      </div>
    </main>
  )
}
