import { Provider } from "@auth/core/providers"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// Import the Firebase Admin SDK
import { adminAuth, firebaseAdminFirestore } from "@/lib/firebase/server"

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID as string,
    clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    allowDangerousEmailAccountLinking: true,
  }),
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID as string,
    clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    allowDangerousEmailAccountLinking: true,
  }),
]

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})

// Export the NextAuth configuration
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: providers,
  adapter: FirestoreAdapter(firebaseAdminFirestore),
  session: {
    strategy: "jwt",
  },
  pages: {
    // signIn: "/api/auth/signin",
  },
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id as string

        // try {
        //   await adminAuth.getUser(token.sub)
        // } catch (error: any) {
        //   if (error.code === "auth/user-not-found") {
        //     // If the user does not exist, create a new user
        //     await adminAuth.createUser({
        //       uid: token.sub,
        //       email: token.email as string,
        //       displayName: token.name,
        //       photoURL: token.picture,
        //     })
        //   } else {
        //     throw error
        //   }
        // }
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub

          const firebaseToken = await adminAuth.createCustomToken(token.sub)
          session.firebaseToken = firebaseToken
        }
      }
      return session
    },
  },

  theme: {
    brandColor: "#0062ff",
    logo: "/favicon.ico",
    buttonText: "#0062ff",
    colorScheme: "light",
  },
})
