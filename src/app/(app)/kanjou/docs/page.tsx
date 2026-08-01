"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconDotsVertical,
  IconFileText,
  IconMath,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"
import {
  addDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Document } from "@/types/document"
import {
  allDocumentsRef,
  documentRef,
  documentsByOwnerRef,
} from "@/lib/converters/document"
import { timeAgo } from "@/lib/utils"
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
import { NumberFlowComponent } from "@/components/ui/number"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import DocumentDialog from "@/components/custom/document-dialog"

const menuItemClass = "w-full justify-start rounded-none px-3 font-normal"

/**
 * One row of the index. Rename state lives here rather than on the page, so
 * opening the dialog on one document can't seed another document's field.
 */
function DocumentRow({
  doc,
  onRename,
  onDelete,
}: {
  doc: Document
  onRename: (id: string | undefined, title: string) => Promise<void>
  onDelete: (id: string | undefined) => Promise<void>
}) {
  const title = doc.metadata.title || "Untitled document"
  const [draftTitle, setDraftTitle] = useState(title)

  return (
    <li className="group relative border-b border-border/40">
      <div className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-x-3 py-4 md:grid-cols-[minmax(0,1fr)_11rem_2.5rem]">
        <Link
          href={`/kanjou/docs/${doc.id}`}
          className="min-w-0 rounded-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        >
          <span className="group-hover:text-gold-ink block truncate font-display text-lg leading-snug transition-colors duration-200 md:text-xl">
            {title}
          </span>
          {/* On phones the timestamp rides under the title instead of in its
              own column. */}
          <span className="mt-1 block font-mono text-[0.7rem] text-muted-foreground tabular-nums md:hidden">
            {timeAgo(doc.metadata.lastOpened)}
          </span>
        </Link>

        <span className="hidden font-mono text-xs text-muted-foreground tabular-nums md:block">
          {timeAgo(doc.metadata.lastOpened)}
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Actions for ${title}`}
              className="size-10 justify-self-end text-muted-foreground hover:text-foreground"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={menuItemClass}
                  onClick={() => setDraftTitle(title)}
                >
                  <IconPencil className="mr-2 size-4" />
                  Rename
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    Rename document
                  </DialogTitle>
                  <DialogDescription>
                    Everyone with the link sees the new name.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label
                    htmlFor={`rename-${doc.id}`}
                    className="label-editorial"
                  >
                    Title
                  </Label>
                  <Input
                    id={`rename-${doc.id}`}
                    className="w-full"
                    placeholder="Untitled document"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={async () =>
                        await onRename(doc.id, draftTitle.trim())
                      }
                    >
                      Save name
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className={menuItemClass}>
                  <IconTrash className="mr-2 size-4" />
                  Delete
                </Button>
              </DialogTrigger>
              {/* Deletion removes the Firestore document outright — there is
                  nothing to undo afterwards, so it gets a confirmation. */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    Delete “{title}”?
                  </DialogTitle>
                  <DialogDescription>
                    The document and its history are removed permanently. Anyone
                    holding the link loses access immediately.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Keep it</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={async () => await onDelete(doc.id)}
                    >
                      Delete permanently
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PopoverContent>
        </Popover>
      </div>
    </li>
  )
}

export default function KanjouDocuments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[] | undefined>()
  const [filter, setFilter] = useState("")

  // Live list of the signed-in user's documents.
  useEffect(() => {
    if (session?.user.id === undefined) return

    return onSnapshot(
      documentsByOwnerRef(session.user.id),
      (snapshot) => setDocuments(snapshot.docs.map((doc) => doc.data()) ?? []),
      () => setDocuments([])
    )
  }, [session?.user.id])

  const sorted = useMemo(() => {
    if (!documents) return undefined
    const needle = filter.trim().toLowerCase()
    return [...documents]
      .sort(
        (a, b) =>
          b.metadata.lastOpened.toMillis() - a.metadata.lastOpened.toMillis()
      )
      .filter((doc) =>
        needle
          ? (doc.metadata.title ?? "").toLowerCase().includes(needle)
          : true
      )
  }, [documents, filter])

  async function createNewDocument(
    documentName: string = "Untitled document",
    content: object = {}
  ) {
    if (session?.user.id === undefined) return
    try {
      const timestamp = Timestamp.now()
      const newDocument = await addDoc(allDocumentsRef(), {
        content,
        owner: session.user.id,
        readAccess: [],
        writeAccess: [],
        metadata: {
          title: documentName,
          created: timestamp,
          lastUpdated: timestamp,
          lastUpdatedBy: session.user.name ?? "Unknown",
          lastOpened: timestamp,
        },
      })

      router.push(`/kanjou/docs/${newDocument.id}`)
    } catch (error) {
      toast(`Could not create the document: ${error}`)
    }
  }

  async function deleteDocument(documentId?: string) {
    if (session?.user.id === undefined) return
    try {
      await deleteDoc(documentRef(documentId))
    } catch (error) {
      toast(`Could not delete the document: ${error}`)
    }
  }

  async function renameDocument(documentId: string | undefined, title: string) {
    if (session?.user.id === undefined) return
    try {
      await updateDoc(documentRef(documentId), {
        metadata: {
          ...documents?.find((doc) => doc.id === documentId)?.metadata,
          title: title || "Untitled document",
        },
      } as Partial<Document>)
    } catch (error) {
      toast(`Could not rename the document: ${error}`)
    }
  }

  // Pull the stored template so a new document opens pre-filled.
  const fetchDocumentContent = async (documentId: string) => {
    try {
      const snapshot = await getDoc(documentRef(documentId))
      return snapshot.exists() ? snapshot.data().content : {}
    } catch {
      toast("Could not load that template — starting from a blank document.")
      return {}
    }
  }

  const total = documents?.length ?? 0
  const loading = status === "loading" || sorted === undefined

  return (
    <main className="container mx-auto flex min-h-screen max-w-5xl flex-col px-6 pt-12 pb-32 md:px-8 md:pt-16">
      {/* ─── Masthead ─── */}
      <header>
        <span className="label-editorial text-gold-ink block">Kanjou</span>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            Documents
          </h1>
          {!loading && total > 0 && (
            <div className="flex items-center gap-2 pb-1 text-muted-foreground">
              <NumberFlowComponent
                className="font-display text-xl text-foreground"
                value={total}
              />
              <span className="label-editorial">
                {total === 1 ? "Document" : "Documents"}
              </span>
            </div>
          )}
        </div>
        <div className="mt-6 h-px w-full bg-border/30" />
      </header>

      {/* ─── Start something ─── */}
      <section className="mt-10">
        <h2 className="label-editorial">Start something</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DocumentDialog
            documentName="Blank document"
            description="An empty page. Markdown shortcuts work from the first keystroke."
            onDialogClose={createNewDocument}
          >
            <IconFileText className="size-5" />
          </DocumentDialog>
          <DocumentDialog
            documentName="Maths preset"
            description="Opens with LaTeX examples — inline, display, and evaluated."
            onDialogClose={async (name) =>
              await createNewDocument(
                name,
                await fetchDocumentContent(
                  process.env.NEXT_PUBLIC_MATH_TEMPLATE_DOC_ID!
                )
              )
            }
          >
            <IconMath className="size-5" />
          </DocumentDialog>
        </div>
      </section>

      {/* ─── The index ─── */}
      <section className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl md:text-3xl">Everything</h2>
          {total > 4 && (
            <div className="w-full sm:w-56">
              <Label htmlFor="filter-documents" className="sr-only">
                Filter documents by title
              </Label>
              <Input
                id="filter-documents"
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by title"
                className="h-10"
              />
            </div>
          )}
        </div>

        {loading ? (
          <ul className="mt-6 border-t border-border/40">
            {[0, 1, 2].map((i) => (
              <li key={i} className="border-b border-border/40 py-5">
                <Skeleton className="h-5 w-1/2 bg-foreground/5" />
              </li>
            ))}
          </ul>
        ) : total === 0 ? (
          <div className="mt-6 border-t border-border/40 py-16 text-center">
            <p className="font-display text-2xl">No documents yet.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A document is a page you can write in and hand to someone else —
              you both type at once, and neither of you overwrites the other.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Pick a starting point above.
            </p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="mt-6 border-t border-border/40 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing matches “{filter.trim()}”.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setFilter("")}
            >
              Clear the filter
            </Button>
          </div>
        ) : (
          <ul className="mt-6 border-t border-border/40">
            {sorted.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                onRename={renameDocument}
                onDelete={deleteDocument}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
