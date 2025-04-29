import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDocument, getDocumentChunks } from "@/lib/documents/document-service"
import { ArrowLeft, FileText, FileSpreadsheet, FileCode, File } from "lucide-react"

export async function generateMetadata({ params }): Promise<Metadata> {
  try {
    const document = await getDocument(params.id)
    return {
      title: `${document.name} | Knowledge Base | Luxuria`,
      description: document.description || "Document details",
    }
  } catch (error) {
    return {
      title: "Document Not Found | Knowledge Base | Luxuria",
      description: "The requested document could not be found",
    }
  }
}

export default async function DocumentDetailPage({ params }) {
  let document
  let chunks = []

  try {
    document = await getDocument(params.id)
    chunks = await getDocumentChunks(params.id)
  } catch (error) {
    notFound()
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/knowledge-base">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{document.name}</h1>
        {getStatusBadge(document.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                {getFileIcon(document.file_type)}
              </div>
              <div>
                <p className="font-medium">{document.file_type.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(document.file_size)}</p>
              </div>
            </div>

            {document.description && (
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">{document.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-1">Uploaded</h3>
              <p className="text-sm text-muted-foreground">{new Date(document.created_at).toLocaleString()}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Last Updated</h3>
              <p className="text-sm text-muted-foreground">{new Date(document.updated_at).toLocaleString()}</p>
            </div>

            {document.status === "error" && document.error_message && (
              <div>
                <h3 className="text-sm font-medium text-red-500 mb-1">Error</h3>
                <p className="text-sm text-red-500">{document.error_message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Content Preview</CardTitle>
            <CardDescription>{chunks.length} chunks extracted from this document</CardDescription>
          </CardHeader>
          <CardContent>
            {document.status === "processing" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <h3 className="text-lg font-medium mb-2">Processing Document</h3>
                <p className="text-muted-foreground max-w-md">
                  We're currently extracting and processing the content from this document. This may take a few moments.
                </p>
              </div>
            ) : document.status === "error" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-red-500/10 p-3 mb-4">
                  <FileText className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Processing Error</h3>
                <p className="text-muted-foreground max-w-md">
                  There was an error processing this document. Please try uploading it again.
                </p>
              </div>
            ) : chunks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Content Available</h3>
                <p className="text-muted-foreground max-w-md">No content chunks were extracted from this document.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {chunks.map((chunk, index) => (
                  <div key={chunk.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-medium text-muted-foreground">Chunk {index + 1}</h3>
                    </div>
                    <p className="text-sm whitespace-pre-line">{chunk.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
