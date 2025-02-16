"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  IconAbc,
  IconCirclePlus,
  IconDotsVertical,
  IconTrash,
} from "@tabler/icons-react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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
import { userRef } from "@/lib/converters/user"
import { auth, db } from "@/lib/firebase/client"
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

  async function createNewDocument(documentName: string = "Untitled Document") {
    if (session?.user.id === undefined) return
    try {
      const timestamp = Timestamp.now()
      // Create a new document
      await addDoc(allDocumentsRef(), {
        content: {},
        owner: session.user.id,
        readAccess: [],
        writeAccess: [],
        metadata: {
          title: documentName,
          created: timestamp,
          lastUpdated: timestamp,
          lastUpdatedBy: session?.user.name ?? "Main User",
          lastOpened: timestamp,
        },
      })

      // Notify the user
      toast("Created new document")
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

  return (
    <main className="container flex min-h-screen flex-col pb-52">
      {/* Create a new Document */}
      <div>
        <h1 className="my-4 text-xl font-bold">Start a new Document</h1>
        {/* Types of Documents with pre filled content */}
        <ScrollArea className="h-max">
          <div className="flex w-max space-x-5">
            {/* Button to create new Document */}
            <div className="flex h-56 w-44 flex-col items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="size-full rounded bg-foreground/5 p-2"
                    onClick={() => setRename("")}
                  >
                    <IconCirclePlus className="size-12" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Document</DialogTitle>
                    <DialogDescription>
                      Create a new document with a blank slate
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
                        onClick={async () => await createNewDocument(rename)}
                      >
                        Create
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="mt-1 text-sm">Blank Document</div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div>
        <h1 className="my-10 text-2xl font-bold">All documents</h1>
        {!documents ? (
          <Skeleton className="h-20 w-full bg-foreground/5" />
        ) : (
          <div className="flex size-full flex-wrap gap-4">
            {documents.length === 0 && (
              <div className="mt-16 w-full text-center text-xl text-muted-foreground">
                No documents found
              </div>
            )}
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex h-fit min-w-48 flex-1 flex-col justify-end border-border bg-foreground/5 p-2"
                )}
              >
                <div className="w-full text-left">
                  <Link
                    className="size-full bg-background"
                    href={`/kanjou/${doc.id}`}
                  >
                    <p className="truncate pt-1 text-sm font-bold">
                      {doc.metadata.title ?? "Untitled Document"}
                    </p>
                  </Link>
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[.7rem] font-thin text-muted-foreground">
                      Updated {timeAgo(doc.metadata.lastOpened)}
                    </p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="icon" className="ml-2 px-0">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
