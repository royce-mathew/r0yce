"use client"

import { useEffect } from "react"
import { signInWithCustomToken } from "firebase/auth"
import { Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"
// Here '@lib/firebase/firestore-database' refers to the '/app/_lib/firebase/firestore-database.js' file
import { auth } from "@/lib/firebase/client"

// Automatically syncs Firebase Auth custom token with NextAuth.js session
async function syncFirebaseToken(session: Session | null) {
  //   console.log(session)
  if (session && session.firebaseToken) {
    // if (auth.currentUser !== null) return // Already signed into Firebase Auth
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

// Synchronize Firebase Auth custom token with NextAuth.js session
const FirebaseAuthSynchronize = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) return
    syncFirebaseToken(session)
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
