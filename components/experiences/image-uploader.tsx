'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabaseClient } from '@/lib/supabase/auth-client'
import { compressImage, generateThumbnail } from '@/lib/image-utils'
import { uploadFileToSupabase } from '@/lib/upload-utils'

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  organizationId: string;
  experienceId?: string;
}

export default function ImageUploader({ 
  images, 
  onChange, 
  organizationId,
  experienceId 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [imagePreviews, setImagePreviews] = useState<{[key: string]: string}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    try {
      setUploading(true)
      
      // Make sure we have the organization ID
      if (!organizationId) {
        throw new Error('Organization ID is required for uploading images')
      }
      
      // Create a unique folder ID for this upload session
      const uploadFolderId = experienceId || `temp_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
      
      const files = Array.from(e.target.files)
      
      // Initialize upload progress tracking
      const initialProgress: {[key: string]: number} = {}
      files.forEach(file => {
        initialProgress[file.name] = 0
      })
      setUploadProgress(initialProgress)
      
      // Create previews before compression
      const previews: {[key: string]: string} = {}
      for (const file of files) {
        try {
          // Generate a thumbnail preview
          const preview = await generateThumbnail(file)
          previews[file.name] = preview
        } catch (previewError) {
          console.warn('Failed to generate preview, continuing without preview:', previewError)
        }
      }
      setImagePreviews(prev => ({ ...prev, ...previews }))
      
      // Process and upload each file
      const uploadPromises = files.map(async (file, index) => {
        try {
          // Generate a unique file name
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
          
          // Update progress to 10% - starting compression
          setUploadProgress(prev => ({ ...prev, [file.name]: 10 }))
          
          // Compress the image
          let compressedFile = file
          try {
            // Determine compression options based on file size
            const fileSizeMB = file.size / (1024 * 1024)
            let compressionOptions = {}
            
            if (fileSizeMB > 5) {
              // Very large image - stronger compression
              compressionOptions = { maxSizeMB: 1, maxWidthOrHeight: 1920, quality: 0.7 }
            } else if (fileSizeMB > 2) {
              // Large image - medium compression
              compressionOptions = { maxSizeMB: 1.5, maxWidthOrHeight: 2400, quality: 0.8 }
            } else {
              // Smaller image - light compression
              compressionOptions = { maxSizeMB: 2, maxWidthOrHeight: 2560, quality: 0.9 }
            }
            
            compressedFile = await compressImage(file, compressionOptions)
            
            // Update progress to 40% - compression complete
            setUploadProgress(prev => ({ ...prev, [file.name]: 40 }))
          } catch (compressionError) {
            console.error('Image compression failed, using original file:', compressionError)
            // Continue with original file
          }
          
          // Organize storage with a proper path structure
          const filePath = `org_${organizationId}/${uploadFolderId}/${fileName}`
          
          // Update progress to 50% - starting upload
          setUploadProgress(prev => ({ ...prev, [file.name]: 50 }))
          
          // Try to upload the file with our helper function
          try {
            const publicUrl = await uploadFileToSupabase(supabaseClient, compressedFile, filePath)
            
            // Update progress to 100% - complete
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
            
            console.log(`Successfully uploaded file ${index + 1}, URL:`, publicUrl)
            return publicUrl
          } catch (uploadError) {
            console.error(`Upload error for file ${index + 1}:`, uploadError)
            // Mark as failed
            setUploadProgress(prev => ({ ...prev, [file.name]: -1 }))
            throw uploadError
          }
        } catch (fileError) {
          console.error(`Error processing file ${index + 1}:`, fileError)
          setUploadProgress(prev => ({ ...prev, [file.name]: -1 }))
          throw fileError
        }
      })

      // Use Promise.allSettled to handle partial successful uploads
      const uploadResults = await Promise.allSettled(uploadPromises)
      
      // Extract successful uploads
      const successfulUploads = uploadResults
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value)
      
      // Log failed uploads
      const failedUploads = uploadResults
        .filter(result => result.status === 'rejected')
        .map((result, index) => ({ 
          error: (result as PromiseRejectedResult).reason,
          fileIndex: index
        }))
      
      if (failedUploads.length > 0) {
        console.warn(`${failedUploads.length} out of ${uploadResults.length} uploads failed.`)
      }
      
      // Update the images array with the new uploads
      const updatedImages = [...images, ...successfulUploads]
      onChange(updatedImages)
    } catch (error) {
      console.error('Error processing uploads:', error)
    } finally {
      setUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Function to remove an image
  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    onChange(updatedImages)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Experience Images</h3>
        <p className="text-sm text-muted-foreground">
          Upload high-quality images that showcase your experience. Images will be automatically compressed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
          
          {/* Custom upload button */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              uploading ? 'bg-muted/50 border-muted cursor-not-allowed' : 'border-primary/30 hover:border-primary cursor-pointer'
            } transition-colors`}
            onClick={uploading ? undefined : triggerFileInput}
          >
            <div className="mx-auto flex flex-col items-center justify-center space-y-2">
              <div className={`rounded-full p-3 ${uploading ? 'bg-muted' : 'bg-primary/10'}`}>
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-primary" />
                )}
              </div>
              <h3 className="text-lg font-medium">
                {uploading ? "Uploading..." : "Upload Images"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {uploading 
                  ? "Please wait while your images are being processed and uploaded" 
                  : "Drag and drop image files here, or click to select files"
                }
              </p>
              {!uploading && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mt-2"
                  type="button"
                >
                  Select Files
                </Button>
              )}
            </div>
          </div>
          
          {/* Upload progress indicators */}
          {uploading && Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium">Upload Progress</h4>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate max-w-[250px]">{fileName}</span>
                    <span>
                      {progress === -1 
                        ? 'Failed' 
                        : progress === 100 
                          ? 'Complete' 
                          : `${progress}%`
                      }
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        progress === -1 
                          ? 'bg-destructive' 
                          : progress === 100 
                            ? 'bg-green-500' 
                            : 'bg-primary'
                      }`}
                      style={{ width: `${progress === -1 ? 100 : progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload guidelines */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Image Guidelines</h4>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>Upload high resolution images in landscape orientation (16:9)</li>
              <li>Maximum file size before compression: 10MB per image</li>
              <li>Recommended resolution: 1920×1080 pixels or higher</li>
              <li>Acceptable formats: JPEG, PNG, WebP</li>
              <li>First image will be used as the main feature image</li>
            </ul>
          </div>
        </div>

        {/* Uploaded images display */}
        {(images.length > 0 || Object.keys(imagePreviews).length > 0) && (
          <div className="col-span-1">
            <h4 className="font-medium mb-3">Experience Images</h4>
            
            {/* Grid of uploaded images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Image previews that are still uploading */}
              {Object.entries(imagePreviews)
                .filter(([fileName]) => uploadProgress[fileName] !== 100)
                .map(([fileName, previewUrl]) => (
                  <div key={fileName} className="relative group aspect-video">
                    <div className="relative w-full h-40 overflow-hidden rounded-md border border-border bg-muted">
                      <img
                        src={previewUrl}
                        alt={`Preview: ${fileName}`}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs truncate">{fileName}</p>
                  </div>
                ))
              }

              {/* Actual uploaded images with valid URLs */}
              {images.map((imageUrl, index) => (
                <div key={imageUrl} className="relative group aspect-video">
                  <div className="relative w-full h-40 overflow-hidden rounded-md border border-border">
                    <img
                      src={imageUrl}
                      alt={`Experience image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Main Image
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-lg"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Reorder instructions */}
            {images.length > 1 && (
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Tip:</strong> You can delete images and re-upload them in your preferred order.
                The first image will be featured as the main image for your experience.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
