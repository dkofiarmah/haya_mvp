"use client"

import { Loader2 } from "lucide-react"

export function Loading({ fullScreen = false }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
