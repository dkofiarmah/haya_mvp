'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { supabaseClient } from '@/lib/supabase/auth-client'
import { compressImage, formatFileSize, generateThumbnail } from '@/lib/image-utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  Upload,
  Wand2,
  Camera,
  ImageIcon
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

// Define the enhanced form schema with zod
const experienceSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  categories: z.array(z.string()).optional(),
  duration_minutes: z.coerce.number().min(15, { message: 'Duration must be at least 15 minutes.' }),
  max_group_size: z.coerce.number().min(1, { message: 'Max group size is required.' }),
  min_group_size: z.coerce.number().min(1, { message: 'Min group size is required.' }),
  price_per_person: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  currency: z.string().default('USD'),
  location: z.string().min(3, { message: 'Location is required.' }),
  meeting_point: z.string().optional(),
  cancellation_policy: z.string().min(3, { message: 'Cancellation policy is required.' }),
  tags: z.string().optional(),
  is_active: z.boolean().default(true),
  is_archived: z.boolean().default(false),
  
  // Enhanced fields
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  not_included: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  available_dates: z.array(z.string()).optional(),
  booking_notice_hours: z.coerce.number().min(0).optional(),
  is_bookable_online: z.boolean().default(true),
  is_shareable: z.boolean().default(true),
  shareable_token: z.string().optional(),
  shareable_url: z.string().optional(),
  ai_description: z.string().optional(),
})

// Get the TypeScript type from the schema
type ExperienceValues = z.infer<typeof experienceSchema>

// Default values for the form
const defaultValues: Partial<ExperienceValues> = {
  name: '',
  description: '',
  category: '',
  categories: [],
  duration_minutes: 60,
  max_group_size: 10,
  min_group_size: 1,
  price_per_person: 0,
  currency: 'USD',
  location: '',
  meeting_point: '',
  cancellation_policy: 'Flexible',
  tags: '',
  is_active: true,
  is_archived: false,
  highlights: [''],
  included: [''],
  not_included: [''],
  requirements: [''],
  languages: ['English'],
  images: [],
  available_dates: [],
  booking_notice_hours: 24,
  is_bookable_online: true,
  is_shareable: true,
  shareable_token: '',
  shareable_url: '',
  ai_description: '',
}

interface ExperienceFormProps {
  action?: (formData: FormData) => Promise<any>;
  initialData?: Partial<ExperienceValues> & { id?: string };
  mode?: 'create' | 'edit';
}

