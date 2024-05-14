import React from "react"
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react"

import { signIn } from "@/lib/auth"

import { Button } from "../ui/button"

interface SignInButtonProps {
  provider: { id: string; name: string }
  callbackUrl: string
}

const iconMap: { [key: string]: React.ReactElement } = {
  google: <IconBrandGoogleFilled className="size-5" />,
  github: <IconBrandGithubFilled className="size-5" />,
}

const SignInButton: React.FC<SignInButtonProps> = ({
  provider,
  callbackUrl,
}) => {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider.id, {
          redirectTo: callbackUrl,
        })
      }}
    >
      <Button variant="outline" className="w-full space-x-3 py-5" type="submit">
        {iconMap[provider.id]}
        <div>
          Sign in with <b>{provider.name}</b>
        </div>
      </Button>
    </form>
  )
}

export default SignInButton
