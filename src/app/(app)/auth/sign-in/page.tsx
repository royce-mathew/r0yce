import Image from "next/image"

import { Icons } from "@/config/icons"
import { providerMap, signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const iconMap: { [key: string]: React.ReactElement } = {
  google: <Icons.Google className="size-5" />,
  github: <Icons.Github className="size-5" />,
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const callbackUrl = (searchParams?.callbackUrl as string) ?? "/"
  // Get the callbackUrl
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="bg-foreground/5 outline-outline max-w-96 space-y-3 rounded p-8">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="">
          You need to sign in to use this feature. Please select a provider to
          sign in with.
        </p>
        <Separator />
        <div className="flex flex-col space-y-2">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                "use server"
                await signIn(provider.id, {
                  redirectTo: callbackUrl,
                })
              }}
            >
              <Button
                variant="outline"
                type="submit"
                className="w-full space-x-3 py-5"
              >
                {iconMap[provider.id]}
                <div>
                  Sign in with <b>{provider.name}</b>
                </div>
              </Button>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}
