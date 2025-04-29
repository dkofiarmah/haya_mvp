import type { Metadata } from "next"
import { DocumentUpload } from "@/components/document-upload"

export const metadata: Metadata = {
  title: "Upload Document | Knowledge Base | Luxuria",
  description: "Upload a new document to your knowledge base",
}

export default function UploadDocumentPage() {
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Upload Document</h1>
      <DocumentUpload />
    </div>
  )
}
