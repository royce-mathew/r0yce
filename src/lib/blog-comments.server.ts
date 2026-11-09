import "server-only"
import {
  FieldPath,
  FieldValue,
  Timestamp,
  type DocumentSnapshot,
} from "firebase-admin/firestore"
import type { BlogComment } from "@/lib/blog-comments"
import { firebaseAdminFirestore } from "@/lib/firebase/server"

function commentsCollection(slug: string) {
  return firebaseAdminFirestore
    .collection("blogComments")
    .doc(slug)
    .collection("comments")
}

function toBlogComment(document: DocumentSnapshot): BlogComment {
  const data = document.data()
  if (
    !data ||
    typeof data.body !== "string" ||
    typeof data.author?.id !== "string" ||
    typeof data.author?.name !== "string" ||
    !(data.createdAt instanceof Timestamp)
  ) {
    throw new Error("Invalid stored blog comment")
  }

  return {
    id: document.id,
    body: data.body,
    author: { id: data.author.id, name: data.author.name },
    createdAt: data.createdAt.toDate().toISOString(),
  }
}

export async function listBlogComments(slug: string): Promise<BlogComment[]> {
  const snapshot = await commentsCollection(slug)
    .orderBy("createdAt", "asc")
    .orderBy(FieldPath.documentId(), "asc")
    .get()

  return snapshot.docs.map(toBlogComment)
}

export async function createBlogComment(
  slug: string,
  body: string,
  author: BlogComment["author"]
): Promise<BlogComment> {
  const document = commentsCollection(slug).doc()
  await document.create({
    body,
    author,
    createdAt: FieldValue.serverTimestamp(),
  })
  return toBlogComment(await document.get())
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
