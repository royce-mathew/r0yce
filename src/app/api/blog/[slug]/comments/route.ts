import { auth } from "@/auth"
import { getBlogPost } from "@/lib/blog"
import { MAX_COMMENT_LENGTH } from "@/lib/blog-comments"
import { createBlogComment, listBlogComments } from "@/lib/blog-comments.server"

export const runtime = "nodejs"

const headers = { "Cache-Control": "no-store" }
type Context = { params: Promise<{ slug: string }> }

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers })
}

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params
  if (!getBlogPost(slug)) return json({ error: "Blog not found." }, 404)

  try {
    return json({ comments: await listBlogComments(slug) })
  } catch (error) {
    console.error("Unable to load blog comments:", error)
    return json(
      { error: "Comments are temporarily unavailable. Please try again." },
      503
    )
  }
}

export async function POST(request: Request, context: Context) {
  const { slug } = await context.params
  if (!getBlogPost(slug)) return json({ error: "Blog not found." }, 404)

  const origin = request.headers.get("origin")
  if (
    (origin !== null && origin !== new URL(request.url).origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return json({ error: "Comments must be submitted from this site." }, 403)
  }

  try {
    const session = await auth()
    if (!session?.user?.id) return json({ error: "Sign in to comment." }, 401)

    if (
      request.headers.get("content-type")?.split(";")[0].trim() !==
      "application/json"
    ) {
      return json(
        { error: "Send a JSON object containing a comment body." },
        400
      )
    }

    let input: unknown
    try {
      input = await request.json()
    } catch {
      return json({ error: "Invalid JSON." }, 400)
    }

    if (
      typeof input !== "object" ||
      input === null ||
      !("body" in input) ||
      typeof input.body !== "string"
    ) {
      return json({ error: "Comment body must be a string." }, 400)
    }

    const body = input.body.trim()
    if (body.length === 0 || body.length > MAX_COMMENT_LENGTH) {
      return json(
        { error: `Comments must contain 1–${MAX_COMMENT_LENGTH} characters.` },
        400
      )
    }

    const comment = await createBlogComment(slug, body, {
      id: session.user.id,
      name: session.user.name?.trim() || "Reader",
    })
    return json({ comment }, 201)
  } catch (error) {
    console.error("Unable to create blog comment:", error)
    return json(
      { error: "Your comment could not be saved. Please try again." },
      503
    )
  }
}
