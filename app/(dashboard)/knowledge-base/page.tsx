import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DocumentsList } from "@/components/documents-list"
import { Plus } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import type { Document } from '@/types/documents'

export const metadata: Metadata = {
  title: "Knowledge Base | Haya",
  description: "Manage the knowledge sources for your AI assistants",
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function KnowledgeBasePage() {
  const supabase = createClient()
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage the documents and information sources that power your AI assistants
          </p>
        </div>
        <Button asChild>
          <Link href="/knowledge-base/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </div>

      <DocumentsList documents={documents || []} />
    </div>
  )
}
