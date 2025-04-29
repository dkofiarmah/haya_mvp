"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateAIResponse } from "@/lib/ai/ai-service"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export function AIChatInterface({ assistant }) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm ${assistant.name}, your ${assistant.role}. How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Generate AI response
      const result = await generateAIResponse(assistant.id, input, conversationId)

      // Set conversation ID if this is the first message
      if (!conversationId && result.conversationId) {
        setConversationId(result.conversationId)
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating AI response:", error)
      toast({
        title: "Error",
        description: "There was an error generating a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-200px)]">
      <CardHeader>
        <CardTitle>Test Conversation</CardTitle>
        <CardDescription>Interact with {assistant.name} to test its responses and capabilities</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg px-4 py-2 bg-muted">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
