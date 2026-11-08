import type { BlogPost } from "#site/content"

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function BlogByline({ post }: { post: BlogPost }) {
  return (
    <div className="blog-byline">
      <span className="text-foreground">{post.author}</span>
      <span aria-hidden="true">/</span>
      <time dateTime={post.date}>
        {dateFormatter.format(new Date(post.date))}
      </time>
      <span aria-hidden="true">/</span>
      <span>{Math.ceil(post.metadata.readingTime)} min read</span>
    </div>
  )
}
