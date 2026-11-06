"use client"

import { Mdx } from "@/components/mdx/mdx-components"
import "./creation-about.css"

export function CreationAbout({ code }: { code: string }) {
  return <section id="scroll-about" className="creation-about" aria-labelledby="scroll-about-title">
    <div className="creation-about-copy">
      <h2 id="scroll-about-title">About &amp; experience<span>.</span></h2>
      <div className="prose-content"><Mdx code={code} className="mdx-shell-about" /></div>
      <a className="creation-about-resume" href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
    </div>
  </section>
}
