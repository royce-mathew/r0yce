import Image from "next/image"
import { resolveTechnology } from "../technologies"

export function ProjectTechnologies({ tags }: { tags: string[] }) {
  const technologies = []

  for (const tag of tags) {
    const technology = resolveTechnology(tag)
    technologies.push(
      <li key={tag}>
        {technology.logo && (
          <Image src={`/technology/${technology.logo}.svg`} alt="" width={24} height={24} />
        )}
        <span>{technology.name}</span>
      </li>
    )
  }

  return (
    <div className="project-technologies">
      {technologies.length > 0 && <ul className="project-technology-list" aria-label="Technologies">{technologies}</ul>}
    </div>
  )
}
