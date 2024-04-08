import AvatarStack from "@/components/avatar-stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { mainContents } from "#site/content";
import { Mdx } from "@/components/mdx-components";

import { Metadata } from "next";

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
        url: "https://r0yce.com/images/ProfilePicture2.png",
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
        url: "https://r0yce.com/images/ProfilePicture2.png",
        width: 1200,
        height: 630,
        alt: "r0yce",
      },
    ],
  },
  alternates: {
    canonical: "https://r0yce.com",
  },
};

export default function Home() {
  const about = mainContents.find((base) => base.slugAsParams === "about");
  if (!about) {
    throw new Error("About base not found");
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Profile Information Box */}
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8 my-24">
        <AvatarStack
          className="relative h-32 w-32 md:w-[230px] md:h-[230px]"
          images={["/images/ProfilePicture2.jpg"]}
          fallback="Profile"
        />
        <div className="mt-4 space-y-2 px-2">
          {/* Name */}
          <h1 className="font-cal text-2xl sm:text-3xl md:text-5xl font-bold dark:text-white text-center">
            Royce Mathew
          </h1>

          {/* Badges */}
          <div className="flex items-center space-x-2">
            <Badge>🎓 3rd Year Student</Badge>
            <Badge>💻 Software Engineer</Badge>
            <Badge>🎮 Game Developer</Badge>
          </div>

          {/* Contact Information */}
          <div className="flex justify-between items-center ">
            <div className="space-x-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://github.com/royce-mathew"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.github className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://www.linkedin.com/in/royce-mathew"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInLogoIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href="mailto:royce1mathew@gmail.com">
                  <Icons.envelope className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <Button asChild variant="outline">
              <Link
                href="/files/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.pnpm className="mr-2 h-4 w-4" /> Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="bg-black bg-opacity-5 dark:bg-opacity-15 flex flex-col items-center justify-center p-5">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          {about?.title}
        </h1>
        <div className="max-w-[900px]">
          <Mdx code={about.code} />
        </div>
      </div>
    </main>
  );
}
