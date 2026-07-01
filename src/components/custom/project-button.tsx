"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Project } from "#site/content"
import { motion } from "motion/react"
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        ease: [0.19, 1, 0.22, 1],
        delay: index * 0.08,
      }}
    >
      <Link
        href={project?.slug ?? "/"}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-sm border border-border/30 bg-card transition-all duration-500",
          "hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5",
          className
        )}
        {...props}
      >
        {/* Image container */}
        {project?.imageSrc && (
          <div className="relative aspect-16/10 w-full overflow-hidden">
            <Image
              src={project.imageSrc}
              alt={project.title}
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              width={600}
              height={375}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent opacity-60" />

            {/* Gold accent line at bottom — reveals on hover */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-primary/60 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div className="space-y-2">
            <h3 className="font-display text-xl leading-tight md:text-2xl">
              {project.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          {/* Tags & Date */}
          <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag: string) => (
                <TagPill key={tag} tag={tag} className="scale-95" />
              ))}
            </div>
            <time className="text-[0.65rem] font-medium tracking-[0.05em] text-muted-foreground/50 uppercase">
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
    </motion.div>
  )
}

export default ProjectButton
