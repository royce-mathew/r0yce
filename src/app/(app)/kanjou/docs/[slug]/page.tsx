"use client"

import { use, useEffect, useRef, useState, useSyncExternalStore } from "react"
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

// The server has no current URL. The client fills this in after hydration.
const subscribeToLocation = () => () => {}
const getServerLocation = () => ""

function getBrowserLocation() {
  return window.location.href
}

function useShareUrl() {
  return useSyncExternalStore(
    subscribeToLocation,
    getBrowserLocation,
    getServerLocation
  )
}

type DocumentEditorProps = {
  slug: string
  userName: string
}

export default function KanjouDocument(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(props.params)
  const { data: session } = useSession()
  const userId = session?.user.id

  if (!userId) {
    return (
      <main className="container mx-auto flex min-h-screen max-w-4xl flex-col px-6 pt-8 pb-32 md:px-8 md:pt-10">
        <DocumentSkeleton />
      </main>
    )
  }

  // Navigating between documents must not show the previous title, save state, or provider.
  return (
    <DocumentEditor
      key={`${slug}:${userId}`}
      slug={slug}
      userName={session.user.name ?? "Unknown"}
    />
  )
}

function DocumentEditor({ slug, userName }: DocumentEditorProps) {
  const providerRef = useRef<FireProvider | undefined>(undefined)
  const hash = useRef<Y.Map<unknown> | undefined>(undefined)
  const [provider, setProvider] = useState<FireProvider>()
  const [access, setAccess] = useState<boolean>()
  const [saving, setSaving] = useState(false)
  const [metadata, setMetadata] = useState<Partial<DocumentMetadata>>()
  const shareUrl = useShareUrl()

  // The provider updates the UI through callbacks after it receives Firestore data.
  useEffect(() => {
    const yDoc = new Y.Doc()
    yDoc.meta = {}
    hash.current = yDoc.getMap("meta")

    const nextProvider = yProvider({
      firebaseApp,
      path: `documents/${slug}`,
      ydoc: yDoc,
    })
    providerRef.current = nextProvider

    nextProvider.onReady = () => {
      setProvider(nextProvider)
    }
    nextProvider.onSaving = setSaving
    nextProvider.onSetMetadata = setMetadata
    nextProvider.onDeleted = () => {
      setAccess(false)
    }

    // The provider holds Firestore listeners, WebRTC peers and a beforeunload
    // handler. Tear everything down before opening the next document.
    return () => {
      nextProvider.destroy()
      if (providerRef.current === nextProvider) {
        providerRef.current = undefined
      }
      yDoc.destroy()
      hash.current = undefined
    }
  }, [slug])

  useEffect(() => {
    if (metadata === undefined) return
    const activeProvider = providerRef.current
    if (activeProvider === undefined) return

    // lastUpdated changes on every save, so it is excluded from loop detection.
    const generatedHash = objectHash({
      ...metadata,
      lastUpdated: null,
    })
    if (hash.current?.get("hash") === generatedHash) return

    hash.current?.set("hash", generatedHash)
    activeProvider.metadata = metadata
  }, [metadata, provider])

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

  if (provider === undefined) {
    return (
      <main className="container mx-auto flex min-h-screen max-w-4xl flex-col px-6 pt-8 pb-32 md:px-8 md:pt-10">
        <DocumentSkeleton />
      </main>
    )
  }

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
              Edited {timeAgo(provider.metadata.lastUpdated)}
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
            document: provider.doc,
          }),
          CollaborationCaret.configure({
            provider,
            user: {
              name: userName,
            },
          }),
        ]}
      />
    </main>
  )
}
