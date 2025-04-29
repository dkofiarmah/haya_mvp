"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bot, Search, MoreVertical, Pencil, Trash2, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { deleteAIAssistant } from "@/lib/ai/ai-service"

interface AIAssistant {
  id: string
  name: string
  role: string
  description: string
  status: "active" | "inactive" | "draft"
  created_at: string
  updated_at: string
}

interface AIAssistantsListProps {
  assistants: AIAssistant[]
}

export function AIAssistantsList({ assistants }: AIAssistantsListProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAssistants = assistants.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assistant.description && assistant.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteAIAssistant(id)
      toast({
        title: "Assistant Deleted",
        description: `"${name}" has been deleted.`,
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting assistant:", error)
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the assistant. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
            Inactive
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Draft
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assistants</CardTitle>
        <CardDescription>
          {assistants.length} {assistants.length === 1 ? "assistant" : "assistants"} available
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assistants..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredAssistants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Bot className="h-6 w-6 text-muted-foreground" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">No matching assistants</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  No assistants match your search query. Try a different search term.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No assistants yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Create your first AI assistant to enhance your luxury tour experiences.
                </p>
                <Button asChild>
                  <Link href="/ai-assistants/create">Create Assistant</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssistants.map((assistant) => (
              <div key={assistant.id} className="flex items-start gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{assistant.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{assistant.role}</span>
                        <span>•</span>
                        <span>
                          {new Date(assistant.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {assistant.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{assistant.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(assistant.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/ai-assistants/${assistant.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/ai-assistants/${assistant.id}/test`}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Test
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(assistant.id, assistant.name)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
