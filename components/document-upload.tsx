"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import FileUploader from "./file-uploader"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function DocumentUpload({ assistantId = null }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (file: File | null) => {
    setFile(file)
    if (file && !formData.name) {
      // Auto-fill name with file name (without extension)
      const fileName = file.name.split(".").slice(0, -1).join(".")
      handleChange("name", fileName)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create form data for upload
      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("name", formData.name)
      uploadData.append("description", formData.description)

      if (assistantId) {
        uploadData.append("assistantId", assistantId)
      }

      // Upload the document
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to upload document")
      }

      const result = await response.json()

      toast({
        title: "✨ Document Uploaded",
        description: "Your document is being processed and will be available shortly.",
      })

      // Redirect or refresh
      if (assistantId) {
        router.push(`/ai-assistants/${assistantId}?tab=knowledge`)
      } else {
        router.push("/knowledge-base")
      }

      router.refresh()
    } catch (error: any) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your document.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Add a document to your knowledge base. Supported formats: PDF, DOCX, TXT, CSV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploader
            onFileChange={handleFileChange}
            accept=".pdf,.docx,.txt,.csv"
            maxSize={10} // 10MB
          />

          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              placeholder="e.g. Luxury Destinations Guide 2023"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-description">Description (Optional)</Label>
            <Textarea
              id="document-description"
              placeholder="Briefly describe what this document contains..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-24"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUploading || !file}>
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
