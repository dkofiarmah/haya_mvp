"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Send, Mic, Bot, Loader2, Sparkles, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AICopilotProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AICopilot({ isOpen = true, onClose }: AICopilotProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your personal Travel Assistant. I can help you create and manage itineraries, find experiences, book accommodations, handle reservations, assist with customer information, process payments, and generate reports. How can I enhance your journey today?"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(inputValue)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real implementation, you would start/stop speech recognition here
  }

  // Simulate AI responses based on input
  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes("create") && lowerInput.includes("itinerary")) {
      return "I'd be delighted to help you craft a personalized itinerary! Would you like to build it from scratch or use one of our curated templates? Please share details about your destination, travel dates, and any specific interests like culture, adventure, or relaxation."
    }
    
    if (lowerInput.includes("generate") && lowerInput.includes("report")) {
      return "I can create comprehensive travel reports for you. What specific insights are you looking for? I can provide booking summaries, revenue analysis, seasonal trends, destination popularity, or custom reports tailored to your needs."
    }
    
    if (lowerInput.includes("edit") && (lowerInput.includes("experience") || lowerInput.includes("accommodation"))) {
      return "I'd be happy to help you refine that experience or accommodation. Could you specify which listing you'd like to update and what changes you'd like to make? I can assist with pricing, availability, descriptions, or amenities."
    }
    
    if (lowerInput.includes("add") && lowerInput.includes("customer")) {
      return "Let's add a new traveler to your database! Please share their name, contact information, and any travel preferences they've mentioned - such as seat preferences, dietary restrictions, or favorite destinations."
    }

    if (lowerInput.includes("booking") || lowerInput.includes("reservation")) {
      return "I can handle all your booking needs. Would you like to create a new reservation, check availability for specific dates, modify an existing booking, or perhaps help a customer reschedule their journey?"
    }

    if (lowerInput.includes("payment")) {
      return "I'm ready to assist with travel payments. Do you need to process a new transaction, check payment status, set up a payment plan, issue a refund, or generate a financial report?"
    }
    
    if (lowerInput.includes("recommendation") || lowerInput.includes("suggest")) {
      return "I'd love to offer personalized travel recommendations! Could you share what kind of experience you're looking for? Whether it's romantic getaways, family-friendly adventures, cultural immersion, or off-the-beaten-path destinations, I can tailor suggestions to match your travelers' preferences."
    }
    
    return "I'm here to enhance your travel management experience. Could you provide a bit more detail about what you'd like assistance with today? I can help with itineraries, bookings, customer management, payments, or destination insights."
  }

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background border-l shadow-xl z-50 transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold">Travel Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
        <div className="flex flex-col gap-4 p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "user" 
                  ? "bg-primary text-primary-foreground ml-auto" 
                  : "bg-muted mr-auto"
              )}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-muted rounded-lg p-3 max-w-[80%] mr-auto">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleRecording}
            className={cn(isRecording && "bg-red-100 text-red-500 border-red-200")}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
