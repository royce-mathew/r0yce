import React from "react"

import { Icons } from "@/config/icons"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserData } from "@/components/custom/session-data"

const Settings = async () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="icon" aria-label="Open settings" className="ml-2 px-0">
            <Icons.Settings className="size-6 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" collisionPadding={10}>
          <UserData />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Settings
