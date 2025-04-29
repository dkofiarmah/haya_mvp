'use client'

import imageCompression from 'browser-image-compression';

interface ImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

/**
 * Compresses an image file using browser-image-compression
 * @param file The image file to compress
 * @param options Compression options
 * @returns A promise that resolves to the compressed file
 */
export async function compressImage(
  file: File, 
  options: ImageCompressionOptions = {}
): Promise<File> {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    console.warn('Image compression can only run in browser environment');
    return file;
  }

  const defaultOptions = {
    maxSizeMB: 1, // Default to 1MB max
    maxWidthOrHeight: 1920, // Limit to 1920px width/height
    useWebWorker: true, // Use web worker for better performance
    quality: 0.8 // 80% quality is a good balance
  };

  const compressionOptions = { ...defaultOptions, ...options };
  
  try {
    // Log original image details
    console.log('Original image:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    });
    
    // Compress the image
    const compressedFile = await imageCompression(file, compressionOptions);
    
    // Log compressed image details
    console.log('Compressed image:', {
      name: compressedFile.name,
      type: compressedFile.type,
      size: `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    });
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Gets the dimensions of an image file
 * @param file The image file
 * @returns A promise that resolves to the image dimensions
 */
export function getImageDimensions(file: File): Promise<{width: number; height: number}> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('This function can only be used in the browser'));
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src); // Clean up
      reject(error);
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Formats file size in human-readable format
 * @param bytes The file size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

/**
 * Generates a thumbnail preview for an image file
 * @param file The image file
 * @param maxWidth Maximum width for the thumbnail
 * @returns A promise that resolves to a data URL for the thumbnail
 */
export function generateThumbnail(file: File, maxWidth = 300): Promise<string> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('This function can only be used in the browser'));
  }
  
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target || !e.target.result) {
            throw new Error('Failed to read file data');
          }
          
          const img = new Image();
          
          img.onload = () => {
            try {
              // Create a canvas with the desired dimensions
              const canvas = document.createElement('canvas');
              const aspectRatio = img.width / img.height;
              
              const width = Math.min(maxWidth, img.width);
              const height = width / aspectRatio;
              
              canvas.width = width;
              canvas.height = height;
              
              // Draw image on canvas
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                throw new Error('Could not get canvas context');
              }
              
              ctx.drawImage(img, 0, 0, width, height);
              
              // Get data URL (thumbnail)
              const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
              resolve(thumbnail);
            } catch (canvasError) {
              console.error('Error generating thumbnail canvas:', canvasError);
              reject(canvasError);
            }
          };
          
          img.onerror = (imgError) => {
            console.error('Failed to load image:', imgError);
            reject(new Error('Failed to load image for thumbnail generation'));
          };
          
          img.src = e.target.result as string;
        } catch (imgError) {
          console.error('Error processing FileReader result:', imgError);
          reject(imgError);
        }
      };
      
      reader.onerror = (readerError) => {
        console.error('FileReader error:', readerError);
        reject(new Error('Failed to read file for thumbnail generation'));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Unexpected error in generateThumbnail:', error);
      reject(error);
    }
  });
}
