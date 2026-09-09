"use client"

import * as React from "react"
import * as runtime from "react/jsx-runtime"
import Image from "next/image"
import Link from "next/link"
import { YouTubeEmbed } from "@next/third-parties/google"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Callout } from "@/components/mdx/callout"
import { CodeBlockWrapper } from "@/components/mdx/code-block-wrapper"
import { CopyButton } from "@/components/mdx/copy-button"
import {
  MdxImgAttributes,
  MdxMotionBlock,
  MdxMotionImage,
  StepsContext,
} from "@/components/mdx/mdx-motion"
import { NumberFlowComponent } from "../ui/number"

const sharedComponents = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  YouTubeEmbed,
  NumberFlow: NumberFlowComponent,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MdxMotionBlock intensity={18} scale={0.988} className="mt-10 mb-8">
      <div className="relative border-y border-border/60 py-5">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-60" />
        <h2
          className={cn(
            "flex scroll-m-20 items-center gap-4 font-display text-4xl leading-none font-semibold tracking-[-0.04em] md:text-5xl",
            className
          )}
          {...props}
        />
      </div>
    </MdxMotionBlock>
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MdxMotionBlock intensity={14} scale={0.992} className="mt-12 first:mt-0">
      <h3
        className={cn(
          "flex scroll-m-20 items-center gap-4 font-display text-2xl font-semibold tracking-[-0.03em]",
          className
        )}
        {...props}
      />
    </MdxMotionBlock>
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MdxMotionBlock intensity={10} scale={0.995} className="mt-8 mb-4">
      <h4
        className={cn(
          "font-display text-xl font-semibold tracking-[-0.02em] text-foreground/90 italic",
          className
        )}
        {...props}
      />
    </MdxMotionBlock>
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MdxMotionBlock intensity={8} scale={0.996} className="mt-8">
      <h5
        className={cn(
          "relative scroll-m-20 text-[0.72rem] font-semibold tracking-[0.22em] text-gold-dim uppercase",
          className
        )}
        {...props}
      />
    </MdxMotionBlock>
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MdxMotionBlock intensity={6} scale={0.997} className="mt-8">
      <h6
        className={cn(
          "scroll-m-20 text-sm font-semibold tracking-[0.12em] text-foreground/70 uppercase",
          className
        )}
        {...props}
      />
    </MdxMotionBlock>
  ),
  a: ({
    className,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      rel={
        props.href
          ? props.href.startsWith("http")
            ? "noopener noreferrer"
            : undefined
          : undefined
      }
      target={
        props.href
          ? props.href.startsWith("http")
            ? "_blank"
            : undefined
          : undefined
      }
      className={cn(
        "font-medium text-primary decoration-2 hover:underline",
        className
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <b className={cn("font-semibold text-foreground", className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <MdxMotionBlock intensity={8} scale={0.999} className="not-first:mt-5">
      <p className={cn("leading-8 text-foreground/82", className)} {...props} />
    </MdxMotionBlock>
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <MdxMotionBlock intensity={10} scale={0.995} className="my-6">
      <ul className={cn("ml-0 space-y-3 pl-0", className)} {...props} />
    </MdxMotionBlock>
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <MdxMotionBlock intensity={10} scale={0.995} className="my-6">
      <ol className={cn("ml-0 space-y-3 pl-0", className)} {...props} />
    </MdxMotionBlock>
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("leading-7 text-foreground/76", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <MdxMotionBlock intensity={16} scale={0.99} className="my-8">
      <blockquote
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 px-6 py-5 text-foreground/88 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm",
          className
        )}
        {...props}
      />
    </MdxMotionBlock>
  ),
  img: ({ className, alt, ...props }: MdxImgAttributes) => (
    <MdxMotionImage className={cn("my-8", className)} alt={alt} {...props} />
  ),
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <MdxMotionBlock intensity={6} scale={1} className="my-8">
      <hr
        className={cn("border-border/70 opacity-100", className)}
        {...props}
      />
    </MdxMotionBlock>
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <MdxMotionBlock intensity={14} scale={0.994} className="my-8">
      <div className="w-full overflow-x-auto rounded-2xl border border-border/70 bg-card/60 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <table
          className={cn("w-full border-separate border-spacing-0", className)}
          {...props}
        />
      </div>
    </MdxMotionBlock>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted/40", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border-b border-border/70 bg-background/60 px-4 py-3 text-left text-[0.7rem] font-semibold tracking-[0.16em] text-foreground/70 uppercase backdrop-blur [[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border-b border-border/50 px-4 py-3 text-left align-top text-foreground/80 [[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({
    className,
    __raw__,
    ...props
  }: React.HTMLAttributes<HTMLPreElement> & {
    __raw__?: string
  }) => {
    return (
      <MdxMotionBlock intensity={16} scale={0.992} className="my-8">
        <ScrollArea>
          <div className="group relative max-h-[650px] max-w-full">
            <pre
              className={cn(
                "grid w-full min-w-max bg-transparent px-3 py-4",
                className
              )}
              {...props}
            >
              <div className="absolute top-4 right-4">
                <CopyButton content={__raw__ ?? ""} />
              </div>
              {props.children}
            </pre>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </MdxMotionBlock>
    )
  },
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    return (
      <code
        className={cn(
          "size-full rounded bg-black/5 p-1 font-mono text-sm text-primary dark:bg-white/5",
          className
        )}
        {...props}
      />
    )
  },
  Image,
  Callout,
  AspectRatio,
  CodeBlockWrapper: ({ ...props }) => (
    <CodeBlockWrapper className="rounded" {...props} />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <MdxMotionBlock intensity={12} scale={0.994} className="mt-8">
      <h3
        className={cn(
          "relative scroll-m-20 font-display text-xl font-semibold tracking-[-0.03em]",
          className
        )}
        {...props}
      />
    </MdxMotionBlock>
  ),
  Steps: ({ className, ...props }: React.ComponentProps<"div">) => {
    const steps = groupChildrenIntoSteps(props.children)
    return (
      <StepsContext.Provider value={true}>
        <div
          className={cn(
            "steps mb-12 ml-4 text-foreground/80 [counter-reset:step] [&>div>div>h1]:step [&>div>div>h2]:step [&>div>div>h3]:step [&>div>div>h4]:step [&>div>h1]:step [&>div>h2]:step [&>div>h3]:step [&>div>h4]:step",
            className
          )}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                "step-group relative isolate pb-10 pl-8 last:pb-0",
                idx < steps.length - 1 && "step-line"
              )}
            >
              {step.heading}
              {step.content}
            </div>
          ))}
        </div>
      </StepsContext.Provider>
    )
  },
  UnorderedSteps: ({ className, ...props }: React.ComponentProps<"div">) => {
    const steps = groupChildrenIntoSteps(props.children)
    return (
      <StepsContext.Provider value={true}>
        <div
          className={cn(
            "unordered-steps mb-12 ml-4 text-foreground/80 [counter-reset:unordered-step] [&>div>div>h1]:unordered-step [&>div>div>h2]:unordered-step [&>div>div>h3]:unordered-step [&>div>div>h4]:unordered-step [&>div>h1]:unordered-step [&>div>h2]:unordered-step [&>div>h3]:unordered-step [&>div>h4]:unordered-step",
            className
          )}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                "step-group relative isolate pb-10 pl-8 last:pb-0",
                idx < steps.length - 1 && "step-line"
              )}
            >
              {step.heading}
              {step.content}
            </div>
          ))}
        </div>
      </StepsContext.Provider>
    )
  },
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "font-medium text-gold-dim underline decoration-[hsl(var(--gold)/0.45)] underline-offset-4 transition-colors hover:text-foreground hover:decoration-[hsl(var(--gold))]",
        className
      )}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "flex w-full flex-col items-center rounded-2xl border border-border/70 bg-card/80 p-6 text-card-foreground shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:border-[hsl(var(--gold)/0.45)] sm:p-10",
        className
      )}
      {...props}
    />
  ),
  Grid: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn("flex flex-col gap-5 p-2 md:flex-row md:gap-6", className)}
      {...props}
    />
  ),
  GridItem: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={cn("basis-1/2", className)} {...props} />
  ),
}

