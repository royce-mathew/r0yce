import "server-only"
import {
  FieldPath,
  Timestamp,
  type DocumentSnapshot,
} from "firebase-admin/firestore"
import {
  commentAllowance,
  MAX_VISIBLE_COMMENTS,
  type BlogComment,
  type CommentBudget,
} from "@/lib/blog-comments"
import { firebaseAdminFirestore } from "@/lib/firebase/server"

function postDocument(slug: string) {
  return firebaseAdminFirestore.collection("blogComments").doc(slug)
}

function commentsCollection(slug: string) {
  return postDocument(slug).collection("comments")
}

function toBlogComment(document: DocumentSnapshot): BlogComment | null {
  const data = document.data()
  if (
    !data ||
    typeof data.body !== "string" ||
    typeof data.author?.id !== "string" ||
    typeof data.author?.name !== "string" ||
    !(data.createdAt instanceof Timestamp)
  ) {
    console.warn(`Skipping malformed blog comment at ${document.ref.path}`)
    return null
  }

  return {
    id: document.id,
    body: data.body,
    author: { id: data.author.id, name: data.author.name },
    createdAt: data.createdAt.toDate().toISOString(),
  }
}

export type BlogCommentList = {
  comments: BlogComment[]
  truncated: boolean
}

export async function listBlogComments(slug: string): Promise<BlogCommentList> {
  const snapshot = await commentsCollection(slug)
    .orderBy("createdAt", "desc")
    .orderBy(FieldPath.documentId(), "desc")
    .limit(MAX_VISIBLE_COMMENTS + 1)
    .get()

  const comments = snapshot.docs
    .slice(0, MAX_VISIBLE_COMMENTS)
    .map(toBlogComment)
    .filter((comment): comment is BlogComment => comment !== null)
    .reverse()

  return { comments, truncated: snapshot.docs.length > MAX_VISIBLE_COMMENTS }
}

export type CreateBlogCommentResult =
  | { status: "created"; comment: BlogComment }
  | { status: "rate-limited"; retryAfterSeconds: number }

export async function createBlogComment(
  slug: string,
  body: string,
  author: BlogComment["author"]
): Promise<CreateBlogCommentResult> {
  const comment = commentsCollection(slug).doc()
  const budget = postDocument(slug).collection("commenters").doc(author.id)

  return firebaseAdminFirestore.runTransaction(async (transaction) => {
    const stored = await transaction.get(budget)
    const now = Timestamp.now()
    const allowance = commentAllowance(
      readBudget(stored.data()),
      now.toMillis()
    )
    if (!allowance.allowed) {
      return {
        status: "rate-limited",
        retryAfterSeconds: allowance.retryAfterSeconds,
      }
    }

    transaction.set(comment, { body, author, createdAt: now })
    transaction.set(budget, {
      lastPostedAt: now,
      dayKey: allowance.dayKey,
      dayCount: allowance.dayCount,
    })

    return {
      status: "created",
      comment: {
        id: comment.id,
        body,
        author,
        createdAt: now.toDate().toISOString(),
      },
    }
  })
}

function readBudget(data: Record<string, unknown> | undefined): CommentBudget {
  return {
    lastPostedAt:
      data?.lastPostedAt instanceof Timestamp
        ? data.lastPostedAt.toMillis()
        : null,
    dayKey: typeof data?.dayKey === "string" ? data.dayKey : null,
    dayCount: typeof data?.dayCount === "number" ? data.dayCount : 0,
  }
}

export async function deleteBlogComment(
  slug: string,
  commentId: string,
  authorId: string
): Promise<"deleted" | "not-found" | "forbidden"> {
  const document = commentsCollection(slug).doc(commentId)

  return firebaseAdminFirestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(document)
    if (!snapshot.exists) return "not-found"
    if (snapshot.get("author.id") !== authorId) return "forbidden"

    transaction.delete(document)
    return "deleted"
  })
}