export default function ExperienceForm({ 
  action, 
  initialData, 
  mode = 'create' 
}: ExperienceFormProps): React.ReactNode {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingOrg, setIsLoadingOrg] = useState(true)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<{[key: string]: string}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Initialize experienceId from initialData if in edit mode
  const experienceId = initialData?.id

  // Add tab navigation state
  const [activeTab, setActiveTab] = useState('basic')
  const tabOrder = ['basic', 'details', 'inclusions', 'images', 'booking']
  const currentTabIndex = tabOrder.indexOf(activeTab)

  // Function to validate required fields before tab navigation
  const canMoveToNextTab = (nextTab: string) => {
    const currentValues = form.getValues()
    
    // Define required fields for each tab
    const tabValidation: { [key: string]: string[] } = {
      basic: ['name', 'category', 'description', 'duration_minutes', 'price_per_person', 'location'],
      details: ['cancellation_policy'],
      inclusions: [],
      images: [],
      booking: ['booking_notice_hours']
    }

    // If moving backwards, always allow
    if (tabOrder.indexOf(nextTab) < tabOrder.indexOf(activeTab)) {
      return true
    }

    // Check if all required fields in current tab are filled
    const requiredFields = tabValidation[activeTab]
    const hasEmptyFields = requiredFields.some(field => {
      const value = currentValues[field as keyof typeof currentValues]
      return !value || (typeof value === 'string' && value.trim() === '')
    })

    if (hasEmptyFields) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  // Create form with React Hook Form and zod validation
  const form = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
      // Convert string to array for tags if needed
      tags: initialData?.tags ? (typeof initialData.tags === 'string' ? initialData.tags : initialData.tags.join(', ')) : '',
      // Ensure arrays are initialized properly
      highlights: initialData?.highlights?.length ? initialData.highlights : [''],
      included: initialData?.included?.length ? initialData.included : [''],
      not_included: initialData?.not_included?.length ? initialData.not_included : [''],
      requirements: initialData?.requirements?.length ? initialData.requirements : [''],
      languages: initialData?.languages?.length ? initialData.languages : ['English'],
      images: initialData?.images?.length ? initialData.images : [],
    },
  })

  // Setup field arrays for multi-item lists
  const highlightsFieldArray = useFieldArray({
    control: form.control,
    name: 'highlights',
  })

  const includedFieldArray = useFieldArray({
    control: form.control,
    name: 'included',
  })

  const notIncludedFieldArray = useFieldArray({
    control: form.control,
    name: 'not_included',
  })

  const requirementsFieldArray = useFieldArray({
    control: form.control,
    name: 'requirements',
  })

  const languagesFieldArray = useFieldArray({
    control: form.control,
    name: 'languages',
  })

  // Categories options
  const categories = [
    'Adventure',
    'Cultural',
    'Culinary',
    'Nature',
    'Wildlife',
    'City Tour',
    'Historical',
    'Wellness',
    'Educational',
    'Photography',
    'Luxury',
    'Nightlife'
  ]

  // Language options
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Arabic', 'Russian', 'Portuguese', 'Italian', 'Dutch', 'Korean',
    'Hindi', 'Turkish', 'Vietnamese', 'Thai', 'Swedish', 'Greek'
  ]

  // Fetch the organization ID when the component mounts
  useEffect(() => {
    async function fetchUserOrganization() {
      try {
        setIsLoadingOrg(true)
        setError(null)
        
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        
        if (userError || !user) {
          throw new Error(userError?.message || 'Not authenticated')
        }
        
        // Get the organization memberships for this user
        const { data: orgUsers, error: orgUsersError } = await supabaseClient
          .from('organization_users')
          .select('organization_id')
          .eq('user_id', user.id)
          .limit(1)
        
        if (orgUsersError) {
          throw new Error(`Failed to fetch organization memberships: ${orgUsersError.message}`)
        }
        
        if (!orgUsers || orgUsers.length === 0) {
          setError('You are not a member of any organization. Please create or join an organization first.')
          return
        }
        
        // Set the organization ID
        setOrganizationId(orgUsers[0].organization_id)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('Error fetching user organization:', errorMessage)
        setError(`Error fetching organization: ${errorMessage}`)
      } finally {
        setIsLoadingOrg(false)
      }
    }
    
    // Only fetch if we're creating a new experience (not editing)
    if (mode === 'create') {
      fetchUserOrganization()
    } else {
      setIsLoadingOrg(false)
    }
  }, [mode])

  // Handle image uploads
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
      
      // Create a unique folder ID for this upload session if we don't have an experience ID yet
      const uploadFolderId = initialData?.id || `temp_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
      
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
          if (typeof generateThumbnail === 'function') {
            try {
              const preview = await generateThumbnail(file)
              previews[file.name] = preview
            } catch (previewError) {
              console.warn('Failed to generate preview, continuing without preview:', previewError)
            }
          } else {
            console.warn('generateThumbnail function not available, skipping preview generation')
          }
        } catch (error) {
          console.error('Error generating preview for file:', file.name, error)
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
            
            // Compress the image if function is available
            if (typeof compressImage === 'function') {
              compressedFile = await compressImage(file, compressionOptions)
            } else {
              console.warn('compressImage function not available, using original file')
            }
            
            // Update progress to 40% - compression complete
            setUploadProgress(prev => ({ ...prev, [file.name]: 40 }))
          } catch (compressionError) {
            console.error('Image compression failed, using original file:', compressionError)
            // Continue with original file
          }
          
          // Organize storage with a simpler path structure
          const filePath = `org_${organizationId}/${uploadFolderId}/${fileName}`
          
          // Update progress to 50% - starting upload
          setUploadProgress(prev => ({ ...prev, [file.name]: 50 }))
          
          // Try to upload the file
          try {
            console.log(`Attempting to upload ${filePath} with size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)
            
            // First check if the bucket exists
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
            
            if (bucketsError) {
              console.error('Error checking buckets:', bucketsError)
              throw new Error(`Failed to check storage buckets: ${bucketsError.message}`)
            }
            
            // Check if our bucket exists
            const bucketExists = buckets?.some(bucket => bucket.name === 'experience-images')
            
            // Create bucket if it doesn't exist
            if (!bucketExists) {
              console.log('Bucket does not exist, creating it...')
              const { error: createBucketError } = await supabase.storage.createBucket('experience-images', {
                public: true
              })
              
              if (createBucketError) {
                console.error('Failed to create bucket:', createBucketError)
                throw new Error(`Failed to create storage bucket: ${createBucketError.message}`)
              }
            }
            
            // Upload the file with proper content type
            const { data, error } = await supabase.storage
              .from('experience-images')
              .upload(filePath, compressedFile, {
                cacheControl: '3600',
                upsert: true,
                contentType: compressedFile.type || 'image/jpeg'
              })

            if (error) {
              console.error(`Upload error for file ${index + 1}:`, error)
              
              // Simplify error handling - try with a more basic approach
              console.log('Trying simplified upload...')
              const simplePath = `uploads/${Date.now()}_${fileName}`
              const { data: retryData, error: retryError } = await supabase.storage
                .from('experience-images')
                .upload(simplePath, file, {
                  cacheControl: '3600',
                  upsert: true,
                  contentType: file.type || 'image/jpeg'
                })
              
              if (retryError) {
                console.error('Simplified upload failed:', retryError)
                throw retryError
              }
              
              // Get URL from simple path
              const { data: simpleUrlData } = supabase.storage
                .from('experience-images')
                .getPublicUrl(simplePath)
              
              if (!simpleUrlData || !simpleUrlData.publicUrl) {
                throw new Error('Failed to get public URL for uploaded file')
              }
              
              // Update progress to 100% - complete
              setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
              
              console.log(`Successfully uploaded file ${index + 1} with simple path, URL:`, simpleUrlData.publicUrl)
              return simpleUrlData.publicUrl
            }
            
            // Update progress to 80% - upload complete, getting URL
            setUploadProgress(prev => ({ ...prev, [file.name]: 80 }))
            
            // Get the public URL for the uploaded file
            const { data: urlData } = supabase.storage
              .from('experience-images')
              .getPublicUrl(filePath)
              
            // Update progress to 100% - complete
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
            
            console.log(`Successfully uploaded file ${index + 1}, URL:`, urlData.publicUrl)
            return urlData.publicUrl
          } catch (uploadError) {
            console.error(`Upload attempt failed for file ${index + 1}:`, uploadError)
            
            // As a last resort, try uploading with a very basic approach
            try {
              console.log('Trying last resort upload with minimal options')
              const lastResortPath = `last_resort_${Date.now()}_${fileName}`
              const lastResortUpload = await supabase.storage
                .from('experience-images')
                .upload(lastResortPath, file)
              
              if (lastResortUpload.error) {
                console.error('Last resort upload failed:', lastResortUpload.error)
                throw lastResortUpload.error
              }
              
              const { data: lastResortUrlData } = supabase.storage
                .from('experience-images')
                .getPublicUrl(lastResortPath)
              
              setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
              console.log(`Last resort upload succeeded for file ${index + 1}, URL:`, lastResortUrlData.publicUrl)
              return lastResortUrlData.publicUrl
            } catch (finalError) {
              console.error('All upload attempts failed:', finalError)
              throw finalError
            }
          }
        } catch (fileError) {
          console.error(`Error processing file ${index + 1}:`, fileError)
          // Mark as failed
          setUploadProgress(prev => ({ ...prev, [file.name]: -1 }))
          throw fileError
        }
      })

      try {
        // Use Promise.allSettled instead of Promise.all to handle partial success
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
          console.warn(`${failedUploads.length} out of ${uploadResults.length} uploads failed:`, failedUploads)
        }
        
        if (successfulUploads.length === 0) {
          toast({
            title: "Upload failed",
            description: "All image uploads failed. Please try again with different images or check your connection.",
            variant: "destructive"
          })
          return
        }
        
        // Update form state with the successful image URLs
        const currentImages = form.getValues('images') || []
        const updatedImages = [...currentImages, ...successfulUploads]
        form.setValue('images', updatedImages)
        setUploadedImages(updatedImages)

        // Show appropriate success message
        if (successfulUploads.length === uploadResults.length) {
          toast({
            title: "Images uploaded",
            description: `Successfully uploaded ${successfulUploads.length} images`,
          })
        } else {
          toast({
            title: "Partial upload success",
            description: `${successfulUploads.length} out of ${uploadResults.length} images were uploaded successfully.`,
            variant: "default"
          })
        }
      } catch (error) {
        // This shouldn't happen with Promise.allSettled, but just in case
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error processing uploads:', errorMessage, error)
        
        toast({
          title: "Upload failed",
          description: `Failed to process uploads: ${errorMessage}`,
          variant: "destructive"
        })
      } finally {
        setUploading(false)
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
  } catch (error) {
    // Handle any unhandled errors in the overall upload process
    console.error('Unhandled error in image upload process:', error);
    setUploading(false);
    toast({
      title: "Upload failed",
      description: "There was an error uploading your images. Please try again.",
      variant: "destructive"
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
  
  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Generate AI description
  const generateAiDescription = async () => {
    const experienceName = form.getValues('name')
    const category = form.getValues('category')
    const location = form.getValues('location')
    
    if (!experienceName || !category || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in the name, category and location before generating an AI description",
        variant: "destructive"
      })
      return
    }

    try {
      toast({
        title: "Generating description",
        description: "Please wait while we generate a description for your experience",
      })

      // In a real implementation, this would call an AI service
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const aiDescription = `Embark on an unforgettable ${category.toLowerCase()} experience in ${location}. 
Our "${experienceName}" tour offers visitors a unique opportunity to explore and discover the rich cultural 
heritage and natural beauty of the area. Join our knowledgeable guides as they take you on a journey that 
combines education, adventure, and authentic local experiences. Perfect for travelers seeking to create 
lasting memories and gain deeper insights into this fascinating destination.`
      
      form.setValue('description', aiDescription)
      form.setValue('ai_description', aiDescription)

      toast({
        title: "Description generated",
        description: "AI-generated description has been added to your experience",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast({
        title: "Generation failed",
        description: `Failed to generate AI description: ${errorMessage}`,
        variant: "destructive"
      })
    }
  }

  // Handle form submission
  async function onSubmit(values: ExperienceValues) {
    try {
      setIsSubmitting(true)
      
      // If there's a custom action provided (like a server action), use it
      if (action) {
        const formData = new FormData()
        
        // Add all form values to the FormData
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              // For arrays, add each item individually with the same key
              // This allows server actions to correctly process arrays with formData.getAll()
              value.forEach(item => {
                if (item !== undefined && item !== null && item !== '') {
                  formData.append(key, item.toString())
                }
              })
            } else {
              formData.append(key, value.toString())
            }
          }
        })
        
        // Add organization ID if available
        if (organizationId) {
          formData.append('org_id', organizationId)
        }
        
        await action(formData)
      } else {
        // Direct Supabase operation
        // Convert comma-separated tags to array
        const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : []
        
        // Filter out empty array items
        const highlights = values.highlights?.filter(item => item.trim() !== '') || []
        const included = values.included?.filter(item => item.trim() !== '') || []
        const notIncluded = values.not_included?.filter(item => item.trim() !== '') || []
        const requirements = values.requirements?.filter(item => item.trim() !== '') || []
        const languages = values.languages?.filter(item => item.trim() !== '') || []
        
        if (mode === 'create') {
          // Ensure we have an organization ID for new experiences
          if (!organizationId) {
            throw new Error('Organization ID is required to create an experience')
          }
          
          // Create new experience
          const { error: insertError } = await supabase
            .from('experiences')
            .insert({
              org_id: organizationId,
              name: values.name,
              description: values.description,
              category: values.category,
              duration_minutes: values.duration_minutes,
              max_group_size: values.max_group_size,
              min_group_size: values.min_group_size,
              price_per_person: values.price_per_person,
              location: values.location,
              meeting_point: values.meeting_point,
              cancellation_policy: values.cancellation_policy,
              tags: tagsArray,
              is_active: values.is_active,
              highlights: highlights,
              included: included,
              not_included: notIncluded,
              requirements: requirements,
              languages: languages,
              images: values.images || [],
              booking_notice_hours: values.booking_notice_hours,
              is_bookable_online: values.is_bookable_online,
              is_shareable: values.is_shareable,
              ai_description: values.ai_description
            })
          
          if (insertError) {
            throw insertError
          }
        } else if (initialData?.id) {
          // Update existing experience
          const { error: updateError } = await supabase
            .from('experiences')
            .update({
              name: values.name,
              description: values.description,
              category: values.category,
              duration_minutes: values.duration_minutes,
              max_group_size: values.max_group_size,
              min_group_size: values.min_group_size,
              price_per_person: values.price_per_person,
              location: values.location,
              meeting_point: values.meeting_point,
              cancellation_policy: values.cancellation_policy,
              tags: tagsArray,
              is_active: values.is_active,
              highlights: highlights,
              included: included,
              not_included: notIncluded,
              requirements: requirements,
              languages: languages,
              images: values.images || [],
              booking_notice_hours: values.booking_notice_hours,
              is_bookable_online: values.is_bookable_online,
              is_shareable: values.is_shareable,
              ai_description: values.ai_description
            })
            .eq('id', initialData.id)
          
          if (updateError) {
            throw updateError
          }
        }
      }
      
      // Show success message
      toast({
        title: initialData?.id ? "Experience updated!" : "Experience created!",
        description: initialData?.id 
          ? "Your experience has been updated successfully." 
          : "Your new experience has been created successfully.",
      })
      
      // Redirect to experiences page
      router.push('/experiences')
      router.refresh()
    } catch (error) {
      // Handle and display error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error saving experience:', errorMessage)
      
      toast({
        title: "Error",
        description: `Failed to save experience: ${errorMessage}`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoadingOrg) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading organization information...</p>
        </div>
      </div>
    )
  }

  // Show error if organization isn't found and we're creating a new experience
  if (error && mode === 'create') {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Render the form
  return (
    <Card className="w-full mx-auto min-h-screen flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>{initialData?.id ? 'Edit Experience' : 'Create New Experience'}</CardTitle>
        <CardDescription>
          {initialData?.id 
            ? 'Update the details of your existing experience.'
            : 'Fill in the details to create a new experience for your customers.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => {
                const currentValues = form.getValues();
                const requiredFields = {
                  basic: ['name', 'category', 'description', 'duration_minutes', 'price_per_person', 'location'],
                  details: ['cancellation_policy'],
                  inclusions: [],
                  images: [],
                  booking: ['booking_notice_hours']
                };

                // If moving backwards, allow it
                if (tabOrder.indexOf(value) < tabOrder.indexOf(activeTab)) {
                  setActiveTab(value);
                  return;
                }

                // Check if required fields in current tab are filled
                const currentTabFields = requiredFields[activeTab as keyof typeof requiredFields];
                const hasEmptyFields = currentTabFields.some(field => {
                  const fieldValue = currentValues[field as keyof typeof currentValues];
                  return !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '');
                });

                if (hasEmptyFields) {
                  toast({
                    title: "Required Fields",
                    description: "Please fill in all required fields before proceeding.",
                    variant: "destructive"
                  });
                  return;
                }

                setActiveTab(value);
              }} 
              className="w-full">
              <TabsList className="grid grid-cols-5 w-full sticky top-0 bg-white z-20 border-b p-1 shadow-sm mb-4">
                <TabsTrigger 
                  value="basic" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md py-2 transition-all"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="details"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md py-2 transition-all"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="inclusions"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md py-2 transition-all"
                >
                  Inclusions
                </TabsTrigger>
                <TabsTrigger 
                  value="images"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md py-2 transition-all"
                >
                  Images
                </TabsTrigger>
                <TabsTrigger 
                  value="booking"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md py-2 transition-all"
                >
                  Booking
                </TabsTrigger>
              </TabsList>
              
              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="mr-1">Experience Name</span><span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter experience name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your experience that will be displayed to customers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="mr-1">Categories</span><span className="text-destructive">*</span></FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                            {field.value?.map((category, index) => (
                              <div key={index} className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                                <span>{category}</span>
                                <button 
                                  type="button"
                                  className="ml-2 text-primary hover:text-primary/80"
                                  onClick={() => {
                                    const newCategories = [...field.value || []];
                                    newCategories.splice(index, 1);
                                    field.onChange(newCategories);
                                    
                                    // Ensure original category field is also updated
                                    if (newCategories.length > 0) {
                                      form.setValue('category', newCategories[0]);
                                    } else {
                                      form.setValue('category', '');
                                    }
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {(field.value?.length || 0) === 0 && (
                              <span className="text-muted-foreground text-sm p-1">
                                No categories selected
                              </span>
                            )}
                          </div>
                          
                          <Select 
                            onValueChange={(value) => {
                              // Get current categories
                              const currentCategories = field.value || [];
                              
                              // Only add if not already in the array
                              if (!currentCategories.includes(value)) {
                                const newCategories = [...currentCategories, value];
                                field.onChange(newCategories);
                                
                                // Also update the original category field for backward compatibility
                                if (newCategories.length > 0 && !form.getValues('category')) {
                                  form.setValue('category', newCategories[0]);
                                }
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Add a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormDescription>
                          Select one or more categories that describe your experience.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel><span className="mr-1">Description</span><span className="text-destructive">*</span></FormLabel>
                        <div className="space-y-3">
                          <FormControl>
                            <Textarea 
                              placeholder="Start with a brief description (2-3 sentences) and click 'Enhance with AI' to expand it..."
                              className="min-h-[120px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <div className="flex items-center gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="h-7 px-3 text-xs shrink-0"
                              onClick={generateAiDescription}
                            >
                              <Wand2 className="mr-1.5 h-3 w-3" />
                              Enhance with AI
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              AI will expand your brief description into a comprehensive experience overview
                            </p>
                          </div>
                          <FormDescription>
                            Provide a detailed description of what customers can expect.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => {
                      // Create a wrapper for the duration input
                      const [durationValue, setDurationValue] = useState(field.value);
                      const [durationUnit, setDurationUnit] = useState('minutes');

                      // Function to update the field value based on the unit
                      const updateDuration = (value: number, unit: string) => {
                        let minutesValue = value;
                        if (unit === 'hours') {
                          minutesValue = value * 60;
                        } else if (unit === 'days') {
                          minutesValue = value * 60 * 24;
                        }
                        field.onChange(minutesValue);
                      };

                      // Init from current value when component mounts
                      useEffect(() => {
                        if (field.value) {
                          if (field.value % (60 * 24) === 0) {
                            setDurationValue(field.value / (60 * 24));
                            setDurationUnit('days');
                          } else if (field.value % 60 === 0) {
                            setDurationValue(field.value / 60);
                            setDurationUnit('hours');
                          } else {
                            setDurationValue(field.value);
                            setDurationUnit('minutes');
                          }
                        }
                      }, []);

                      return (
                        <FormItem>
                          <FormLabel><span className="mr-1">Duration</span><span className="text-destructive">*</span></FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                value={durationValue}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  setDurationValue(value);
                                  updateDuration(value, durationUnit);
                                }}
                              />
                            </FormControl>
                            <Select 
                              value={durationUnit}
                              onValueChange={(value) => {
                                setDurationUnit(value);
                                updateDuration(durationValue, value);
                              }}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minutes">Minutes</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                                <SelectItem value="days">Days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormDescription>
                            How long does this experience last?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="price_per_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="mr-1">Price per Person</span><span className="text-destructive">*</span></FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field: currencyField }) => (
                              <Select 
                                value={currencyField.value} 
                                onValueChange={currencyField.onChange}
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">🇺🇸 USD</SelectItem>
                                  <SelectItem value="NGN">🇳🇬 NGN</SelectItem>
                                  <SelectItem value="ZAR">🇿🇦 ZAR</SelectItem>
                                  <SelectItem value="KES">🇰🇪 KES</SelectItem>
                                  <SelectItem value="GHS">🇬🇭 GHS</SelectItem>
                                  <SelectItem value="EGP">🇪🇬 EGP</SelectItem>
                                  <SelectItem value="MAD">🇲🇦 MAD</SelectItem>
                                  <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                                  <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <FormDescription>
                          The price per person for this experience.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="mr-1">Location</span><span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cape Town, South Africa" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where this experience takes place.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meeting_point"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Point</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., V&A Waterfront, Cape Town" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormDescription>
                          Specific location where customers should meet you.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_group_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Group Size</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Minimum number of participants required.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_group_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Group Size</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum number of participants allowed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      // Handle tags as an array internally
                      const [tagInput, setTagInput] = useState('');
                      const [tagArray, setTagArray] = useState<string[]>(() => {
                        // Initialize from field value (comma-separated string)
                        if (field.value && typeof field.value === 'string') {
                          return field.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        }
                        return [];
                      });

                      // Update field value when tags change
                      useEffect(() => {
                        field.onChange(tagArray.join(', '));
                      }, [tagArray, field]);

                      // Add a new tag
                      const addTag = () => {
                        if (tagInput.trim()) {
                          // Split by commas in case user types multiple tags
                          const newTags = tagInput.split(',').map(tag => tag.trim()).filter(Boolean);
                          
                          // Add all new tags that aren't duplicates
                          const updatedTags = [...tagArray];
                          newTags.forEach(tag => {
                            if (!updatedTags.includes(tag)) {
                              updatedTags.push(tag);
                            }
                          });
                          
                          setTagArray(updatedTags);
                          setTagInput('');
                        }
                      };

                      // Remove a tag
                      const removeTag = (index: number) => {
                        const updatedTags = [...tagArray];
                        updatedTags.splice(index, 1);
                        setTagArray(updatedTags);
                      };

                      return (
                        <FormItem className="col-span-2">
                          <FormLabel>Tags</FormLabel>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
                              {tagArray.map((tag, index) => (
                                <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1 text-sm">
                                  <span>{tag}</span>
                                  <button 
                                    type="button"
                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => removeTag(index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              {tagArray.length === 0 && (
                                <span className="text-muted-foreground text-sm p-1">
                                  No tags added yet
                                </span>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Add tag (press Enter or comma to add)" 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    addTag();
                                  }
                                }}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={addTag}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                          <FormDescription>
                            Add relevant tags to help customers find your experience.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Enable or disable this experience from being visible to customers.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Highlights</h3>
                    <p className="text-sm text-muted-foreground">
                      Add key highlights of your experience to attract customers.
                    </p>
                  </div>
                  
                  {/* Highlights Fields */}
                  {highlightsFieldArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`highlights.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Stunning panoramic views from the mountain top" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => highlightsFieldArray.remove(index)}
                        disabled={highlightsFieldArray.fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => highlightsFieldArray.append('')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Highlight
                  </Button>

                  <div className="space-y-2 mt-6">
                    <h3 className="text-lg font-medium">Requirements</h3>
                    <p className="text-sm text-muted-foreground">
                      List any requirements for participants.
                    </p>
                  </div>
                  
                  {/* Requirements Fields */}
                  {requirementsFieldArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`requirements.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Participants must be at least 18 years old" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => requirementsFieldArray.remove(index)}
                        disabled={requirementsFieldArray.fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => requirementsFieldArray.append('')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Requirement
                  </Button>

                  <div className="space-y-2 mt-6">
                    <h3 className="text-lg font-medium">Languages</h3>
                    <p className="text-sm text-muted-foreground">
                      Select languages offered for this experience.
                    </p>
                  </div>
                  
                  {/* Languages Fields */}
                  {languagesFieldArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`languages.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {languageOptions.map((language) => (
                                  <SelectItem key={language} value={language}>
                                    {language}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => languagesFieldArray.remove(index)}
                        disabled={languagesFieldArray.fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => languagesFieldArray.append('English')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Language
                  </Button>

                  <FormField
                    control={form.control}
                    name="cancellation_policy"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Cancellation Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your cancellation policy" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Explain your policy for cancellations and refunds.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Inclusions Tab */}
              <TabsContent value="inclusions" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">What's Included</h3>
                    <p className="text-sm text-muted-foreground">
                      List items and services that are included in the experience.
                    </p>
                  </div>
                  
                  {/* Included Fields */}
                  {includedFieldArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`included.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Guided tour with a professional local guide" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => includedFieldArray.remove(index)}
                        disabled={includedFieldArray.fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => includedFieldArray.append('')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Included Item
                  </Button>

                  <div className="space-y-2 mt-6">
                    <h3 className="text-lg font-medium">What's Not Included</h3>
                    <p className="text-sm text-muted-foreground">
                      List items and services that are not included in the experience.
                    </p>
                  </div>
                  
                  {/* Not Included Fields */}
                  {notIncludedFieldArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`not_included.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Meals and drinks not mentioned" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => notIncludedFieldArray.remove(index)}
                        disabled={notIncludedFieldArray.fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => notIncludedFieldArray.append('')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Not Included Item
                  </Button>
                </div>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-6 pt-6">
                <div className="space-y-4">
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
                              <Upload className="mr-2 h-4 w-4" />
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
                    {(form.watch('images')?.length > 0 || Object.keys(imagePreviews).length > 0) && (
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
                          {form.watch('images')?.map((imageUrl, index) => (
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
                                  onClick={() => {
                                    const currentImages = [...form.getValues('images')]
                                    currentImages.splice(index, 1)
                                    form.setValue('images', currentImages)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Reorder instructions */}
                        {form.watch('images')?.length > 1 && (
                          <p className="mt-4 text-sm text-muted-foreground">
                            <strong>Tip:</strong> You can delete images and re-upload them in your preferred order.
                            The first image will be featured as the main image for your experience.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Booking Tab */}
              <TabsContent value="booking" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Booking Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how customers can book this experience.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="is_bookable_online"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Online Booking</FormLabel>
                          <FormDescription>
                            Allow customers to book this experience online.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="booking_notice_hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Notice (hours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || 24}
                          />
                        </FormControl>
                        <FormDescription>
                          How many hours in advance must customers book this experience.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_shareable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Shareable</FormLabel>
                          <FormDescription>
                            Allow sharing this experience on social media and via direct links.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
         
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4 pb-2">
                <div className="flex-1" />
                <div className="flex gap-2">
                  {currentTabIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab(tabOrder[currentTabIndex - 1])}
                    >
                      Previous
                    </Button>
                  )}
                  {currentTabIndex < tabOrder.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab(tabOrder[currentTabIndex + 1])}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {initialData?.id ? 'Update Experience' : 'Create Experience'}
                    </Button>
                  )}
                </div>
              </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}}
