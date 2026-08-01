import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DocumentDialogProps {
  /** Template name, e.g. "Blank document". Also the default title. */
  documentName: string
  /** One line on what the template gives you. */
  description: string
  onDialogClose: (documentName: string) => Promise<void>
  children: React.ReactNode
}

/**
 * A new-document action. Reads as a typographic entry in a row of choices
 * rather than an icon tile — the icon sits inline with the name, not stacked
 * above it in a square.
 */
const DocumentDialog: React.FC<DocumentDialogProps> = ({
  documentName,
  description,
  onDialogClose,
  children,
}) => {
  const [title, setTitle] = useState<string>("")
  const [creating, setCreating] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={() => setTitle("")}
          className="group flex min-h-11 w-full items-start gap-3 rounded-sm border border-border/60 bg-surface px-4 py-4 text-left transition-colors duration-200 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        >
          <span className="text-gold-ink mt-0.5 shrink-0">{children}</span>
          <span className="min-w-0">
            <span className="block font-display text-lg leading-tight">
              {documentName}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              {description}
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            New document
          </DialogTitle>
          <DialogDescription>
            Starting from the {documentName.toLowerCase()}. You can rename it
            later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="new-document-title" className="label-editorial">
            Title
          </Label>
          <Input
            id="new-document-title"
            className="w-full"
            placeholder={documentName}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={creating}
              onClick={async () => {
                setCreating(true)
                try {
                  await onDialogClose(title.trim() || documentName)
                } finally {
                  setCreating(false)
                }
              }}
            >
              {creating ? "Creating…" : "Create document"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentDialog
