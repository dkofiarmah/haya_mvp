'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  DollarSign, 
  Edit, 
  Globe, 
  Info, 
  MapPin, 
  SquareCheckBig, 
  SquareX, 
  Star, 
  Users,
  Copy, 
  MoreVertical, 
  Power, 
  PowerOff, 
  Trash,
  Archive,
  RotateCcw,
  Share2
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { deleteExperience, duplicateExperience, toggleExperienceStatus } from '@/app/actions/experiences'
import { archiveExperience, restoreExperience } from '@/app/actions/experience-enhancements'
import ShareExperienceDialog from '@/components/experiences/share-experience-dialog'
import ExperienceManagement from '@/components/experiences/experience-management'

export function ExperienceDetailClient({ experience }: { experience: any }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  
  // Handle duplicate
  const handleDuplicate = async () => {
    try {
      setIsLoading(true)
      const result = await duplicateExperience(experience.id)
      
      if (result?.success) {
        toast({
          title: 'Experience duplicated',
          description: `"${experience.name}" has been duplicated successfully.`,
        })
        // Navigate to the new experience if we have its ID
        if (result.newId) {
          router.push(`/experiences/${result.newId}`)
        } else {
          router.push('/experiences')
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate experience.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle toggle status
  const handleToggleStatus = async () => {
    try {
      setIsLoading(true)
      const result = await toggleExperienceStatus(experience.id)
      
      if (result?.success) {
        toast({
          title: result.is_active ? 'Experience activated' : 'Experience deactivated',
          description: `"${experience.name}" has been ${result.is_active ? 'activated' : 'deactivated'} successfully.`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${experience.is_active ? 'deactivate' : 'activate'} experience.`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle archive experience
  const handleArchive = async () => {
    try {
      setIsLoading(true)
      const result = await archiveExperience(experience.id)
      
      if (result?.success) {
        toast({
          title: 'Experience archived',
          description: `"${experience.name}" has been archived successfully.`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive experience.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle restore experience
  const handleRestore = async () => {
    try {
      setIsLoading(true)
      const result = await restoreExperience(experience.id)
      
      if (result?.success) {
        toast({
          title: 'Experience restored',
          description: `"${experience.name}" has been restored successfully.`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore experience.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle delete
  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const result = await deleteExperience(experience.id)
      
      if (result?.success) {
        toast({
          title: 'Experience deleted',
          description: `"${experience.name}" has been deleted successfully.`,
        })
        router.push('/experiences')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete experience.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format duration helper function
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`
    } else {
      return `${mins} minute${mins > 1 ? 's' : ''}`
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{experience.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={experience.is_active ? 'default' : 'secondary'}>
              {experience.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {experience.category}
            </Badge>
            {experience.is_archived && (
              <Badge variant="destructive">Archived</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ShareExperienceDialog 
            experienceId={experience.id}
            experienceName={experience.name}
            shareableToken={experience.shareable_token}
            isShareable={experience.is_shareable}
          />
          <Link href={`/experiences/${experience.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus} disabled={isLoading}>
                {experience.is_active ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {experience.is_archived ? (
                <DropdownMenuItem onClick={handleRestore} disabled={isLoading}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore from Archive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleArchive} disabled={isLoading}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the experience &quot;{experience.name}&quot;.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {experience.images && experience.images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experience.images.map((image: string, index: number) => (
            <img 
              key={index}
              src={image} 
              alt={`${experience.name} - Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted h-64 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      )}

      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="included">What's Included</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Experience Details</CardTitle>
              <CardDescription>Comprehensive details about this experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{experience.description}</p>
                </div>
                {experience.highlights && experience.highlights.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Highlights</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {experience.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="text-muted-foreground">{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="included">
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
              <CardDescription>Items and services included in this experience</CardDescription>
            </CardHeader>
            <CardContent>
              {experience.included && experience.included.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experience.included.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <SquareCheckBig className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No included items specified</p>
              )}
              
              {experience.not_included && experience.not_included.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Not Included</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {experience.not_included.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <SquareX className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Requirements and preparations for this experience</CardDescription>
            </CardHeader>
            <CardContent>
              {experience.requirements && experience.requirements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experience.requirements.map((req: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">{req}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No requirements specified</p>
              )}
              
              {experience.languages && experience.languages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.languages.map((lang: string, index: number) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {lang.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Policies</CardTitle>
              <CardDescription>Cancellation and booking policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-medium mb-2">Cancellation Policy</h4>
                <p className="text-muted-foreground">{experience.cancellation_policy || "No cancellation policy specified"}</p>
                
                <h4 className="font-medium mb-2 mt-4">Private Booking</h4>
                <p className="text-muted-foreground">
                  {experience.private_booking ? "Available for private booking" : "Not available for private booking"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="management">
          <ExperienceManagement experienceId={experience.id} />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Key Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-muted-foreground">${experience.price_per_person} per person</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">{formatDuration(experience.duration_minutes)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Group Size</p>
                  <p className="text-muted-foreground">
                    {experience.min_group_size || 1} - {experience.max_group_size} guests
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{experience.location || "Location not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-muted-foreground capitalize">{experience.category}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Views:</span>
                <span className="font-medium">{experience.view_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bookings:</span>
                <span className="font-medium">{experience.booking_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {experience.created_at ? new Date(experience.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {experience.updated_at ? new Date(experience.updated_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              {experience.is_archived && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Archived:</span>
                  <span className="font-medium">
                    {experience.archived_at ? new Date(experience.archived_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
