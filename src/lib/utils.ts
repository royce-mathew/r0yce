import { clsx, type ClassValue } from "clsx"
import { Timestamp } from "firebase/firestore"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(timestamp: Timestamp) {
  try {
    const date = timestamp.toDate()
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`
    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`
    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`
    interval = Math.floor(seconds / 60)
    if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`
    return "just now"
  } catch (e) {
    return "Never"
  }
}

export function getInitials(name?: string | null) {
  if (!name) return "??"
  var names = name.split(" "),
    initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }
  return initials
}
