export const MAX_COMMENT_LENGTH = 2000

export type BlogComment = {
  id: string
  body: string
  author: {
    id: string
    name: string
  }
  createdAt: string
}
