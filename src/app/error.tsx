"use client"

import React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <main className="flex size-full flex-col items-center justify-center space-y-5 p-5">
      <Image
        title="Error"
        width={350}
        height={350}
        alt="Surprised Pikachu"
        className="rounded"
        src="/images/Error.gif"
      />
      <div className="text-center">
        <h1 className="font-cal scroll-m-20 text-5xl tracking-tight lg:text-5xl">
          Unexpected Error
        </h1>
        <p className="text-xs italic text-gray-500">
          Please contact the developer regarding this error.
        </p>
        <h3 className="text-primary mt-4 tracking-tight">
          {error.message || "Something went wrong - Undefined Error"}
        </h3>
        <Button variant="outline" className="mt-4" onClick={reset}>
          Reset
        </Button>
      </div>
    </main>
  )
}

export default ErrorPage
