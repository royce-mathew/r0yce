"use client"

import { useEffect, useRef, useState, type SubmitEvent } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  MAX_COMMENT_LENGTH,
  MAX_VISIBLE_COMMENTS,
  type BlogComment,
} from "@/lib/blog-comments"
import { Button } from "@/components/ui/button"
import "./blog-comments.css"

type CommentList = { comments: BlogComment[]; truncated: boolean }

async function responseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null)
  return typeof data?.error === "string" ? data.error : fallback
}

async function fetchComments(
  endpoint: string,
  signal?: AbortSignal
): Promise<CommentList> {
  const response = await fetch(endpoint, { cache: "no-store", signal })
  if (!response.ok)
    throw new Error(await responseError(response, "Could not load comments."))
  const data: { comments: BlogComment[]; truncated?: boolean } =
    await response.json()
  return { comments: data.comments, truncated: data.truncated === true }
}

export function BlogComments({ slug }: { slug: string }) {
  const { data: session, status } = useSession()
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [attempt, setAttempt] = useState(0)
  const [truncated, setTruncated] = useState(false)
  const [draft, setDraft] = useState("")
  const [actionError, setActionError] = useState("")
  const [notice, setNotice] = useState("")
  const [pending, setPending] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const mutationPending = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const deleteButtonRefs = useRef(new Map<string, HTMLButtonElement>())
  const previousConfirmRef = useRef<string | null>(null)
  const endpoint = `/api/blog/${encodeURIComponent(slug)}/comments`
  const callbackUrl = `/blog/${encodeURIComponent(slug)}#comments`

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const data = await fetchComments(endpoint, controller.signal)
        if (!controller.signal.aborted) {
          setComments(data.comments)
          setTruncated(data.truncated)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error ? error.message : "Could not load comments."
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [endpoint, attempt])

  useEffect(() => {
    const previous = previousConfirmRef.current
    previousConfirmRef.current = confirmDelete
    if (confirmDelete) {
      confirmButtonRef.current?.focus()
      return
    }
    if (!previous) return
    // Cancel restores the row's trigger; a completed deletion moves focus to
    // the section heading instead of dropping it with the removed row.
    const trigger = deleteButtonRefs.current.get(previous)
    if (trigger) trigger.focus()
    else headingRef.current?.focus()
  }, [confirmDelete])

  /**
   * Replaces the optimistic list with the server's capped window so the
   * rendered count and the truncation notice stay authoritative.
   */
  async function resyncComments() {
    try {
      const data = await fetchComments(endpoint)
      setComments(data.comments)
      setTruncated(data.truncated)
    } catch {
      // Keep the optimistic list; the next full load will reconcile it.
    }
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (
      mutationPending.current ||
      !draft.trim() ||
      draft.trim().length > MAX_COMMENT_LENGTH
    )
      return
    mutationPending.current = true
    setPending(true)
    setActionError("")
    setNotice("")
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft }),
      })
      if (!response.ok)
        throw new Error(
          await responseError(response, "Could not post your comment.")
        )
      const data: { comment: BlogComment } = await response.json()
      setComments((current) =>
        [...current, data.comment].slice(-MAX_VISIBLE_COMMENTS)
      )
      setDraft("")
      setNotice("Comment posted.")
      await resyncComments()
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not post your comment."
      )
    } finally {
      mutationPending.current = false
      setPending(false)
    }
  }

  async function remove(commentId: string) {
    if (mutationPending.current) return
    mutationPending.current = true
    setPending(true)
    setActionError("")
    setNotice("")
    try {
      const response = await fetch(
        `${endpoint}/${encodeURIComponent(commentId)}`,
        { method: "DELETE" }
      )
      if (!response.ok)
        throw new Error(
          await responseError(response, "Could not delete your comment.")
        )
      setComments((current) =>
        current.filter((comment) => comment.id !== commentId)
      )
      setConfirmDelete(null)
      setNotice("Comment deleted.")
      await resyncComments()
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not delete your comment."
      )
    } finally {
      mutationPending.current = false
      setPending(false)
    }
  }

  return (
    <section
      id="comments"
      className="blog-comments"
      aria-labelledby="blog-comments-heading"
    >
      <h2
        id="blog-comments-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-display"
      >
        Comments
      </h2>
      {loading && <p role="status">Loading comments…</p>}
      {loadError && (
        <div className="blog-comments-error">
          <p role="alert">{loadError}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setLoading(true)
              setLoadError("")
              setAttempt((value) => value + 1)
            }}
          >
            Retry
          </Button>
        </div>
      )}
      {!loading && !loadError && comments.length === 0 && (
        <p>No comments yet. Start the conversation.</p>
      )}
      {comments.length > 0 && truncated && (
        <p className="blog-comments-hint">
          Showing the most recent {MAX_VISIBLE_COMMENTS} comments.
        </p>
      )}
      {comments.length > 0 && (
        <ol className="blog-comments-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <article aria-label={`Comment by ${comment.author.name}`}>
                <header className="blog-comment-byline">
                  <span className="blog-comment-author">
                    {comment.author.name}
                  </span>
                  <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </header>
                <p className="blog-comment-body">{comment.body}</p>
                {session?.user.id === comment.author.id &&
                  (confirmDelete === comment.id ? (
                    <div
                      className="blog-comment-confirm"
                      role="group"
                      aria-label="Confirm comment deletion"
                    >
                      <p>Delete this comment? This cannot be undone.</p>
                      <div className="blog-comments-actions">
                        <Button
                          ref={confirmButtonRef}
                          type="button"
                          variant="destructive"
                          disabled={pending}
                          onClick={() => void remove(comment.id)}
                        >
                          {pending ? "Deleting…" : "Delete comment"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={pending}
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      ref={(node) => {
                        if (node) deleteButtonRefs.current.set(comment.id, node)
                        else deleteButtonRefs.current.delete(comment.id)
                      }}
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onClick={() => setConfirmDelete(comment.id)}
                    >
                      Delete
                    </Button>
                  ))}
              </article>
            </li>
          ))}
        </ol>
      )}
      <div className="blog-comments-feedback">
        {actionError && (
          <p role="alert" className="blog-comments-error">
            {actionError}
          </p>
        )}
        <p role="status">{notice}</p>
      </div>
      {status === "loading" ? (
        <p role="status">Checking sign-in…</p>
      ) : session?.user.id ? (
        <form className="blog-comment-form" onSubmit={submit}>
          <label htmlFor="blog-comment-body">Add a comment</label>
          <p className="blog-comments-hint">
            Posting as {session.user.name || "you"}. Plain text only.
          </p>
          <textarea
            id="blog-comment-body"
            name="body"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={5}
            maxLength={MAX_COMMENT_LENGTH}
            required
            disabled={pending}
            aria-describedby="blog-comment-length"
          />
          <p id="blog-comment-length" className="blog-comments-hint">
            {draft.length} / {MAX_COMMENT_LENGTH} characters
          </p>
          <Button
            type="submit"
            disabled={pending || loading || !!loadError || !draft.trim()}
          >
            {pending ? "Please wait…" : "Post comment"}
          </Button>
        </form>
      ) : (
        <p>
          <Link
            className="link-underline"
            href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Sign in to comment
          </Link>
          . Everyone can read the conversation.
        </p>
      )}
    </section>
  )
}
