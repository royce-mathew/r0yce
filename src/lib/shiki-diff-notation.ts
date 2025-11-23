export interface ShikiDiffNotationOptions {
  classLineAdd?: string
  classLineRemove?: string
  classActivePre?: string
}

export function shikiDiffNotation(options: ShikiDiffNotationOptions = {}) {
  const {
    classLineAdd = "add",
    classLineRemove = "remove",
    classActivePre = "diff",
  } = options

  return {
    name: "shiki-diff-notation",
    code(this: any, node: any) {
      // Only run for code blocks that either have a `diff` meta token
      // (e.g. ```ts diff) or contain + / - at line starts.
      try {
        if (!node || !node.children) return

        const lines = node.children.filter((n: any) => n.type === "element")
        // quick scan to see if any line starts with + or -
        const hasMarkers = lines.some((line: any) => {
          const child = (line.children || []).find(
            (c: any) => c.type === "element"
          )
          if (!child) return false
          const t = (child.children || []).find((x: any) => x.type === "text")
          return !!(t && typeof t.value === "string" && /^[+-]/.test(t.value))
        })

        // If the node has meta and it's not marked `diff` and there are no markers, skip.
        if (!(node.meta && node.meta.diff) && !hasMarkers) return

        // Add wrapper class so CSS can scope to diff blocks
        if (this && this.addClassToHast) {
          this.addClassToHast(this.pre, classActivePre)
        }

        lines.forEach((line: any) => {
          const child = (line.children || []).find(
            (c: any) => c.type === "element"
          )
          if (!child) return
          const textNode = (child.children || []).find(
            (t: any) => t.type === "text"
          )
          if (!textNode || typeof textNode.value !== "string") return

          const value: string = textNode.value
          if (value.startsWith("+")) {
            // strip the marker so copy/paste doesn't include it
            textNode.value = value.slice(1)
            if (this && this.addClassToHast)
              this.addClassToHast(line, classLineAdd)
          } else if (value.startsWith("-")) {
            textNode.value = value.slice(1)
            if (this && this.addClassToHast)
              this.addClassToHast(line, classLineRemove)
          }
        })
      } catch (e) {
        // transformer should never break compilation
      }
    },
  }
}

export default shikiDiffNotation
