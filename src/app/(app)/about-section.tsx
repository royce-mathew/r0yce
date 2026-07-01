"use client"

import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Mdx } from "@/components/mdx/mdx-components"

interface AboutSectionProps {
  code: string
}

export function AboutSection({ code }: AboutSectionProps) {
  return (
    <section
      id="about"
      data-section="about"
      className="relative flex flex-col items-center justify-center py-24 md:py-32"
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-1/2 h-px w-12 -translate-x-1/2 bg-primary/30" />

      <ScrollReveal className="w-full max-w-[900px] px-6 md:px-8" delay={0.1}>
        {/* Section label */}
        <div className="mb-12">
          <span className="label-editorial text-gold">About & Experience</span>
        </div>

        {/* MDX content */}
        <div className="prose-content">
          <Mdx code={code} className="mdx-shell-about" />
        </div>
      </ScrollReveal>
    </section>
  )
}
