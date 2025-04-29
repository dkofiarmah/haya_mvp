# Experience Image Management

This document outlines how images are handled in the Haya experience platform.

## Image Upload Process

The application uses a multi-step process to efficiently upload and serve images:

1. **Client-side compression**:
   - Images are compressed in the browser before upload using the `browser-image-compression` library
   - Compression levels are determined based on image size:
     - Small images (<2MB): Light compression (max 2MB, 2560px max dimension, 90% quality)
     - Medium images (2-5MB): Medium compression (max 1.5MB, 2400px max dimension, 80% quality)
     - Large images (>5MB): Heavy compression (max 1MB, 1920px max dimension, 70% quality)

2. **Upload to Supabase Storage**:
   - Compressed images are uploaded to the `experience-images` bucket
   - Images are organized in folders: `org_{organizationId}/{experienceId}/{filename}`
   - Upload progress is tracked and displayed to the user

3. **Optimized image serving**:
   - Images are served with Supabase's image transformation parameters for optimal performance
   - Main experience pages use `width=1200&quality=80` for balance between quality and performance
   - Thumbnails use `width=300&quality=70` for faster loading

## Image Gallery Component

The `ExperienceImageGallery` component provides a responsive, user-friendly way to display experience images:

- Automatically handles single or multiple images
- Supports full-screen viewing mode
- Includes navigation controls for browsing through images
- Shows thumbnails for quick selection
- Supports keyboard navigation
- Optimized for both desktop and mobile viewing

## Implementation Details

### Client-Side Image Utilities

We use custom utilities in `/lib/image-utils.ts` for image optimization:
- `compressImage()`: Compresses images before upload
- `generateThumbnail()`: Creates thumbnail previews while images are uploading
- `getImageDimensions()`: Gets width/height of images for aspect ratio calculations
- `formatFileSize()`: Formats file sizes for user display

### Server-Side Image Handling

In server actions (like `create-experience.ts`), we:
- Accept uploads from the client
- Apply Supabase transformation parameters for optimized delivery
- Store optimized image URLs in the database

## Best Practices

1. **Image Sizes**:
   - Recommend landscape orientation (16:9 aspect ratio) 
   - Optimal resolution: 1920×1080
   - Maximum pre-compression size: 10MB

2. **Image Types**:
   - Preferred: JPEG, WebP
   - Supported: PNG
   - Automatically converted to WebP where browser support exists

## Future Improvements

Planned enhancements:
- Add image cropping tool for consistent aspect ratios
- Implement drag-and-drop reordering of images
- Add AI-based image optimization for content-aware compression
- Add WebP conversion for older image formats
