'use client'

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Uploads a file to Supabase storage with robust error handling and retries
 * @param supabase Supabase client instance
 * @param file File to upload
 * @param path Storage path for the file
 * @param options Upload options
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToSupabase(
  supabase: SupabaseClient,
  file: File,
  path: string,
  options = {
    bucketName: 'experience-images',
    cacheControl: '3600',
    useOriginalFileAsFallback: true,
    maxRetries: 2,
  }
): Promise<string> {
  const {
    bucketName,
    cacheControl,
    useOriginalFileAsFallback,
    maxRetries,
  } = options;

  let retryCount = 0;
  let error = null;

  // Function to try creating the bucket if needed
  const ensureBucketExists = async () => {
    try {
      // Check if the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        throw listError;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      // Create bucket if it doesn't exist
      if (!bucketExists) {
        console.log(`Creating bucket: ${bucketName}`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw createError;
        }
      }
      
      return true;
    } catch (err) {
      console.error('Failed to ensure bucket exists:', err);
      return false;
    }
  };

  // Main upload function with retry logic
  const attemptUpload = async (filePath: string, fileToUpload: File, attempt: number): Promise<string> => {
    try {
      // Ensure proper content type
      const contentType = fileToUpload.type || 'image/jpeg';
      
      // Attempt the upload
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileToUpload, {
          cacheControl,
          contentType,
          upsert: true,
        });
      
      if (uploadError) {
        console.error(`Upload attempt ${attempt} failed:`, uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL after successful upload');
      }
      
      return urlData.publicUrl;
    } catch (err) {
      error = err;
      
      // If this is our last retry, try simpler approaches
      if (attempt >= maxRetries && useOriginalFileAsFallback) {
        // Try with a simpler path as last resort
        const timestamp = Date.now();
        const simplePath = `fallback_${timestamp}_${fileToUpload.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        console.log(`Last resort upload with simple path: ${simplePath}`);
        
        try {
          // Ensure bucket exists before last attempt
          await ensureBucketExists();
          
          const { data, error: fallbackError } = await supabase.storage
            .from(bucketName)
            .upload(simplePath, fileToUpload, {
              contentType: fileToUpload.type,
              upsert: true,
            });
          
          if (fallbackError) {
            console.error('Last resort upload failed:', fallbackError);
            throw fallbackError;
          }
          
          const { data: fallbackUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(simplePath);
          
          if (!fallbackUrlData || !fallbackUrlData.publicUrl) {
            throw new Error('Failed to get URL for fallback upload');
          }
          
          return fallbackUrlData.publicUrl;
        } catch (fallbackErr) {
          console.error('All upload attempts failed:', fallbackErr);
          throw fallbackErr;
        }
      }
      
      throw err;
    }
  };

  // First ensure the bucket exists
  await ensureBucketExists();
  
  // Try uploading with retries
  while (retryCount <= maxRetries) {
    try {
      // If this isn't the first attempt, modify the path to avoid conflicts
      const modifiedPath = retryCount === 0 
        ? path 
        : `retry${retryCount}_${Date.now()}_${path}`;
      
      return await attemptUpload(modifiedPath, file, retryCount);
    } catch (err) {
      retryCount++;
      error = err;
      
      if (retryCount <= maxRetries) {
        console.log(`Retrying upload (attempt ${retryCount} of ${maxRetries})`);
      }
    }
  }
  
  // If we get here, all attempts failed
  throw error;
}
