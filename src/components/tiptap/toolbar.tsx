import { useEffect, useState } from "react"
import {
  IconAbc,
  IconBold,
  IconBoldOff,
  IconClearFormatting,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconItalic,
  IconList,
  IconListNumbers,
  IconMath,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react"
import { Level } from "@tiptap/extension-heading"
import { Editor, JSONContent, useEditorState } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Toggle, toggleVariants } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ToolbarProps {
  editor: Editor
  onSaved?: (content: JSONContent) => void
  onCreate?: () => void
  onDeleted?: () => void
}

const triggerClass = "text-xs md:text-sm"
const iconSize = "size-4"

const TooltipHandler = ({
  children,
  content,
}: {
  children: React.ReactNode
  content: string
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent side="bottom">{content}</TooltipContent>
    </Tooltip>
  )
}

const Toolbar = ({ editor, onSaved, onCreate, onDeleted }: ToolbarProps) => {
  const [selectStyle, setSelectStyle] = useState("")
  const [style, setStyle] = useState("p")

  // Set the style of the current block based on select value
  useEffect(() => {
    if (selectStyle === "") return
    const headingLevel =
      selectStyle === "h1"
        ? 1
        : selectStyle === "h2"
          ? 2
          : selectStyle === "h3"
            ? 3
            : null

    if (!headingLevel) {
      // If the selectStyle is a paragraph, set the block to a paragraph
      editor.chain().focus().setParagraph().run()
    } else {
      // Set the block to a heading based on the level
      editor
        .chain()
        .focus()
        .toggleHeading({
          level: headingLevel as Level,
        })
        .run()
    }
  }, [selectStyle, editor])

  const editorState = useEditorState({
    editor,
    // This function will be called every time the editor content changes
    selector: ({ editor }: { editor: Editor }) => ({
      // Get the current character count
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isUnderlined: editor.isActive("underline"),
      isStriked: editor.isActive("strike"),
      isH1: editor.isActive("heading", { level: 1 }),
      isH2: editor.isActive("heading", { level: 2 }),
      isH3: editor.isActive("heading", { level: 3 }),
    }),
  })

  // Set the style of the current block based on the current selection
  useEffect(() => {
    if (!editor) return
    if (editorState.isH1) {
      setStyle("h1")
    } else if (editorState.isH2) {
      setStyle("h2")
    } else if (editorState.isH3) {
      setStyle("h3")
    } else {
      setStyle("p")
    }
  }, [editor, style, editorState])

  return (
    <div className="sticky top-14 z-10 flex h-full flex-row flex-wrap items-center gap-x-2 gap-y-1 bg-background px-1 py-1 shadow-md drop-shadow-lg">
      {/* Menu Bar */}
      <Dialog>
        <Menubar className="max-w-full border-none">
          <MenubarMenu>
            <MenubarTrigger className={triggerClass}>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => {
                  console.log("New Document")
                  onCreate?.()
                }}
              >
                New Document
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  onSaved?.(editor.getJSON())
                }}
              >
                Save Document
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  onDeleted?.()
                }}
              >
                Delete Document
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  editor.commands.print()
                }}
              >
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className={triggerClass}>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                disabled={!editor.can().undo()}
                onClick={() => {
                  editor.commands.undo()
                }}
              >
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                disabled={!editor.can().redo()}
                onClick={() => {
                  editor.commands.redo()
                }}
              >
                Redo
                <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className={triggerClass}>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem asChild>
                <DialogTrigger className="w-full">
                  Document Information
                </DialogTrigger>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* Dialog Content has to be outside the Menubar because items are automatically closed onclick */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Information</DialogTitle>
            <DialogDescription>
              Information about the current document.
            </DialogDescription>
            <div>
              <p className="text-muted-foreground">
                Characters: &nbsp;
                <span className="text-foreground">
                  {editor.storage.characterCount.characters()}
                </span>
              </p>
              <p className="text-muted-foreground">
                Words: &nbsp;
                <span className="text-foreground">
                  {editor.storage.characterCount.words()}
                </span>
              </p>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Select value={style} onValueChange={setSelectStyle}>
        <TooltipHandler content="Change Style">
          <SelectTrigger className="w-[150px]">
            <SelectValue aria-label={style}>
              <div className="flex items-center space-x-2">
                {style === "h1" ? (
                  <IconH1 className={iconSize} />
                ) : style === "h2" ? (
                  <IconH2 className={iconSize} />
                ) : style === "h3" ? (
                  <IconH3 className={iconSize} />
                ) : (
                  <IconAbc className={iconSize} />
                )}
                <span>
                  {style === "h1"
                    ? "Heading 1"
                    : style === "h2"
                      ? "Heading 2"
                      : style === "h3"
                        ? "Heading 3"
                        : "Paragraph"}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
        </TooltipHandler>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Headings</SelectLabel>
            <SelectItem value="h1">
              <div className="flex items-center space-x-3">
                <IconH1 className="size-5" />
                <div className="flex flex-col items-start justify-start">
                  <span>Heading 1</span>
                  <span className="text-xs text-muted-foreground">
                    Used for a top-level heading
                  </span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="h2">
              <div className="flex items-center space-x-3">
                <IconH2 className="size-5" />
                <div className="flex flex-col items-start justify-start">
                  <span>Heading 2</span>
                  <span className="text-xs text-muted-foreground">
                    Used for key sections
                  </span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="h3">
              <div className="flex items-center space-x-3">
                <IconH3 className="size-5" />
                <div className="flex flex-col items-start justify-start">
                  <span>Heading 3</span>
                  <span className="text-xs text-muted-foreground">
                    Used for subsections and group headings
                  </span>
                </div>
              </div>
            </SelectItem>
            <SelectLabel>Text</SelectLabel>
            <SelectItem value="p">
              <div className="flex items-center space-x-3">
                <IconAbc className="size-5" />
                <div className="flex flex-col items-start justify-start">
                  <span>Paragraph</span>
                  <span className="text-xs text-muted-foreground">
                    Used for body text
                  </span>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* Toggles / Popovers */}
      <Separator orientation="vertical" className="h-6" />
      <TooltipHandler content="Bold Text">
        <Toggle
          size="sm"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          pressed={editorState.isBold}
        >
          {editorState.isBold ? (
            <IconBoldOff className={iconSize} />
          ) : (
            <IconBold className={iconSize} />
          )}
        </Toggle>
      </TooltipHandler>
      <TooltipHandler content="Italicize Text">
        <Toggle
          size="sm"
          aria-label="Toggle italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          pressed={editorState.isItalic}
        >
          <IconItalic className={iconSize} />
        </Toggle>
      </TooltipHandler>
      <TooltipHandler content="Underline Text">
        <Toggle
          size="sm"
          aria-label="Toggle underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          pressed={editorState.isUnderlined}
        >
          <IconUnderline className={iconSize} />
        </Toggle>
      </TooltipHandler>
      <TooltipHandler content="Strikethrough Text">
        <Toggle
          size="sm"
          aria-label="Toggle strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          pressed={editorState.isStriked}
        >
          <IconStrikethrough className={iconSize} />
        </Toggle>
      </TooltipHandler>
      {/* Buttons */}
      <Separator orientation="vertical" className="h-6" />

      <TooltipHandler content="Insert Math">
        <Button
          size="sm"
          variant="ghost"
          aria-label="Insert Math"
          className="border"
          onClick={() => {
            const { from, to } = editor.state.selection
            const selectedText =
              editor.state.doc.textBetween(from, to) || "x:=5"
            editor
              .chain()
              .focus()
              .insertContent({
                updateSelection: true,
                type: "inlineMath",
                attrs: { latex: selectedText },
              })
              .run()
          }}
        >
          <IconMath className={iconSize} />
        </Button>
      </TooltipHandler>
      <TooltipHandler content="Insert Code Block">
        <Button
          size="sm"
          variant="ghost"
          aria-label="Insert Code Block"
          className="border"
          onClick={() => {
            editor.chain().focus().setCodeBlock().run()
          }}
        >
          <IconCode className={iconSize} />
        </Button>
      </TooltipHandler>
      <TooltipHandler content="Insert Bullet List">
        <Button
          size="sm"
          variant="ghost"
          aria-label="Insert Bullet List"
          className="border"
          onClick={() => {
            editor.chain().focus().toggleBulletList().run()
          }}
        >
          <IconList className={iconSize} />
        </Button>
      </TooltipHandler>
      <TooltipHandler content="Insert Numbered List">
        <Button
          size="sm"
          variant="ghost"
          aria-label="Insert Numbered List"
          className="border"
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run()
          }}
        >
          <IconListNumbers className={iconSize} />
        </Button>
      </TooltipHandler>
      <TooltipHandler content="Clear Formatting">
        <Button
          size="sm"
          variant="ghost"
          aria-label="Clear Formatting"
          className="border"
          onClick={() => {
            editor.chain().focus().clearNodes().run()
          }}
        >
          <IconClearFormatting className={iconSize} />
        </Button>
      </TooltipHandler>
    </div>
  )
}

export default Toolbar
