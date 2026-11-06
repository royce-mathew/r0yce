"use client"

import type { HTMLAttributes } from "react"
import { Mdx } from "@/components/mdx/mdx-components"

const articleComponents = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
}

export function ProjectArticle({ code }: { code: string }) {
  return <Mdx code={code} className="project-prose" components={articleComponents} />
}
