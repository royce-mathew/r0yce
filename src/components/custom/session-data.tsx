"use client"

import { signIn, signOut, useSession } from "next-auth/react"

import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const UserData: React.FC = () => {
  const { data: session } = useSession()
  if (!session)
    return (
      <Button className="w-full" variant="ghost" onClick={() => signIn()}>
        Login
      </Button>
    )
  return (
    <div>
      <div className="flex space-x-4">
        <Avatar>
          <AvatarImage
            src={session?.user?.image || ""}
            alt={session?.user?.name || ""}
          />
          <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-medium">{session?.user?.name}</p>
          <p className="text-muted-foreground text-sm">
            {session?.user?.email}
          </p>
        </div>
      </div>
      <Button className="mt-3 px-0" variant="link" onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  )
}
