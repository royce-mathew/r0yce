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
    <div className="h-full min-w-0">
      <Link
        href={project.slug}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-sm border border-border/30 bg-card transition-all duration-500 motion-reduce:transition-none",
          "hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
          className
        )}
        {...props}
      >
        {project.imageSrc && (
          <div className="relative aspect-16/10 w-full overflow-hidden">
            <Image
              src={project.imageSrc}
              alt=""
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
              width={600}
              height={375}
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 30vw"
              loading={index < 3 ? "eager" : undefined}
            />
            <div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent opacity-60" />
            <div className="absolute bottom-0 h-[2px] w-full origin-left scale-x-0 bg-primary/60 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div className="space-y-2">
            <h3 className="font-display text-xl leading-tight md:text-2xl">{project.title}</h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/20 pt-4">
            <div className="flex max-w-[65%] flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag: string) => (
                <TagPill key={tag} tag={tag} className="scale-95" />
              ))}
            </div>
            <time dateTime={project.publishedDate} className="shrink-0 text-[0.65rem] font-medium tracking-[0.05em] text-muted-foreground/50 uppercase">
              {new Date(project.publishedDate).toLocaleDateString("en-US", {
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
