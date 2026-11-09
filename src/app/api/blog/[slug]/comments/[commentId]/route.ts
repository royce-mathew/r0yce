import { auth } from "@/auth"
import { getBlogPost } from "@/lib/blog"
import { deleteBlogComment } from "@/lib/blog-comments.server"

export const runtime = "nodejs"

const headers = { "Cache-Control": "no-store" }
type Context = { params: Promise<{ slug: string; commentId: string }> }

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers })
}

export async function DELETE(request: Request, context: Context) {
  const { slug, commentId } = await context.params
  if (!getBlogPost(slug)) return json({ error: "Blog not found." }, 404)
  if (!/^[A-Za-z0-9]{20}$/.test(commentId)) {
    return json({ error: "Invalid comment ID." }, 400)
  }

  const origin = request.headers.get("origin")
  if (
    (origin !== null && origin !== new URL(request.url).origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return json({ error: "Comments must be deleted from this site." }, 403)
  }

  try {
    const session = await auth()
    if (!session?.user?.id)
      return json({ error: "Sign in to delete a comment." }, 401)

    const result = await deleteBlogComment(slug, commentId, session.user.id)
    if (result === "not-found")
      return json({ error: "Comment not found." }, 404)
    if (result === "forbidden") {
      return json({ error: "You can only delete your own comments." }, 403)
    }

    return new Response(null, { status: 204, headers })
  } catch (error) {
    console.error("Unable to delete blog comment:", error)
    return json(
      { error: "Your comment could not be deleted. Please try again." },
      503
    )
  }
}
