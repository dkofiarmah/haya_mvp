import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AIChatInterface } from "@/components/ai-chat-interface"
import { getAIAssistant } from "@/lib/ai/ai-service"

type PageProps = {
  params: Promise<{ id: string }> | { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  try {
    const assistant = await getAIAssistant(resolvedParams.id)
    return {
      title: `Test ${assistant.name} | AI Assistants | Luxuria`,
      description: `Test the ${assistant.name} AI assistant`,
    }
  } catch (error) {
    return {
      title: "Assistant Not Found | AI Assistants | Luxuria",
      description: "The requested AI assistant could not be found",
    }
  }
}

export default async function TestAIAssistantPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  let assistant

  try {
    assistant = await getAIAssistant(resolvedParams.id)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{assistant.name}</h1>
        <p className="text-muted-foreground">Test this AI assistant with sample queries</p>
      </div>

      <AIChatInterface assistant={assistant} />
    </div>
  )
}
