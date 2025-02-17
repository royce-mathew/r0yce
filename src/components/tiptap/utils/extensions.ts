import { MathExtension } from "@aarkue/tiptap-math-extension"
import { Editor } from "@tiptap/core"
import Blockquote from "@tiptap/extension-blockquote"
import Bold from "@tiptap/extension-bold"
import BulletList from "@tiptap/extension-bullet-list"
import CharacterCount from "@tiptap/extension-character-count"
import Code from "@tiptap/extension-code"
import Document from "@tiptap/extension-document"
import Heading from "@tiptap/extension-heading"
import History from "@tiptap/extension-history"
import Italic from "@tiptap/extension-italic"
import Link from "@tiptap/extension-link"
import ListItem from "@tiptap/extension-list-item"
import OrderedList from "@tiptap/extension-ordered-list"
import Paragraph from "@tiptap/extension-paragraph"
import Placeholder from "@tiptap/extension-placeholder"
import Strike from "@tiptap/extension-strike"
import Text from "@tiptap/extension-text"
import Typography from "@tiptap/extension-typography"
import Underline from "@tiptap/extension-underline"
import { Node } from "@tiptap/pm/model"
import { Extensions } from "@tiptap/react"
import { CodeBlockShiki } from "../extensions/code"
import { Indent } from "../extensions/indent"
import { Print } from "../extensions/print"

export const extensions: Extensions = [
  Indent,
  Document,
  Paragraph,
  Blockquote,
  Text,
  Typography,
  Heading.configure({ levels: [1, 2, 3, 4] }),
  Bold.configure({ HTMLAttributes: { class: "font-bold" } }),
  Italic,
  Strike,
  Underline,
  Code,
  CodeBlockShiki,
  CharacterCount,
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal",
    },
  }),
  ListItem,
  Link,
  //   History,
  MathExtension.configure({ evaluation: true }),
  Placeholder.configure({
    includeChildren: true,
    placeholder: ({
      editor,
      node,
      pos,
      hasAnchor,
    }: {
      editor: Editor
      node: Node
      pos: number
      hasAnchor: boolean
    }) => {
      if (editor.isActive("table")) return "List"
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`
      }
      return "Start Writing..."
    },
  }),
  Print,
]
