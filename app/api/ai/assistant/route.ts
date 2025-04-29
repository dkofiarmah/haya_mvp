import { type NextRequest, NextResponse } from "next/server"
import { generateAssistantResponse, saveMessage } from "@/lib/ai/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { assistantId, prompt, conversationId, conversationHistory } = await request.json()

    if (!assistantId || !prompt || !conversationId) {
      return NextResponse.json(
        { error: "Missing required fields: assistantId, prompt, or conversationId" },
        { status: 400 },
      )
    }

    // Generate response from the AI assistant
    const response = await generateAssistantResponse(assistantId, prompt, conversationHistory || [])

    // Save the user message
    await saveMessage(conversationId, "user", prompt)

    // Save the assistant response
    await saveMessage(conversationId, "assistant", response, assistantId)

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error("Error in assistant route:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while processing your request" },
      { status: 500 },
    )
  }
}
