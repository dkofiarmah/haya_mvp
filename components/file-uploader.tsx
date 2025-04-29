'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, UploadCloud, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  accept: string
  maxFiles: number
  maxSize: number  // in bytes
  onFilesSelected: (files: File[]) => void
  initialFiles?: string[]  // URLs of existing files
}

export default function FileUploader({
  accept,
  maxFiles,
  maxSize,
  onFilesSelected,
  initialFiles = []
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [existingUrls, setExistingUrls] = useState<string[]>(initialFiles)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Reset error
    setError(null)

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.flatMap(rejection => rejection.errors)
      if (errors.some(e => e.code === 'file-too-large')) {
        setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`)
      } else if (errors.some(e => e.code === 'file-invalid-type')) {
        setError('Invalid file type')
      } else {
        setError('Error uploading files')
      }
      return
    }

    // Check total number of files (existing + new ones)
    if (existingUrls.length + files.length + acceptedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`)
      return
    }

    // Create preview URLs for the new files
    const newPreviewUrls = acceptedFiles.map(file => URL.createObjectURL(file))
    
    // Update state with new files
    setFiles(currentFiles => [...currentFiles, ...acceptedFiles])
    setPreviewUrls(currentPreviews => [...currentPreviews, ...newPreviewUrls])
    
    // Update parent component
    onFilesSelected([...files, ...acceptedFiles])
  }, [existingUrls, files, maxFiles, maxSize, onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    maxFiles: maxFiles - existingUrls.length,
  })

  const removeFile = (index: number) => {
    const newFiles = [...files]
    const newPreviewUrls = [...previewUrls]
    
    // Clean up the preview URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])
    
    newFiles.splice(index, 1)
    newPreviewUrls.splice(index, 1)
    
    setFiles(newFiles)
    setPreviewUrls(newPreviewUrls)
    onFilesSelected(newFiles)
  }

  const removeExistingFile = (index: number) => {
    const newExistingUrls = [...existingUrls]
    newExistingUrls.splice(index, 1)
    setExistingUrls(newExistingUrls)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop the files here...' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select files
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} files, up to {maxSize / (1024 * 1024)}MB each
          </p>
        </div>
      </div>

      {error && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded">
          {error}
        </div>
      )}

      {/* Existing files preview */}
      {existingUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Existing Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {existingUrls.map((url, index) => (
              <div key={url} className="relative group rounded-md overflow-hidden border">
                <img
                  src={url}
                  alt={`Existing file ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeExistingFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-xs p-1 truncate">
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New files preview */}
      {previewUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">New Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {previewUrls.map((url, index) => (
              <div key={url} className="relative group rounded-md overflow-hidden border">
                <img
                  src={url}
                  alt={`File ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-xs p-1 truncate">
                  {files[index].name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
