'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

async function getDocumentsImpl() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    throw error
  }

  return data
}

export const getDocuments = cache(getDocumentsImpl)

async function getDocumentImpl(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("documents").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching document with ID ${id}:`, error)
    throw error
  }

  return data
}

export const getDocument = cache(getDocumentImpl)

async function getDocumentChunksImpl(documentId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("document_chunks")
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error(`Error fetching chunks for document ${documentId}:`, error)
    throw error
  }

  return data
}

export const getDocumentChunks = cache(getDocumentChunksImpl)

async function getAssistantDocumentsImpl(assistantId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("assistant_documents")
    .select(`
      document_id,
      documents:document_id(*)
    `)
    .eq("assistant_id", assistantId)

  if (error) {
    console.error(`Error fetching documents for assistant ${assistantId}:`, error)
    throw error
  }

  return data.map((item) => item.documents)
}

export const getAssistantDocuments = cache(getAssistantDocumentsImpl)

export async function addDocumentToAssistant(assistantId: string, documentId: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("assistant_documents").insert({
    assistant_id: assistantId,
    document_id: documentId,
  })

  if (error) {
    console.error(`Error adding document ${documentId} to assistant ${assistantId}:`, error)
    throw error
  }

  return true
}

export async function removeDocumentFromAssistant(assistantId: string, documentId: string) {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("assistant_documents")
    .delete()
    .eq("assistant_id", assistantId)
    .eq("document_id", documentId)

  if (error) {
    console.error(`Error removing document ${documentId} from assistant ${assistantId}:`, error)
    throw error
  }

  return true
}

export async function deleteDocument(id: string) {
  const supabase = await createServerClient()

  const { data: document, error: fetchError } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error(`Error fetching document ${id} for deletion:`, fetchError)
    throw fetchError
  }

  if (document.file_path) {
    const { error: storageError } = await supabase.storage.from("knowledge-base").remove([document.file_path])

    if (storageError) {
      console.error(`Error deleting file ${document.file_path} from storage:`, storageError)
    }
  }

  const { error } = await supabase.from("documents").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting document ${id}:`, error)
    throw error
  }

  return true
}
