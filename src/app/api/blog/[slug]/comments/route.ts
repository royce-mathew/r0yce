import { auth } from "@/auth"
import { getBlogPost } from "@/lib/blog"
import { MAX_COMMENT_LENGTH } from "@/lib/blog-comments"
import { createBlogComment, listBlogComments } from "@/lib/blog-comments.server"

export const runtime = "nodejs"

const MAX_COMMENT_PAYLOAD_BYTES = 24 * 1024
const headers = { "Cache-Control": "no-store" }
type Context = { params: Promise<{ slug: string }> }

function json(
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>
) {
  return Response.json(body, {
    status,
    headers: extraHeaders ? { ...headers, ...extraHeaders } : headers,
  })
}

type Payload =
  { ok: true; value: unknown } | { ok: false; status: number; error: string }

/**
 * Reads the JSON body without trusting `Content-Length` and without buffering
 * more than the comment's own size limit, so oversized requests never get
 * parsed.
 */
async function readPayload(request: Request): Promise<Payload> {
  const declared = Number(request.headers.get("content-length") ?? "")
  if (Number.isFinite(declared) && declared > MAX_COMMENT_PAYLOAD_BYTES) {
    return tooLarge()
  }

  if (request.body === null) {
    return {
      ok: false,
      status: 400,
      error: "Send a JSON object containing a comment body.",
    }
  }

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let text = ""
  let bytes = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_COMMENT_PAYLOAD_BYTES) {
        await reader.cancel()
        return tooLarge()
      }
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }

  try {
    return { ok: true, value: JSON.parse(text + decoder.decode()) }
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON." }
  }
}

function tooLarge(): Payload {
  return {
    ok: false,
    status: 413,
    error: `That request was too large. Comments must contain 1–${MAX_COMMENT_LENGTH} characters.`,
  }
}

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params
  if (!getBlogPost(slug)) return json({ error: "Blog not found." }, 404)

  try {
    return json(await listBlogComments(slug))
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

  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return json({ error: "Send a JSON object containing a comment body." }, 400)
  }

  const payload = await readPayload(request)
  if (!payload.ok) return json({ error: payload.error }, payload.status)

  try {
    const session = await auth()
    if (!session?.user?.id) return json({ error: "Sign in to comment." }, 401)

    const input = payload.value
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

    const result = await createBlogComment(slug, body, {
      id: session.user.id,
      name: session.user.name?.trim() || "Reader",
    })

    if (result.status === "rate-limited") {
      return json(
        {
          error: `You're posting too quickly. Try again in ${result.retryAfterSeconds} seconds.`,
        },
        429,
        { "Retry-After": String(result.retryAfterSeconds) }
      )
    }

    return json({ comment: result.comment }, 201)
  } catch (error) {
    console.error("Unable to create blog comment:", error)
    return json(
      { error: "Your comment could not be saved. Please try again." },
      503
    )
  }
}
