import type { Metadata } from "next"
import { AIAssistantForm } from "@/components/ai-assistant-form"

export const metadata: Metadata = {
  title: "Create AI Assistant | Luxuria",
  description: "Create a new AI assistant for your luxury tour business",
}

export default function CreateAIAssistantPage() {
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create AI Assistant</h1>
      <AIAssistantForm />
    </div>
  )
}
