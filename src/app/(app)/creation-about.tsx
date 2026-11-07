"use client"

import { Mdx } from "@/components/mdx/mdx-components"
import "./creation-about.css"

export function CreationAbout({ code }: { code: string }) {
  return <section id="scroll-about" className="creation-about" aria-labelledby="scroll-about-title">
    <div className="creation-about-copy">
      <h2 id="scroll-about-title">About &amp; experience<span>.</span></h2>
      <div className="prose-content"><Mdx code={code} className="mdx-shell-about" /></div>
    </div>
  </section>
}
