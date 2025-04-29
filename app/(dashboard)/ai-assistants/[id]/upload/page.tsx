import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocumentUpload } from "@/components/document-upload"
import { getAIAssistant } from "@/lib/ai/ai-service"

export async function generateMetadata({ params }): Promise<Metadata> {
  try {
    const assistant = await getAIAssistant(params.id)
    return {
      title: `Upload Document | ${assistant.name} | AI Assistants | Luxuria`,
      description: `Upload a document to ${assistant.name}'s knowledge base`,
    }
  } catch (error) {
    return {
      title: "Assistant Not Found | AI Assistants | Luxuria",
      description: "The requested AI assistant could not be found",
    }
  }
}

export default async function AssistantDocumentUploadPage({ params }) {
  let assistant

  try {
    assistant = await getAIAssistant(params.id)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{assistant.name}</h1>
      <p className="text-muted-foreground mb-6">Upload a document to this assistant's knowledge base</p>
      <DocumentUpload assistantId={assistant.id} />
    </div>
  )
}
