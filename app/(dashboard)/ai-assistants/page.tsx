import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAIAssistants } from "@/lib/ai/ai-service"
import { AIAssistantsList } from "@/components/ai-assistants-list"
import { Plus } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "AI Assistants | Luxuria",
  description: "Manage your AI assistants for luxury tour experiences",
}

export default async function AIAssistantsPage() {
  try {
    // Fetch assistants data with error handling
    const assistants = await getAIAssistants() || [];
    
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistants</h1>
            <p className="text-muted-foreground">
              Create and manage AI assistants to enhance your luxury tour experiences
            </p>
          </div>
          <Button asChild>
            <Link href="/ai-assistants/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Assistant
            </Link>
          </Button>
        </div>

        <AIAssistantsList assistants={assistants} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering AI Assistants page:", error);
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistants</h1>
          <p className="text-muted-foreground">
            Unable to load assistants. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
