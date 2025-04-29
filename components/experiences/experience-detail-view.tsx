'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import { duplicateExperience, deleteExperience } from '@/app/actions/experiences'
import { toggleExperienceShareable, regenerateShareableToken, getTimeSlotsForExperience } from '@/app/actions/experience-bookings'
import ExperienceValidation from './experience-validation'
import BookingTimeSlotManager from './booking-time-slot-manager'
import ShareableLinkManager from './shareable-link-manager'
import {
  CircleCheck,
  CircleX,
  Edit,
  Copy,
  Trash2,
  Share2,
  Clock,
  Users,
  MapPin,
  Tag,
  ChevronRight,
  Globe,
  DollarSign,
  Layers
} from 'lucide-react'

interface ExperienceDetailViewProps {
  experience: any
}

export default function ExperienceDetailView({ experience }: ExperienceDetailViewProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [timeSlots, setTimeSlots] = useState([])
  
  // Fetch time slots when the component loads
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (experience.id) {
        const slots = await getTimeSlotsForExperience(experience.id)
        setTimeSlots(slots)
      }
    }
    
    fetchTimeSlots()
  }, [experience.id])
  
  // Handle sharing the experience
  const handleShare = () => {
    if (!experience.is_shareable || !experience.shareable_token) {
      toast({
        title: 'Sharing Not Enabled',
        description: 'Enable sharing in the Sharing tab first',
        variant: 'destructive',
      })
      setActiveTab('sharing')
      return
    }
    
    const url = `${window.location.origin}/experiences/share-redirect/${experience.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Experience shareable link copied to clipboard',
    })
  }
  
  // Handle toggling shareable status
  const handleToggleShareable = async (isShareable: boolean) => {
    await toggleExperienceShareable(experience.id, isShareable)
    // Refresh the page to update the experience data
    router.refresh()
    return { success: true }
  }
  
  // Handle regenerating shareable token
  const handleRegenerateToken = async () => {
    const result = await regenerateShareableToken(experience.id)
    // Refresh the page to update the experience data
    router.refresh()
    return result
  }
  
  // Handle duplication of the experience
  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true)
      const result = await duplicateExperience(experience.id)
      toast({
        title: 'Experience Duplicated',
        description: 'A copy of the experience has been created',
      })
      router.push(`/experiences/${result.newId}`)
    } catch (error) {
      console.error('Failed to duplicate experience:', error)
      toast({
        title: 'Duplication Failed',
        description: 'There was an error duplicating the experience',
        variant: 'destructive',
      })
    } finally {
      setIsDuplicating(false)
    }
  }
  
  // Handle deletion of the experience
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteExperience(experience.id)
      toast({
        title: 'Experience Deleted',
        description: 'The experience has been permanently deleted',
      })
      router.push('/experiences')
    } catch (error) {
      console.error('Failed to delete experience:', error)
      toast({
        title: 'Deletion Failed',
        description: 'There was an error deleting the experience',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setIsConfirmOpen(false)
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{experience.name}</h1>
            {experience.is_active ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CircleCheck className="w-3 h-3 mr-1" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <CircleX className="w-3 h-3 mr-1" />
                Inactive
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">
            {experience.category} • {experience.location}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            disabled={isDuplicating}
          >
            <Copy className="w-4 h-4 mr-2" />
            {isDuplicating ? 'Duplicating...' : 'Duplicate'}
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <Link href={`/experiences/${experience.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          
          <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this experience. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Photos</h2>
                {experience.images && experience.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {experience.images.map((image: string, index: number) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Experience image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                            Main Photo
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-gray-500">
                    <p>No images available</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href={`/experiences/${experience.id}/edit?tab=media`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Add Images
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About</h2>
                <div className="prose max-w-none">
                  <p>{experience.description}</p>
                </div>
              </div>
              
              {/* Highlights */}
              {experience.highlights && experience.highlights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Highlights</h2>
                  <ul className="space-y-2">
                    {experience.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Inclusions and Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Included */}
                {experience.included && experience.included.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">What's Included</h2>
                    <ul className="space-y-2">
                      {experience.included.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="ml-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Not Included */}
                {experience.not_included && experience.not_included.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Not Included</h2>
                    <ul className="space-y-2">
                      {experience.not_included.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CircleX className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="ml-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Requirements */}
              {experience.requirements && experience.requirements.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Requirements</h2>
                  <ul className="space-y-2">
                    {experience.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Right Column - Summary & Details */}
            <div className="space-y-8">
              {/* Validation */}
              <ExperienceValidation experience={experience} />
              
              {/* Summary Card */}
              <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-semibold">Details</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Price</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(experience.price_per_person, experience.currency)} per person
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-500">
                        {experience.duration_minutes >= 60 
                          ? `${Math.floor(experience.duration_minutes / 60)} hour${Math.floor(experience.duration_minutes / 60) !== 1 ? 's' : ''}` 
                          : ''}
                        {experience.duration_minutes % 60 > 0 
                          ? `${experience.duration_minutes >= 60 ? ' ' : ''}${experience.duration_minutes % 60} minute${experience.duration_minutes % 60 !== 1 ? 's' : ''}` 
                          : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Group Size</p>
                      <p className="text-sm text-gray-500">
                        {experience.min_group_size} to {experience.max_group_size} people
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-500">{experience.location}</p>
                      {experience.meeting_point && (
                        <p className="text-xs text-gray-500 mt-1">Meeting point: {experience.meeting_point}</p>
                      )}
                    </div>
                  </div>
                  
                  {experience.languages && experience.languages.length > 0 && (
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Languages</p>
                        <p className="text-sm text-gray-500">
                          {experience.languages.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Cancellation Policy</p>
                      <p className="text-sm text-gray-500">{experience.cancellation_policy}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Settings */}
              <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-semibold">Booking Settings</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">Online Booking</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      experience.is_bookable_online 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {experience.is_bookable_online ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">Shareable</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      experience.is_shareable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {experience.is_shareable ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">Booking Notice</p>
                    <span className="text-sm text-gray-500">
                      {experience.booking_notice_hours} hours
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              {experience.tags && experience.tags.length > 0 && (
                <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {experience.tags.map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Time Slots & Availability</h2>
            <div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/experiences/${experience.id}/edit?tab=booking`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Booking Settings
                </Link>
              </Button>
            </div>
          </div>
          
          <BookingTimeSlotManager 
            experienceId={experience.id}
            initialTimeSlots={timeSlots}
          />
        </TabsContent>
        
        {/* Sharing Tab */}
        <TabsContent value="sharing" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Sharing & Public View</h2>
              <p className="text-gray-500 mt-1">
                Allow others to view and book this experience through a shareable link.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Shareable Link Management</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enable sharing to generate a public link for this experience.
                  Anyone with the link can view the experience details and book it online.
                </p>
                
                <div className="flex items-center justify-between">
                  <p>Sharing status:</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    experience.is_shareable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {experience.is_shareable ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <ShareableLinkManager
                  experienceId={experience.id}
                  isShareable={experience.is_shareable || false}
                  shareableToken={experience.shareable_token}
                  onToggleShareable={handleToggleShareable}
                  onRegenerate={handleRegenerateToken}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Embedding Options</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Use the following embed code to display this experience on your website.
                </p>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-xs overflow-x-auto">
                    {`<iframe src="${window.location.origin}/experiences/embed/${experience.id}" width="100%" height="600" frameborder="0"></iframe>`}
                  </pre>
                </div>
                
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(`<iframe src="${window.location.origin}/experiences/embed/${experience.id}" width="100%" height="600" frameborder="0"></iframe>`)
                  toast({
                    title: 'Embed Code Copied',
                    description: 'The embed code has been copied to your clipboard',
                  })
                }}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Embed Code
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Performance Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-sm text-gray-500">Views</p>
              <p className="text-3xl font-semibold">{experience.view_count || 0}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-3xl font-semibold">{experience.booking_count || 0}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-3xl font-semibold">
                {formatCurrency((experience.booking_count || 0) * experience.price_per_person, experience.currency)}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Coming Soon</h3>
            <p className="text-gray-500">
              Detailed analytics with charts and reports will be available soon!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
