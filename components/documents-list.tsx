"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Search, MoreVertical, Eye, Trash2, FileSpreadsheet, FileCode, File, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { deleteDocument } from "@/lib/documents/document-service"

interface Document {
  id: string
  name: string
  description: string
  file_type: string
  file_size: number
  status: "processing" | "active" | "error"
  created_at: string
  updated_at: string
  error_message?: string
  metadata?: any
}

interface DocumentsListProps {
  documents: Document[]
  assistantId?: string
  onAddToAssistant?: (documentId: string) => void
  onRemoveFromAssistant?: (documentId: string) => void
}

export function DocumentsList({ documents, assistantId, onAddToAssistant, onRemoveFromAssistant }: DocumentsListProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteDocument(id)
      toast({
        title: "Document Deleted",
        description: `"${name}" has been deleted from your knowledge base.`,
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "csv":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "txt":
        return <FileCode className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
            <div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Processing
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Active
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          {documents.length} {documents.length === 1 ? "document" : "documents"} in your knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">No matching documents</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  No documents match your search query. Try a different search term.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Upload documents to enhance your AI assistants with domain-specific knowledge.
                </p>
                <Button asChild>
                  <Link href="/knowledge-base/upload">Upload Document</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="flex items-start gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getFileIcon(document.file_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{document.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{document.file_type.toUpperCase()}</span>
                        <span>•</span>
                        <span>{formatFileSize(document.file_size)}</span>
                        <span>•</span>
                        <span>
                          {new Date(document.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {document.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{document.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(document.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/knowledge-base/${document.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {assistantId && onAddToAssistant && (
                            <DropdownMenuItem onClick={() => onAddToAssistant(document.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add to Assistant
                            </DropdownMenuItem>
                          )}
                          {assistantId && onRemoveFromAssistant && (
                            <DropdownMenuItem onClick={() => onRemoveFromAssistant(document.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from Assistant
                            </DropdownMenuItem>
                          )}
                          {!assistantId && (
                            <DropdownMenuItem onClick={() => handleDelete(document.id, document.name)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
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
