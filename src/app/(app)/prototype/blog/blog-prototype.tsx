import Link from "next/link"
import { Mdx } from "@/components/mdx/mdx-components"
import "./blog-prototype.css"

type Variant = "editorial" | "fieldnotes" | "visual"
type Post = {
  title: string
  description: string
  date: string
  code: string
  metadata: { readingTime: number }
  toc: Array<{ title: string; url: string }>
}
type Props = { post: Post; variant: Variant; view: "article" | "index" }

function destination(variant: Variant, view: Props["view"]) {
  return `/prototype/blog?variant=${variant}&view=${view}`
}

function DirectionArt({ variant }: { variant: Variant }) {
  return (
    <figure className="bp-art">
      <svg viewBox="0 0 680 440" role="img" aria-label="Human direction branches away from repeated defaults toward a distinctive possibility">
        <title>Same tools. Different directions.</title>
        <defs>
          <pattern id={`grid-${variant}`} width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M 34 0 L 0 0 0 34" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.13" />
          </pattern>
        </defs>
        <rect width="680" height="440" fill={`url(#grid-${variant})`} />
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.24">
          {[132, 176, 220, 264, 308].map((y) => (
            <g key={y}>
              <path d={`M 48 ${y} H 272 Q 320 ${y} 350 220 H 616`} />
              <rect x="56" y={y - 8} width="16" height="16" />
              <circle cx="610" cy={y} r="8" />
              <path d={`M 350 220 Q 420 ${y} 602 ${y}`} />
            </g>
          ))}
        </g>
        <path className="bp-art-route" d="M 48 220 H 273 C 349 220 328 98 414 98 H 527" fill="none" strokeWidth="5" />
        <path className="bp-art-route" d="m 510 84 18 14-18 14" fill="none" strokeWidth="5" />
        <g className="bp-art-choice">
          <circle cx="307" cy="203" r="24" />
          <path d="m 297 202 7 7 13-15" fill="none" stroke="var(--bp-art-bg)" strokeWidth="3" />
        </g>
        <g className="bp-art-star" transform="translate(572 98)">
          <path d="M 0-34 9-10 34 0 10 9 0 34-9 10-34 0-10-9Z" />
          <circle r="7" fill="var(--bp-art-bg)" />
        </g>
        <g fill="currentColor" fontFamily="monospace" fontSize="11" letterSpacing="2">
          <text x="48" y="370">REPEATED DEFAULTS</text>
          <text x="388" y="58">A DIFFERENT QUESTION</text>
          <text x="336" y="254">HUMAN DIRECTION</text>
        </g>
      </svg>
      <figcaption><span>Fig. 01</span> A point of view changes the path. A conceptual illustration, not measured data.</figcaption>
    </figure>
  )
}

function Byline({ post }: { post: Post }) {
  const date = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(post.date))
  return <div className="bp-byline"><span className="bp-author">Royce</span><span aria-hidden="true">/</span><time dateTime={post.date}>{date}</time><span aria-hidden="true">/</span><span>{Math.ceil(post.metadata.readingTime)} min read</span></div>
}

function Contents({ post }: { post: Post }) {
  return <nav className="bp-contents" aria-label="Essay contents"><p className="bp-label">In this essay</p><ol>{post.toc.map((item, index) => <li key={item.url}><a href={item.url}><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</a></li>)}</ol></nav>
}

function EssayBody({ post }: { post: Post }) {
  return <div className="bp-prose"><Mdx code={post.code} /><div className="bp-end" aria-label="End of essay">✳</div></div>
}

function WritingIndex({ post, variant }: { post: Post; variant: Variant }) {
  return (
    <section className="bp-index" aria-labelledby="bp-index-title">
      <header className="bp-index-heading"><p className="bp-label">Royce / Writing</p><h1 id="bp-index-title">Notes on<br /><em>what comes next.</em></h1><p>Technology, creativity, and the human point of view.</p><span className="bp-count">01 essay</span></header>
      <Link className="bp-post-card" href={destination(variant, "article")}>
        <div className="bp-card-art"><DirectionArt variant={variant} /></div>
        <div className="bp-card-copy"><span className="bp-label">01 / Ideas & technology</span><h2>{post.title}</h2><p>{post.description}</p><Byline post={post} /><span className="bp-read">Read the essay <span aria-hidden="true">↗</span></span></div>
      </Link>
      <p className="bp-index-foot">One essay, an ongoing conversation.</p>
    </section>
  )
}

function Editorial({ post, variant }: { post: Post; variant: Variant }) {
  return <article className="bp-editorial-article"><header className="bp-editorial-opening"><p className="bp-label">Essay 01 / Creativity in the age of AI</p><h1>{post.title}</h1><p className="bp-deck">{post.description}</p><Byline post={post} /></header><DirectionArt variant={variant} /><div className="bp-editorial-reading"><Contents post={post} /><EssayBody post={post} /></div></article>
}

function Fieldnotes({ post, variant }: { post: Post; variant: Variant }) {
  return <article className="bp-notebook"><aside className="bp-notebook-rail"><p className="bp-label">The working notebook</p><span className="bp-notebook-number">N° 001</span><Contents post={post} /><p className="bp-margin-note">An argument for taste,<br />context, and choosing<br />your own direction.</p></aside><div className="bp-notebook-page"><header><p className="bp-label">Filed under / Human & machine</p><h1>{post.title}</h1><p className="bp-deck">{post.description}</p><Byline post={post} /></header><div className="bp-notebook-figure"><span className="bp-handnote">The tool is not the point of view. ↘</span><DirectionArt variant={variant} /></div><EssayBody post={post} /><footer className="bp-notebook-footer">End of note / 001 <span>Keep asking better questions.</span></footer></div></article>
}

function Visual({ post, variant }: { post: Post; variant: Variant }) {
  return <article className="bp-visual-article"><header className="bp-poster"><div className="bp-poster-copy"><p className="bp-label">Human input / Essay 001</p><h1>{post.title}</h1><p className="bp-deck">{post.description}</p><Byline post={post} /></div><div className="bp-poster-image"><span className="bp-poster-mark" aria-hidden="true">↗</span><DirectionArt variant={variant} /><p className="bp-poster-statement">The tools get better.<br /><em>The direction is yours.</em></p></div></header><div className="bp-visual-reading"><div className="bp-visual-aside"><span className="bp-label">Beyond the defaults</span><Contents post={post} /></div><EssayBody post={post} /></div></article>
}

export function BlogPrototype({ post, variant, view }: Props) {
  return <div className={`blog-prototype bp-${variant}`}><div className="bp-topline"><Link href={destination(variant, "index")}>{view === "article" ? "← Back to writing" : "Royce’s notebook"}</Link><span>Writing / {variant}</span></div>{view === "index" ? <WritingIndex post={post} variant={variant} /> : variant === "fieldnotes" ? <Fieldnotes post={post} variant={variant} /> : variant === "visual" ? <Visual post={post} variant={variant} /> : <Editorial post={post} variant={variant} />}</div>
}
