'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

// The most minimal version of the page to bypass the error
export default function ComposeMessagePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading message composer...</div>}>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/messages">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to messages</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Compose New Message</h1>
        </div>
        
        <div className="p-8 border rounded-md text-center">
          <h2 className="text-xl font-medium mb-4">Message Composer</h2>
          <p className="mb-6">The message composer is currently being updated. Please try again later.</p>
          <Button asChild>
            <Link href="/messages">Return to Messages</Link>
          </Button>
        </div>
      </div>
    </Suspense>
  )
}
