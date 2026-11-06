import type { Project } from "#site/content"

export type ProjectStudyVariant = "A" | "B" | "C"

export type ProjectSummary = Pick<Project, "slug" | "title" | "description" | "imageSrc" | "tags" | "publishedDate" | "modifiedDate">

export type ProjectStudyProps = { projects: readonly ProjectSummary[] }
