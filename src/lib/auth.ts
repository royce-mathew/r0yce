import { Provider } from "@auth/core/providers"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// Import the Firebase Admin SDK
import { firebaseAdminFirestore, getAuth } from "@/lib/firebase/server"

// Get the environment variables
const {
  AUTH_GOOGLE_ID = "",
  AUTH_GOOGLE_SECRET = "",
  AUTH_GITHUB_ID = "",
  AUTH_GITHUB_SECRET = "",
} = process.env

const providers: Provider[] = [
  Google({
    clientId: AUTH_GOOGLE_ID,
    clientSecret: AUTH_GOOGLE_SECRET,
  }),
  GitHub({
    clientId: AUTH_GITHUB_ID,
    clientSecret: AUTH_GITHUB_SECRET,
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
    signIn: "/auth/sign-in",
  },
  theme: {
    brandColor: "#0062ff",
    logo: "/favicon.ico",
    buttonText: "#0062ff",
    colorScheme: "light",
  },
})
