import React from "react"
import Link from "next/link"

import { Icons } from "@/config/icons"
import { auth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/custom/mode-toggle"
import { UserData } from "@/components/custom/session-data"

const Settings = async () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="icon" className="ml-2 px-0">
            <Icons.Settings className="size-6 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" collisionPadding={10}>
          <UserData />
          <Separator className="my-3" />

          <div className="flex items-center justify-between">
            Toggle Theme
            <ModeToggle />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Settings
