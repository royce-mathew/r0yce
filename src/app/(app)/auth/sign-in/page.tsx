import { Metadata } from "next"
import { providerMap } from "@/lib/auth"
import { Separator } from "@/components/ui/separator"
import SignInButton from "@/components/custom/signin-button"

export const metadata: Metadata = {
  title: "Sign in | r0yce",
  description:
    "Sign in to access your account and continue where you left off.",
}

export default async function SignInPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const callbackUrl = (searchParams?.callbackUrl as string) ?? "/"
  // Get the callbackUrl
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="outline-outline max-w-96 space-y-3 rounded bg-foreground/5 p-8">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="">
          Sign in to access your account and continue where you left off.
        </p>
        <Separator />
        <div className="flex flex-col space-y-2">
          {Object.values(providerMap).map((provider) => (
            <SignInButton
              key={provider.id}
              provider={provider}
              callbackUrl={callbackUrl}
            />
          ))}
        </div>
        <footer className="flex flex-col space-y-2">
          <Separator />
          <p className="text-xs">
            Your account is automatically created when you sign in for the first
            time.
          </p>
        </footer>
      </div>
    </div>
  )
}
