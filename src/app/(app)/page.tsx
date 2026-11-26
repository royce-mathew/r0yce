import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { mainContents, projects } from "#site/content"
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

const selectedWork = projects.filter((project) => project.featured)
  .sort((a, b) => b.modifiedDate.localeCompare(a.modifiedDate))

export default function Home() {
  const about = mainContents.find((base) => base.slugAsParams === "about")
  if (!about) {
    throw new Error("About base not found")
  }

  return (
    <CreationHome code={about.code}>
      <section id="selected-work" className="creation-work" aria-labelledby="selected-work-title">
        <header className="creation-work-heading">
          <h2 id="selected-work-title">Selected work<span aria-hidden="true">.</span></h2>
          <Link href="/projects">All projects <span aria-hidden="true">↗</span></Link>
        </header>
        <ul className="creation-work-list">
          {selectedWork.map((project) => (
            <li key={project.slug}>
              <Link href={`/${project.slug.replace(/^\/+/, "")}`} className="creation-work-project">
                {project.imageSrc && (
                  <Image src={project.imageSrc} alt="" width={1000} height={625}
                    sizes="(max-width: 767px) 90vw, (max-width: 1450px) 30vw, 430px" />
                )}
                <h3>{project.title}<span aria-hidden="true">↗</span></h3>
                <p>{project.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </CreationHome>
  )
}
