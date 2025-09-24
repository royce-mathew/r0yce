import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  IconBrandGithubFilled,
  IconFileCertificate,
  IconMailFilled,
} from "@tabler/icons-react"
import { mainContents } from "#site/content"
import { Icons } from "@/config/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mdx } from "@/components/mdx/mdx-components"

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
        <div className="relative">
          <div className="absolute top-[10px] left-[10px] -z-10 size-32 rounded-full border-4 border-black/5 bg-accent/50 md:size-[230px] dark:border-white/5" />
          <Image
            className="size-32 rounded-full md:size-[230px]"
            src="/images/ProfilePicture.webp"
            width={500}
            height={500}
            quality={100}
            alt="Profile"
          />
        </div>

        <div className="mt-4 space-y-2 px-2">
          {/* Name */}
          <h1 className="text-center font-cal text-2xl font-bold sm:text-3xl md:text-5xl dark:text-white">
            Royce Mathew
          </h1>

          {/* Badges */}
          <div className="flex items-center space-x-2">
            <Badge
              className="bg-primary/20 text-[10px] text-foreground sm:text-sm"
              variant="defaultNonInteractive"
            >
              🎓 4th Year Student
            </Badge>
            <Badge
              className="bg-primary/20 text-[10px] text-foreground sm:text-sm"
              variant="defaultNonInteractive"
            >
              💻 Software Engineer
            </Badge>
            <Badge
              className="bg-primary/20 text-[10px] text-foreground sm:text-sm"
              variant="defaultNonInteractive"
            >
              🎮 Game Developer
            </Badge>
          </div>

          {/* Contact Information */}
          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://github.com/royce-mathew"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandGithubFilled className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://www.linkedin.com/in/royce-mathew"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.LinkedIn className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a
                  href="mailto:royce1mathew@gmail.com"
                  aria-label="Email to user"
                >
                  <IconMailFilled className="size-5" />
                </a>
              </Button>
            </div>
            <Button asChild variant="outline">
              <Link
                href="/files/Royce%20Mathew%20Resume.pdf"
                aria-label="Resume"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconFileCertificate className="mr-2 size-4" /> Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/* About Me */}
      <div className="flex flex-col items-center justify-center bg-black/[2%] p-5 dark:bg-black/[10%]">
        <h2 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
          {about?.title}
        </h2>
        <div className="max-w-[900px]">
          <Mdx code={about.code} />
        </div>
      </div>
    </main>
  )
}
