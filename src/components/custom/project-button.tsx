import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Project } from "#site/content"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

interface ProjectButtonProps {
  project?: Project
  className?: string
}

const ProjectButton: React.FC<ProjectButtonProps> = ({
  project,
  className,
  ...props
}) => {
  if (!project) {
    return (
      <div className="text-center text-muted-foreground">No Project found.</div>
    )
  }
  return (
    <Button
      asChild
      className={cn(
        "row-span-1 flex size-full flex-col justify-between space-y-4 rounded border border-border bg-background p-1 transition-all duration-200 hover:scale-[102%] hover:shadow-xl hover:brightness-70",
        className
      )}
      variant={null}
      {...props}
    >
      <Link href={project?.slug ?? "/"}>
        {project?.imageSrc && (
          <div className="flex size-full flex-col justify-between">
            <div className="relative p-1">
              <Image
                src={project?.imageSrc ?? ""}
                alt="Project Example"
                className="size-full max-h-64 rounded object-cover"
                width={400}
                height={400}
              />
              <div className="halftone absolute inset-0" />
              <div className="bg-size-150% bg-pos-10% absolute inset-0 bg-linear-to-t from-background from-5% to-transparent to-25%" />
            </div>

            <div className="flex flex-col space-y-2 px-1 pt-4 pb-2 text-wrap">
              <h1 className="text-xl font-semibold text-balance md:text-2xl">
                {project?.title}
              </h1>
              <p className="text-wrap text-muted-foreground">
                {project?.description}
              </p>

              <Separator />
              <small className="text-right text-sm">
                {project?.publishedDate &&
                  format(
                    parseISO(project?.publishedDate ?? ""),
                    "MMMM dd, yyyy"
                  )}
              </small>
            </div>
          </div>
        )}
      </Link>
    </Button>
  )
}

export default ProjectButton
