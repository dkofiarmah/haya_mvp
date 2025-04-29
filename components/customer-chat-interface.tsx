'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, X, MinusCircle, Loader2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface CustomerChatInterfaceProps {
  orgId: string
  customerId?: string
  experienceId?: string
  onClose?: () => void
  initialMessage?: string
}

export function CustomerChatInterface({
  orgId,
  customerId,
  experienceId,
  onClose,
  initialMessage
}: CustomerChatInterfaceProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  
  // Initialize chat with greeting and optional initial message about an experience
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: 'greeting',
        role: 'assistant',
        content: 'Hello! I\'m your digital travel assistant. How can I help you plan your perfect experience today?',
        timestamp: new Date()
      }
    ]
    
    if (initialMessage) {
      initialMessages.push({
        id: 'initial',
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date(Date.now() + 100) // Slightly after greeting
      })
    }
    
    setMessages(initialMessages)
  }, [initialMessage])
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Focus input when chat expands
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus()
    }
  }, [isExpanded])
  
  const handleSendMessage = async () => {
    if (!input.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      // In a real implementation, this would call your AI service
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     message: input.trim(),
      //     orgId,
      //     customerId,
      //     experienceId,
      //     history: messages.map(m => ({ role: m.role, content: m.content }))
      //   })
      // })
      
      // Simulate AI response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a simulated response based on user input
      let responseContent = ''
      const userInput = input.toLowerCase()
      
      if (userInput.includes('book') || userInput.includes('reservation') || userInput.includes('schedule')) {
        responseContent = "I'd be happy to help you book an experience! When are you planning to visit, and how many people will be in your group?"
      } else if (userInput.includes('price') || userInput.includes('cost') || userInput.includes('fee')) {
        responseContent = "Our experiences range in price depending on the activity and group size. For this particular experience, prices start at $89 per person with discounts available for groups of 4 or more."
      } else if (userInput.includes('cancel') || userInput.includes('refund')) {
        responseContent = "Our cancellation policy allows full refunds up to 48 hours before your scheduled experience. Would you like me to explain more details about our cancellation policy?"
      } else if (userInput.includes('recommend') || userInput.includes('suggest')) {
        responseContent = "Based on your interests, I'd recommend our 'Coastal Hiking Adventure'. It's perfect for nature lovers and offers breathtaking views. Would you like more details about this experience?"
      } else {
        responseContent = "Thank you for your message! I'm here to help with any questions about our experiences, booking process, or travel recommendations. Is there something specific you'd like to know more about?"
      }
      
      // Log the interaction in agent_logs (would be implemented in the API)
      // This maintains history of all assistant interactions
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "w-[350px] h-[500px]" : "w-[60px] h-[60px]"
      )}
    >
      {isExpanded ? (
        <Card className="flex flex-col h-full shadow-lg border-primary/20">
          <CardHeader className="px-4 py-2 flex flex-row items-center justify-between space-y-0 bg-primary/5">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback>
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm font-medium">Digital Assistant</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsExpanded(false)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              {onClose && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-4 py-2">
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex gap-2 max-w-[90%]",
                      message.role === 'user' ? "ml-auto" : "mr-auto"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarFallback className="bg-primary">
                          <Bot size={16} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm",
                        message.role === 'user' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                      <div className={cn(
                        "text-[10px] mt-1",
                        message.role === 'user' 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarFallback className="bg-secondary">
                          <User size={16} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 max-w-[90%]">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback className="bg-primary">
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="py-3 px-4 rounded-lg bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2">
            <div className="flex w-full items-center gap-2">
              <Input 
                ref={inputRef}
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          className="h-[60px] w-[60px] rounded-full p-0 shadow-lg"
          onClick={() => setIsExpanded(true)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
