"use client"

/* Hallmark · genre: editorial · macrostructure: Long Document · design-system: design.md · designed-as-app
 * The document is the page. A quiet chrome band (back · title · state · share)
 * sits above a sheet; the formatting rail sticks beneath the site header.
 * motion: none — a writing surface should not move under the writer
 * pre-emit critique: P5 H5 E4 S5 R5 V4
 */
import { use, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {
  IconArrowLeft,
  IconCheck,
  IconLink,
  IconPointFilled,
} from "@tabler/icons-react"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCaret from "@tiptap/extension-collaboration-caret"
import { useSession } from "next-auth/react"
import objectHash from "object-hash"
import { toast } from "sonner"
import * as Y from "yjs"
import { DocumentMetadata } from "@/types/document"
import { firebaseApp } from "@/lib/firebase/client"
import { timeAgo } from "@/lib/utils"
import { FireProvider } from "@/lib/y-fire"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/nav/error"
import { yProvider } from "@/components/tiptap/providers/firebase-sync"

const TipTap = dynamic(() => import("@/components/tiptap/tiptap"), {
  ssr: false,
})

function DocumentSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-2/3 bg-foreground/5" />
      <Skeleton className="h-4 w-40 bg-foreground/5" />
      <Skeleton className="h-[60vh] w-full bg-foreground/5" />
    </div>
  )
}

export default function KanjouDocument(props: {
  params: Promise<{ slug: string }>
}) {
  const params = use(props.params)
  const { data: session } = useSession()
  const provider = useRef<FireProvider | undefined>(undefined)
  const [access, setAccess] = useState<boolean | undefined>()
  const [saving, setSaving] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<
    Partial<DocumentMetadata> | undefined
  >()
  const yDoc = useRef<Y.Doc | undefined>(undefined)
  const hash = useRef<Y.Map<unknown> | undefined>(undefined)
  // The provider lives in a ref, so its arrival has to be mirrored into state —
  // otherwise the first render after the effect has no reason to re-run.
  const [providerReady, setProviderReady] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  // Fetch the document
  useEffect(() => {
    // Validate Slug and User
    if (params.slug === undefined) return
    if (session?.user.id === undefined || session?.user.id === null) return

    // Get the initial Document Metadata and merge it with the unsavedMetadata
    yDoc.current = new Y.Doc()
    yDoc.current.meta = {}

    hash.current = yDoc.current.getMap("meta")

    // Create a Yjs provider
    provider.current = yProvider({
      firebaseApp: firebaseApp,
      path: `documents/${params.slug}`,
      ydoc: yDoc.current,
    })

    provider.current.onSaving = (status: boolean) => {
      setSaving(status)
    }

    provider.current.onSetMetadata = (metadata: Partial<DocumentMetadata>) => {
      setMetadata(metadata)
    }

    // User does not have access to the document
    provider.current.onDeleted = () => {
      setAccess(false)
    }

    setProviderReady(true)
  }, [params.slug, session?.user.id])

  useEffect(() => {
    if (metadata === undefined || !provider.current) return

    // The lastUpdated field is always changing
    const generatedHash = objectHash({
      ...metadata,
      lastUpdated: null,
    })
    // Check if the metadata has changed
    if (!hash.current || hash.current.get("hash") === generatedHash) return

    // Update the hash
    hash.current?.set("hash", generatedHash)
    // Update the metadata
    provider.current.metadata = metadata
  }, [metadata])

  if (access === false) {
    return (
      <main className="container flex min-h-screen items-center justify-center">
        <ErrorBoundary
          error={new Error("You do not have access to this document")}
          rerouteUrl="/kanjou/docs"
        />
      </main>
    )
  }

  const ready = providerReady && Boolean(provider.current && session?.user.id)

  function updateTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setMetadata({
      ...metadata,
      title: e.target.value,
    })
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href)
      toast("Link copied. Anyone signed in can open this document.")
    } catch {
      toast("Couldn’t reach the clipboard — copy the address bar instead.")
    }
  }

  return (
    <main className="container mx-auto flex min-h-screen max-w-4xl flex-col px-6 pt-8 pb-32 md:px-8 md:pt-10">
      {!ready ? (
        <DocumentSkeleton />
      ) : (
        <>
          {/* ─── Document chrome ─── */}
          <div className="mb-6">
            <Link
              href="/kanjou/docs"
              className="link-underline inline-flex min-h-8 items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
            >
              <IconArrowLeft className="size-3.5" />
              <span className="whitespace-nowrap">All documents</span>
            </Link>

            <Label htmlFor="document-title" className="sr-only">
              Document title
            </Label>
            <Input
              id="document-title"
              className="mt-3 h-auto border-none bg-transparent px-0 py-1 font-display text-3xl leading-tight shadow-none md:text-4xl"
              value={metadata?.title ?? ""}
              onChange={updateTitle}
              placeholder="Untitled document"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] text-muted-foreground">
                {/* Saving state. The old label read "Unsaved" while a save was
                    in flight, which said the opposite of what was happening. */}
                <span className="flex items-center gap-1">
                  {saving ? (
                    <>
                      <IconPointFilled className="text-gold-ink size-3" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <IconCheck className="size-3" />
                      Saved
                    </>
                  )}
                </span>
                <span aria-hidden className="text-border">
                  /
                </span>
                <span className="tabular-nums">
                  Edited {timeAgo(provider.current?.metadata?.lastUpdated)}
                </span>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="min-h-9">
                    <IconLink className="mr-1.5 size-3.5" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">
                      Share this document
                    </DialogTitle>
                    <DialogDescription>
                      Anyone signed in who has the link can open and edit this
                      document. You will see their cursor in the page while they
                      type.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2">
                    <Label htmlFor="document-link" className="label-editorial">
                      Document link
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="document-link"
                        readOnly
                        value={shareUrl}
                        className="h-10 font-mono text-xs"
                        onFocus={(e) => e.currentTarget.select()}
                      />
                      <Button className="h-10 shrink-0" onClick={copyLink}>
                        Copy link
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-5 h-px w-full bg-border/30" />
          </div>

          <TipTap
            passedExtensions={[
              Collaboration.configure({
                document: provider.current!.doc ?? new Y.Doc(),
              }),
              CollaborationCaret.configure({
                provider: provider.current!,
                user: {
                  name: session?.user.name ?? "Unknown",
                },
              }),
            ]}
          />
        </>
      )}
    </main>
  )
}
