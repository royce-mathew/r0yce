"use client"

import type { HTMLAttributes } from "react"
import { Mdx } from "@/components/mdx/mdx-components"

const articleComponents = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} />,
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => <h5 {...props} />,
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => <h6 {...props} />,
}

export function BlogProse({ code }: { code: string }) {
  return (
    <Mdx code={code} className="blog-prose" components={articleComponents} />
  )
}
