"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentsList } from "./documents-list"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  getAssistantDocuments,
  addDocumentToAssistant,
  removeDocumentFromAssistant,
} from "@/lib/documents/document-service"
import { getDocuments } from "@/lib/documents/document-service"
import { Plus, Upload } from "lucide-react"

export function AIAssistantKnowledge({ assistantId }) {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("current")
  const [assistantDocuments, setAssistantDocuments] = useState([])
  const [allDocuments, setAllDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch documents associated with this assistant
        const assistantDocs = await getAssistantDocuments(assistantId)
        setAssistantDocuments(assistantDocs)

        // Fetch all documents for the "add" tab
        const allDocs = await getDocuments()
        setAllDocuments(allDocs)
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast({
          title: "Error",
          description: "Failed to load documents. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [assistantId, toast])

  const handleAddDocument = async (documentId) => {
    try {
      await addDocumentToAssistant(assistantId, documentId)

      // Update the assistant documents list
      const updatedAssistantDocs = await getAssistantDocuments(assistantId)
      setAssistantDocuments(updatedAssistantDocs)

      toast({
        title: "Document Added",
        description: "The document has been added to this assistant's knowledge base.",
      })

      // Switch to the "current" tab
      setActiveTab("current")
    } catch (error) {
      console.error("Error adding document:", error)
      toast({
        title: "Error",
        description: "Failed to add document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveDocument = async (documentId) => {
    try {
      await removeDocumentFromAssistant(assistantId, documentId)

      // Update the assistant documents list
      const updatedAssistantDocs = await getAssistantDocuments(assistantId)
      setAssistantDocuments(updatedAssistantDocs)

      toast({
        title: "Document Removed",
        description: "The document has been removed from this assistant's knowledge base.",
      })
    } catch (error) {
      console.error("Error removing document:", error)
      toast({
        title: "Error",
        description: "Failed to remove document. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter out documents that are already associated with the assistant
  const availableDocuments = allDocuments.filter(
    (doc) => !assistantDocuments.some((assistantDoc) => assistantDoc.id === doc.id),
  )

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="current">Current Knowledge</TabsTrigger>
          <TabsTrigger value="add">Add Knowledge</TabsTrigger>
        </TabsList>
        <Button asChild>
          <Link href={`/knowledge-base/upload?assistantId=${assistantId}`}>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Document
          </Link>
        </Button>
      </div>

      <TabsContent value="current" className="space-y-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : (
          <DocumentsList
            documents={assistantDocuments}
            assistantId={assistantId}
            onRemoveFromAssistant={handleRemoveDocument}
          />
        )}
      </TabsContent>

      <TabsContent value="add" className="space-y-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : (
          <>
            {availableDocuments.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add Knowledge</CardTitle>
                  <CardDescription>Enhance this assistant with additional knowledge sources</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No documents available</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    All your documents are already added to this assistant, or you haven't uploaded any documents yet.
                  </p>
                  <Button asChild>
                    <Link href={`/knowledge-base/upload?assistantId=${assistantId}`}>Upload New Document</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <DocumentsList
                documents={availableDocuments}
                assistantId={assistantId}
                onAddToAssistant={handleAddDocument}
              />
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}