function isStepHeading(child: any): boolean {
  if (!React.isValidElement(child)) return false
  const type = child.type
  if (typeof type === "string") {
    return ["h1", "h2", "h3"].includes(type.toLowerCase())
  }
  return (
    type === sharedComponents.h1 ||
    type === sharedComponents.h2 ||
    type === sharedComponents.h3
  )
}

function groupChildrenIntoSteps(children: React.ReactNode) {
  const childrenArray = React.Children.toArray(children)
  const steps: { heading: React.ReactNode; content: React.ReactNode[] }[] = []

  childrenArray.forEach((child) => {
    if (isStepHeading(child)) {
      steps.push({ heading: child, content: [] })
    } else {
      if (steps.length === 0) {
        steps.push({ heading: null, content: [child] })
      } else {
        steps[steps.length - 1].content.push(child)
      }
    }
  })

  return steps
}
// Parse Velite-generated MDX into a component function.
function compileMDXComponent(code: string): React.ComponentType<any> {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
  className?: string
  [key: string]: any
}

export const Mdx = ({ code, components, className, ...props }: MDXProps) => {
  const component = React.useMemo(() => compileMDXComponent(code), [code])
  const mdxComponents = React.useMemo(
    () => ({ ...sharedComponents, ...components }),
    [components]
  )

  return (
    <div className={cn("mdx-shell", className)}>
      <div className="mdx">
        {React.createElement(component, {
          components: mdxComponents,
          ...props,
        })}
      </div>
    </div>
  )
}
