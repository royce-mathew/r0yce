export const MAX_COMMENT_LENGTH = 2000
export const MAX_VISIBLE_COMMENTS = 200
export const COMMENT_COOLDOWN_MS = 15_000
export const MAX_COMMENTS_PER_DAY = 20

export type BlogComment = {
  id: string
  body: string
  author: {
    id: string
    name: string
  }
  createdAt: string
}

/** Stored posting allowance for one author on one blog post. */
export type CommentBudget = {
  lastPostedAt: number | null
  dayKey: string | null
  dayCount: number
}

export type CommentAllowance =
  | { allowed: true; dayKey: string; dayCount: number }
  | { allowed: false; retryAfterSeconds: number }

/**
 * Decides whether an author may post right now, and what their allowance looks
 * like afterwards. Pure so the limits stay testable without Firestore.
 */
export function commentAllowance(
  budget: CommentBudget,
  now: number
): CommentAllowance {
  if (budget.lastPostedAt !== null) {
    const waitMs = budget.lastPostedAt + COMMENT_COOLDOWN_MS - now
    if (waitMs > 0) {
      return { allowed: false, retryAfterSeconds: Math.ceil(waitMs / 1000) }
    }
  }

  const dayKey = new Date(now).toISOString().slice(0, 10)
  const dayCount = budget.dayKey === dayKey ? budget.dayCount : 0
  if (dayCount >= MAX_COMMENTS_PER_DAY) {
    return { allowed: false, retryAfterSeconds: secondsUntilNextUtcDay(now) }
  }

  return { allowed: true, dayKey, dayCount: dayCount + 1 }
}

function secondsUntilNextUtcDay(now: number): number {
  const date = new Date(now)
  const nextDay = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + 1
  )
  return Math.max(1, Math.ceil((nextDay - now) / 1000))
}
