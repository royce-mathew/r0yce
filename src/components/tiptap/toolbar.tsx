import {
  IconBold,
  IconBoldOff,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export interface ToolbarProps {
  editor?: Editor | null
  onSaved?: (content: JSONContent) => void
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

const Toolbar = ({ editor, onSaved, onDeleted }: ToolbarProps) => {
  if (!editor) return null

  return (
    <div className="flex flex-row flex-wrap items-center space-x-2 shadow-md drop-shadow-lg">
      {/* Menu Bar */}
      <Menubar className="max-w-full border-none">
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onClick={() => {
                onSaved?.(editor.getJSON())
              }}
            >
              Save Document <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                onDeleted?.()
              }}
            >
              Delete Document
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
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
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Search the web</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Find...</MenubarItem>
                <MenubarItem>Find Next</MenubarItem>
                <MenubarItem>Find Previous</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Separator orientation="vertical" />
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
