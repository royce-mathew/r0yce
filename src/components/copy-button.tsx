"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Icons } from "./icons";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  content: string;
}

export function CopyButton({ className, content, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };
  return (
    <Button
      variant="ghost"
      className={cn(
        "relative z-10 w-fit rounded-lg bg-black/10 p-2 opacity-0 transition-opacity duration-200 ease-in-out hover:bg-black/15 group-hover:opacity-100",
        className
      )}
      onClick={handleCopy}
      {...props}
    >
      {/* <span className="sr-only">Copy</span> */}
      {hasCopied ? (
        <div className="flex items-center space-x-3">
          <div>Copied</div>
          <div>
            <Icons.clipboardCheck className="size-6" />
          </div>
        </div>
      ) : (
        <Icons.clipboardEmpty className="size-6" />
      )}
    </Button>
  );
}
