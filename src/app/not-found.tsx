"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 p-8">
      <Image
        title="Error 404"
        width={280}
        height={280}
        alt="Page not found"
        className="rounded-sm opacity-80"
        src="/images/404.webp"
      />
      <div className="space-y-3 text-center">
        <h1 className="font-display text-7xl tracking-tight text-foreground/20">
          404
        </h1>
        <p className="label-editorial text-muted-foreground">Page not found</p>
      </div>
      <Link
        href="/"
        className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Return home
      </Link>
    </div>
  )
}
