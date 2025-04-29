"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowRight, Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabaseClient } from '@/lib/supabase/browser'
import type { Database } from '@/types/supabase'
import Link from "next/link"
import type { Conversation } from "@/types/conversations"

export function RecentConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        setError(null)
        const supabase = supabaseClient
        
        const { data, error } = await supabase
          .from("conversations")
          .select(`
            id,
            created_at,
            status,
            title,
            customer_id,
            assistant_id,
            customers (
              id,
              name,
              email
            ),
            ai_assistants (
              id,
              name
            )
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          throw new Error(error.message)
        }
        
        if (!data) {
          throw new Error("No data returned from the database")
        }

        // Transform the data to match our types
        const transformedData = data.map(conv => ({
          ...conv,
          customer: conv.customers || null,
          agent: conv.ai_assistants || null
        }))

        setConversations(transformedData as Conversation[])
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch conversations"
        console.error("Error fetching conversations:", errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Latest client interactions</CardDescription>
          </div>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-10 w-10 text-destructive mb-2" />
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {conversation.customer?.name?.[0]?.toUpperCase() || "G"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">
                    {conversation.customer?.name || "Guest"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {conversation.title || "New Conversation"}
                  </p>
                </div>
                <Badge variant="outline" className={
                  conversation.status === "active" ? "bg-green-500/10 text-green-500" : 
                  conversation.status === "archived" ? "bg-gray-500/10 text-gray-500" : 
                  "bg-blue-500/10 text-blue-500"
                }>
                  {(conversation.status && conversation.status.length > 0) ? 
                    conversation.status[0].toUpperCase() + conversation.status.slice(1) : 
                    "Open"}
                </Badge>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/conversations">
                View All Conversations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start engaging with your customers
            </p>
            <Button asChild variant="outline">
              <Link href="/conversations/new">Start Conversation</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
