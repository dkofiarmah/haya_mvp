import type { Meta  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie error in development
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie error in development
          }
        },
      },
    }
  );ata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DocumentsList } from "@/components/documents-list"
import { Plus } from "lucide-react"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export const metadata: Metadata = {
  title: "Knowledge Base | Luxuria",
  description: "Manage the knowledge sources for your AI assistants",
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function KnowledgeBasePage() {
  const supabase = createServerComponentClient<Database>({ cookies })
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
