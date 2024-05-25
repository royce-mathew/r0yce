"use client"

import { Extension } from "@tiptap/core"
import { EditorContent, JSONContent, useEditor } from "@tiptap/react"

import Toolbar from "./toolbar"

import "@/styles/tiptap.css"

import { extensions } from "./utils/extensions"

export interface TiptapProps {
  onChange?: (content: JSONContent) => void
  onSaved?: (content: JSONContent) => void
  onDeleted?: () => void
  initialContent?: JSONContent | undefined
  passedExtensions?: Extension[]
}

const proseCode =
  "prose-code:before:content-none prose-code:after:content-none prose-code:px-2 prose-code:bg-foreground/10 prose-code:rounded prose-code:font-normal"

const Tiptap = ({ passedExtensions }: TiptapProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-lg prose-ul:list-[revert] ${proseCode} focus:outline-none p-3 max-w-full min-h-[1400px]`,
      },
    },
    extensions: [...extensions, ...(passedExtensions ?? [])],
  })

  // Update the editor content when the initial text changes
  // useEffect(() => {
  //   if (!initialContent) return
  //   console.log("Setting initial content")
  //   editor?.commands.setContent(initialContent)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [initialContent])

  return (
    <div className="bg-foreground/5 rounded border-2">
      <Toolbar editor={editor} />
      <EditorContent className="whitespace-pre-line" editor={editor} />
    </div>
  )
}

export default Tiptap
