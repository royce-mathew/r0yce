"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mdx } from "@/components/mdx/mdx-components"
import { MangaImpactLines } from "./manga-ink-drawing"
import { HeroLab, useHeroSettings } from "./hero-lab-prototype"
import "./hero-lab-prototype.css"
import { MonolithHero } from "./hero-monolith-prototype"
import { ContactSheetHero } from "./hero-contact-sheet-prototype"
import { SignalHero } from "./hero-signal-prototype"
import { AfterimageHero } from "./hero-afterimage-prototype"
import { ScrollHomePrototype } from "./scroll-home-prototype"

type Work = { title: string; description: string; imageSrc: string; slug: string }
type Props = { code: string; works: Work[] }

function Identity() {
  return <><p className="manga-role">Software Developer · AI Developer · Game Developer</p><h1 className="manga-name"><span>Royce</span><span>Mathew<span className="manga-period">.</span></span></h1></>
}

function Contact() {
  return <div className="manga-contact"><a className="manga-button" href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a><a href="https://github.com/royce-mathew" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/royce-mathew" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="mailto:royce1mathew@gmail.com">Email ↗</a></div>
}

function Portrait() {
  return <figure className="manga-portrait"><div className="manga-tone" aria-hidden="true"/><Image src="/images/ProfilePicture2.webp" alt="Royce Mathew" width={600} height={600} priority sizes="(max-width: 760px) 90vw, 45vw"/><figcaption>Analyst @ TD Asset Management</figcaption></figure>
}

function Intro() {
  return <p className="manga-intro">Building at the intersection of cloud infrastructure, AI, and creative engineering. Crafting solutions that scale.</p>
}

export function VariantA() {
  return <section className="manga-cover manga-cover-a" aria-label="Introduction"><div className="manga-edition"><span>royce.sh / Royce Mathew</span><span>Based in Canada</span></div><div className="manga-cover-grid"><div className="manga-title-panel" data-manga-enter><Identity/><div className="manga-title-foot"><Intro/></div></div><div className="manga-photo-panel" data-manga-enter><Portrait/><MangaImpactLines/><span className="manga-side-note" aria-hidden="true">CODE / AI / PLAY</span></div><div className="manga-action-panel" data-manga-enter><Contact/></div><a href="#about" className="manga-next-panel">About & experience <span aria-hidden="true">↓</span></a></div></section>
}

export function MangaHomePrototype({code, works}: Props) {
  const params = useSearchParams()
  const query = params.get("variant")
  const variant = query === "B" || query === "C" || query === "D" || query === "E" ? query : "A"
  const { settings, style } = useHeroSettings()
  const scrollStudy = params.get("study") === "scroll" || (!params.has("study") && !params.has("variant"))
  if (scrollStudy) return <ScrollHomePrototype code={code} variant={variant === "E" ? "A" : variant}/>
  return <main className={`manga-home manga-home-${variant}`} style={style} data-hero-layout={settings.layout} data-hero-type={settings.type}>
    {variant === "A" ? <><VariantA/><HeroLab settings={settings}/></> : variant === "B" ? <MonolithHero/> : variant === "C" ? <ContactSheetHero/> : variant === "D" ? <SignalHero/> : <AfterimageHero/>}
    <section className="manga-work-preview" aria-labelledby="manga-work-title"><div className="manga-chapter"><span>01 / Portfolio</span><Link href={`/projects?variant=${variant}`}>All projects ↗</Link></div><h2 id="manga-work-title">Selected work<span className="manga-period">.</span></h2><div className="manga-preview-grid">{works.map((work,index)=><Link href={`/${work.slug}?variant=${variant}`} key={work.slug} className="manga-work-panel"><div className="manga-work-image"><Image src={work.imageSrc} alt="" width={700} height={440} sizes="(max-width:760px) 90vw, 45vw"/></div><div className="manga-work-caption"><span className="manga-work-number">0{index+1}</span><div><h3>{work.title}</h3><p>{work.description}</p></div><span aria-hidden="true">↗</span></div></Link>)}</div></section>
    <section id="about" className="manga-about" aria-label="About and experience"><div className="manga-chapter"><span>02 / About & experience</span><span className="manga-chapter-rule" data-manga-rule aria-hidden="true"/></div><div className="manga-about-body"><aside aria-hidden="true" className="manga-about-index">THE<br/>STORY<br/>SO FAR<span>↓</span></aside><div className="prose-content manga-biography"><Mdx code={code} className="mdx-shell-about"/></div></div></section>
  </main>
}
