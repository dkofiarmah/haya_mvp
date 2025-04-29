import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"
import { processDocument } from "@/lib/documents/processor"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const assistantId = formData.get("assistantId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "Document name is required" }, { status: 400 })
    }

    // Get file details
    const fileType = file.name.split(".").pop()?.toLowerCase() || ""
    const fileSize = file.size
    const contentType = file.type

    // Validate file type
    const allowedTypes = ["pdf", "docx", "txt", "csv"]
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed types: ${allowedTypes.join(", ")}` },
        { status: 400 },
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (fileSize > maxSize) {
      return NextResponse.json({ error: "File size exceeds the 10MB limit" }, { status: 400 })
    }

    // Generate a unique ID for the document
    const documentId = uuidv4()

    // Create a unique file path
    const filePath = `documents/${documentId}/${file.name}`

    // Initialize Supabase client
    const supabase = createServerClient()

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("knowledge-base")
      .upload(filePath, file, {
        contentType,
        upsert: false,
      })

    if (storageError) {
      console.error("Error uploading file to storage:", storageError)
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 })
    }

    // Create document record in database
    const { data: documentData, error: documentError } = await supabase
      .from("documents")
      .insert({
        id: documentId,
        name,
        description,
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
        content_type: contentType,
        status: "processing",
        metadata: {
          original_filename: file.name,
        },
      })
      .select()
      .single()

    if (documentError) {
      console.error("Error creating document record:", documentError)
      return NextResponse.json({ error: "Failed to create document record" }, { status: 500 })
    }

    // If assistantId is provided, create association
    if (assistantId) {
      const { error: associationError } = await supabase.from("assistant_documents").insert({
        assistant_id: assistantId,
        document_id: documentId,
      })

      if (associationError) {
        console.error("Error creating assistant-document association:", associationError)
        // Continue anyway, as the document was uploaded successfully
      }
    }

    // Start document processing (async)
    processDocument(documentId, filePath, fileType).catch((error) => {
      console.error("Error processing document:", error)
    })

    return NextResponse.json({
      success: true,
      document: {
        id: documentId,
        name,
        description,
        file_type: fileType,
        file_size: fileSize,
        status: "processing",
      },
    })
  } catch (error: any) {
    console.error("Error in document upload:", error)
    return NextResponse.json({ error: error.message || "An error occurred during document upload" }, { status: 500 })
  }
}
