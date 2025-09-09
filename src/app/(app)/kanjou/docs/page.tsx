"use client"

import { useEffect, useState } from "react"
import { Metadata } from "next"
import Link from "next/link"
import {
  IconAbc,
  IconDotsVertical,
  IconMath,
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
import { Document, DocumentMetadata } from "@/types/document"
import {
  allDocumentsRef,
  documentRef,
  documentsByOwnerRef,
} from "@/lib/converters/document"
import { cn, timeAgo } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import DocumentDialog from "@/components/custom/document-dialog"

const popoverButtonClass = "w-full p-0 mr-10 rounded-none"
const popoverIconClass = "mr-6 size-5"

export default function Kanjou() {
  const { data: session } = useSession()
  const [rename, setRename] = useState<string>("")
  const [documents, setDocuments] = useState<Document[] | undefined>()

  // Fetch the user's documents
  useEffect(() => {
    if (session?.user.id === undefined) return

    return onSnapshot(
      documentsByOwnerRef(session.user.id),
      (snapshot) => {
        setDocuments(snapshot.docs.map((doc) => doc.data()) ?? [])
      },
      (error) => {
        // User has no documents
        console.log("User does not have any documents: ", error)
      }
    )
  }, [session?.user.id])

  async function createNewDocument(
    documentName: string = "Untitled Document",
    content: any = {}
  ) {
    if (session?.user.id === undefined) return
    try {
      const timestamp = Timestamp.now()
      // Create a new document
      const newDocument = await addDoc(allDocumentsRef(), {
        content: content,
        owner: session.user.id,
        readAccess: [],
        writeAccess: [],
        metadata: {
          title: documentName,
          created: timestamp,
          lastUpdated: timestamp,
          lastUpdatedBy: session?.user.name!,
          lastOpened: timestamp,
        },
      })

      // Notify the user
      toast("Created new document")

      // Redirect to the new document
      window.location.href = `/kanjou/docs/${newDocument.id}`
    } catch (error) {
      toast(`Error creating document: ${error}`)
    }
  }

  async function deleteDocument(documentId?: string) {
    if (session?.user.id === undefined) return
    try {
      // Delete the document
      await deleteDoc(documentRef(documentId))

      // Notify the user
      toast("Deleted document")
    } catch (error) {
      toast(`Error deleting document: ${error}`)
    }
  }

  async function renameDocument(documentId: string | undefined, title: string) {
    if (session?.user.id === undefined) return
    try {
      // Update the document
      await updateDoc(documentRef(documentId), {
        metadata: {
          ...documents?.find((doc) => doc.id === documentId)?.metadata,
          title,
        },
      } as Partial<Document>)

      // Notify the user
      toast("Renamed document")
    } catch (error) {
      toast(`Error renaming document: ${error}`)
    }
  }

  // Retrieve a specific document from firestore and get its content field which is a blob
  const fetchDocumentContent = async (documentId: string) => {
    try {
      const docSnap = await getDoc(documentRef(documentId))
      if (docSnap.exists()) {
        const contentBlob = docSnap.data().content
        console.log("Document data:", contentBlob)
        return contentBlob
      } else {
        console.error("Document does not exist")
      }
    } catch (error) {
      console.error("Error fetching document content:", error)
    }
  }

  return (
    <main className="container flex min-h-screen flex-col pb-52">
      {/* Create a new Document */}
      <div>
        <h1 className="my-4 text-xl font-bold">Start a new Document</h1>
        {/* Types of Documents with pre filled content */}
        <ScrollArea className="h-max">
          <div className="flex w-max space-x-5">
            {/* Button to create new Document */}
            {/* Blank Document */}
            <DocumentDialog
              documentName="Blank Document"
              onDialogClose={createNewDocument}
            >
              <IconAbc className="size-12" />
            </DocumentDialog>
            <DocumentDialog
              documentName="Math Preset"
              onDialogClose={async (rename) =>
                await createNewDocument(
                  rename,
                  await fetchDocumentContent(
                    process.env.NEXT_PUBLIC_MATH_TEMPLATE_DOC_ID! // The ID of the math template document
                  )
                )
              }
            >
              <IconMath className="size-12" />
            </DocumentDialog>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <Separator className="my-5" />

      {/* All Documents */}
      <div>
        <h1 className="mb-5 text-2xl font-bold">All documents</h1>
        {!documents ? (
          <Skeleton className="h-20 w-full bg-foreground/5" />
        ) : (
          <div className="flex size-full flex-wrap gap-4">
            {documents.length === 0 && (
              <div className="mt-16 w-full text-center text-xl text-muted-foreground">
                No documents found
              </div>
            )}
            {[...documents]
              .sort(
                (a, b) =>
                  b.metadata.lastOpened.toMillis() -
                  a.metadata.lastOpened.toMillis()
              )
              .map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex h-fit min-w-48 flex-1 flex-col justify-between border-border bg-foreground/5 p-2"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <Link
                      className="flex-1 overflow-hidden text-left"
                      href={`/kanjou/docs/${doc.id}`}
                    >
                      <p className="truncate text-sm font-bold">
                        {doc.metadata.title ?? "Untitled Document"}
                      </p>
                    </Link>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="icon"
                          className="ml-1 h-auto flex-shrink-0 px-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconDotsVertical className="size-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-fit flex-col justify-start p-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className={popoverButtonClass}
                              onClick={() =>
                                setRename(doc.metadata.title ?? "")
                              }
                            >
                              <IconAbc className={popoverIconClass} />
                              Rename
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rename</DialogTitle>
                              <DialogDescription>
                                Rename the file to something more descriptive
                              </DialogDescription>
                            </DialogHeader>
                            <div>
                              <Input
                                className="w-full"
                                placeholder="Document Name"
                                value={rename}
                                onChange={(e) => setRename(e.target.value)}
                              />
                              <DialogClose asChild>
                                <Button
                                  className="mt-4"
                                  onClick={async () =>
                                    await renameDocument(doc.id, rename)
                                  }
                                >
                                  Rename
                                </Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => deleteDocument(doc.id)}
                          variant="ghost"
                          className={popoverButtonClass}
                        >
                          <IconTrash className={popoverIconClass} />
                          Remove
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Link className="mt-1 w-full" href={`/kanjou/docs/${doc.id}`}>
                    <p className="truncate text-[.7rem] font-thin text-muted-foreground">
                      Updated {timeAgo(doc.metadata.lastOpened)}
                    </p>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  )
}
