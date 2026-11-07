"use client"

import { useEffect } from "react"
import type { Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"

async function syncFirebaseToken(session: Session) {
  const [{ signInWithCustomToken }, { auth }] = await Promise.all([
    import("firebase/auth"),
    import("@/lib/firebase/client"),
  ])
  if (session.firebaseToken) {
    try {
      await signInWithCustomToken(auth, session.firebaseToken)
    } catch (error) {
      console.error("Error signing in with custom token:", error)
    }
  } else {
    console.log("Signing out of Firebase Auth")
    auth.signOut()
  }
}

const FirebaseAuthSynchronize = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) return
    void syncFirebaseToken(session).catch((error) => {
      console.error("Error loading Firebase Auth:", error)
    })
  }, [session])

  return null
}

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement
}) => {
  return (
    <SessionProvider>
      <FirebaseAuthSynchronize />
      {children}
    </SessionProvider>
  )
}
