'use server'

import { createServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

// Setup storage bucket for experience images
export async function setupExperienceStorage() {
  const supabase = createServerClient()
  
  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(bucket => bucket.name === 'experience-images')
  
  if (!bucketExists) {
    // Create bucket
    const { data, error } = await supabase.storage.createBucket('experience-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    })
    
    if (error) {
      console.error('Error creating experience-images bucket:', error)
      throw error
    }
    
    return { success: true, message: 'Experience storage bucket created successfully' }
  }
  
  return { success: true, message: 'Experience storage bucket already exists' }
}
