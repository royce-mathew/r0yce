import { useEffect, useState } from "react"
import {
  IconAbc,
  IconBold,
  IconBoldOff,
  IconH1,
  IconH2,
  IconH3,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react"
import { Level } from "@tiptap/extension-heading"
import { Editor, JSONContent } from "@tiptap/react"

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
import { Separator } from "@/components/ui/separator"
import { Toggle, toggleVariants } from "@/components/ui/toggle"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export interface ToolbarProps {
  editor?: Editor | null
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
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}

const Toolbar = ({ editor, onSaved, onCreate, onDeleted }: ToolbarProps) => {
  const [style, setStyle] = useState("")

  // Set the style of the current block based on the selection
  useEffect(() => {
    if (!editor) return
    const headingLevel = style.startsWith("h") ? parseInt(style[1]) : undefined

    // If the style is a paragraph, set the block to a paragraph
    if (!headingLevel) {
      editor.chain().focus().setParagraph().run()
      return
    }

    // Set the block to a heading based on the level
    editor
      .chain()
      .focus()
      .toggleHeading({
        level: headingLevel as Level,
      })
      .run()
  }, [style, editor])

  if (!editor) return null
  return (
    <div className="flex flex-row flex-wrap items-center space-x-2 shadow-md drop-shadow-lg">
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
      <Separator orientation="vertical" />
      <Select
        value={
          editor?.isActive("heading", { level: 1 })
            ? "h1"
            : editor?.isActive("heading", { level: 2 })
              ? "h2"
              : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : editor?.isActive("paragraph")
                  ? "p"
                  : style
        }
        onValueChange={setStyle}
      >
        <TooltipHandler content="Change Style">
          <SelectTrigger className="w-[140px]">
            <SelectValue aria-label={style}>
              {editor?.isActive("heading", { level: 1 }) && "Heading 1"}
              {editor?.isActive("heading", { level: 2 }) && "Heading 2"}
              {editor?.isActive("heading", { level: 3 }) && "Heading 3"}
              {editor?.isActive("paragraph") && "Paragraph"}
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
                  <span className="text-muted-foreground text-xs">
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
                  <span className="text-muted-foreground text-xs">
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
                  <span className="text-muted-foreground text-xs">
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
                  <span className="text-muted-foreground text-xs">
                    Used for body text
                  </span>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* Toggles / Popovers */}
      <TooltipHandler content="Bold Text">
        <Toggle
          size="sm"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}
        >
          {editor.isActive("bold") ? (
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
          pressed={editor.isActive("italic")}
        >
          <IconItalic className={iconSize} />
        </Toggle>
      </TooltipHandler>
      <TooltipHandler content="Underline Text">
        <Toggle
          size="sm"
          aria-label="Toggle underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          pressed={editor.isActive("underline")}
        >
          <IconUnderline className={iconSize} />
        </Toggle>
      </TooltipHandler>
      <TooltipHandler content="Strikethrough Text">
        <Toggle
          size="sm"
          aria-label="Toggle strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          pressed={editor.isActive("strike")}
        >
          <IconStrikethrough className={iconSize} />
        </Toggle>
      </TooltipHandler>
    </div>
  )
}

export default Toolbar
