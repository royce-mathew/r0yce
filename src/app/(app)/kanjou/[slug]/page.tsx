"use client"

import { useEffect, useRef, useState, use } from "react";
import dynamic from "next/dynamic"
import { IconCheck, IconPointFilled } from "@tabler/icons-react"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import { getDoc, updateDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import objectHash from "object-hash"
import { toast } from "sonner"
import * as Y from "yjs"

import { DocumentMetadata } from "@/types/document"
import { documentRef } from "@/lib/converters/document"
import { firebaseApp } from "@/lib/firebase/client"
import { deepEqual, timeAgo } from "@/lib/utils"
import { FireProvider } from "@/lib/y-fire"
import { Input } from "@/components/ui/input"
import { ErrorBoundary } from "@/components/nav/error"
import { yProvider } from "@/components/tiptap/providers/firebase-sync"

const TipTap = dynamic(() => import("@/components/tiptap/tiptap"), {
  ssr: false,
})

export default function Kanjou(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const { data: session } = useSession()
  const provider = useRef<FireProvider | undefined>(undefined)
  const [access, setAccess] = useState<boolean | undefined>()
  const [saving, setSaving] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<
    Partial<DocumentMetadata> | undefined
  >()
  const yDoc = useRef<Y.Doc | undefined>(undefined)
  const hash = useRef<Y.Map<unknown> | undefined>(undefined)

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

    // setMetadata(provider.current.metadata)

    provider.current.onReady = () => {
      toast("Document Loaded")
    }

    provider.current.onSaving = (status: boolean) => {
      setSaving(status)
    }

    provider.current.onSetMetadata = (metadata: Partial<DocumentMetadata>) => {
      setMetadata(metadata)
    }

    // User does not have access to the document
    provider.current.onDeleted = () => {
      // Check if the user has readAccess with firebase
      // try {
      //   if (firebaseDoc.data()?.readAccess.includes(session?.user.id)) {
      //     setAccess(true)
      //   } else {
      //     setAccess(false)
      //   }
      // } catch (error) {
      //   setAccess(false)
      // }
    }
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

  if (!provider.current) return null
  if (!session?.user.id) return null
  if (access === false) {
    return (
      <main className="container flex min-h-screen items-center justify-center">
        <ErrorBoundary
          error={new Error("You do not have access to this document")}
          rerouteUrl="/kanjou"
        />
      </main>
    )
  }

  function updateTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setMetadata({
      ...metadata,
      title: e.target.value,
    })
  }

  return (
    <main className="container flex min-h-screen flex-col">
      <div className="flex items-center">
        <Input
          className="my-4 border-none bg-transparent py-6 text-3xl font-bold outline-none"
          value={metadata?.title ?? ""}
          onChange={updateTitle}
          placeholder="Document Name"
        />

        <div className="flex pl-4">
          {/* Saving State */}
          {saving ? (
            <>
              Unsaved <IconPointFilled className="ml-2 size-5" />
            </>
          ) : (
            <>
              Saved <IconCheck className="ml-2 size-5" />
            </>
          )}
        </div>
      </div>
      <div>
        <p className="text-muted-foreground px-2 pb-2 text-sm">
          Last Updated: {timeAgo(provider.current?.metadata.lastUpdated)}
        </p>
      </div>

      <TipTap
        // initialContent={document?.content}
        passedExtensions={[
          Collaboration.configure({
            document: provider.current?.doc,
          }),
          CollaborationCursor.configure({
            provider: provider.current,
            user: {
              name: session?.user.name ?? "Unknown",
            },
          }),
        ]}
      />
    </main>
  )
}
