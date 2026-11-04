"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Project } from "#site/content"
import { cn } from "@/lib/utils"
import { TagPill } from "@/components/custom/tag-pill"

interface ProjectButtonProps {
  project?: Project
  className?: string
  index?: number
}

const ProjectButton: React.FC<ProjectButtonProps> = ({
  project,
  className,
  index = 0,
  ...props
}) => {
  if (!project) {
    return (
      <div className="text-center text-muted-foreground">No Project found.</div>
    )
  }

  return (
    <div className="project-panel-wrap">
      <Link
        href={project?.slug ?? "/"}
        className={cn(
          "project-ink-panel group",
          className
        )}
        {...props}
      >
        {/* Image container */}
        {project?.imageSrc && (
          <div className="project-panel-image">
            <Image
              src={project.imageSrc}
              alt=""
              className="size-full object-cover"
              width={600}
              height={375}
              sizes="(max-width: 760px) 90vw, 45vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="project-panel-copy">
          <div className="space-y-2">
            <span className="project-panel-number" aria-hidden="true">{String(index + 1).padStart(2, "0")} ↗</span>
            <h3 className="font-display">
              {project.title}
            </h3>
            <p className="project-panel-description">
              {project.description}
            </p>
          </div>

          {/* Tags & Date */}
          <div className="project-panel-meta">
            <div className="project-panel-tags">
              {project.tags.slice(0, 3).map((tag: string) => (
                <TagPill key={tag} tag={tag} className="scale-95" />
              ))}
            </div>
            <time dateTime={project.publishedDate} className="project-panel-date">
              {project?.publishedDate &&
                new Date(project.publishedDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
            </time>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProjectButton
