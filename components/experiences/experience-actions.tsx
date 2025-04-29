'use client'

import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Copy, 
  Archive, 
  ExternalLink, 
  RefreshCw,
  Power,
  PowerOff,
  Share2,
  Eye
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Experience } from '@/app/actions/experiences-api'
import { 
  archiveExperience, 
  restoreExperience, 
  deleteExperience, 
  duplicateExperience,
  toggleExperienceStatus
} from '@/app/actions/experiences-api'
import ShareExperienceDialog from './share-experience-dialog'

interface ExperienceActionsProps {
  experience: Experience
}

export function ExperienceActions({ experience }: ExperienceActionsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  // Handler for duplication
  const handleDuplicate = async () => {
    try {
      setIsLoading(true)
      const result = await duplicateExperience(experience.id)
      
      toast({
        title: 'Experience duplicated',
        description: 'The experience has been duplicated successfully.',
      })
      
      // Navigate to the duplicated experience
      if (result?.newId) {
        router.push(`/experiences/${result.newId}/edit`)
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Error duplicating experience:', error)
      toast({
        title: 'Duplication failed',
        description: 'There was an error duplicating the experience.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handler for toggling active status
  const handleToggleStatus = async () => {
    try {
      setIsLoading(true)
      await toggleExperienceStatus(experience.id)
      
      toast({
        title: experience.is_active ? 'Experience deactivated' : 'Experience activated',
        description: `The experience is now ${experience.is_active ? 'inactive' : 'active'}.`,
      })
      
      router.refresh()
    } catch (error) {
      console.error('Error toggling experience status:', error)
      toast({
        title: 'Status update failed',
        description: 'There was an error updating the experience status.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handler for archiving
  const handleArchive = async () => {
    try {
      setIsLoading(true)
      await archiveExperience(experience.id)
      
      toast({
        title: 'Experience archived',
        description: 'The experience has been archived successfully.',
      })
      
      router.refresh()
    } catch (error) {
      console.error('Error archiving experience:', error)
      toast({
        title: 'Archive failed',
        description: 'There was an error archiving the experience.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setShowArchiveDialog(false)
    }
  }

  // Handler for restoring from archive
  const handleRestore = async () => {
    try {
      setIsLoading(true)
      await restoreExperience(experience.id)
      
      toast({
        title: 'Experience restored',
        description: 'The experience has been restored from the archive.',
      })
      
      router.refresh()
    } catch (error) {
      console.error('Error restoring experience:', error)
      toast({
        title: 'Restore failed',
        description: 'There was an error restoring the experience.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setShowRestoreDialog(false)
    }
  }

  // Handler for permanent deletion
  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteExperience(experience.id)
      
      toast({
        title: 'Experience deleted',
        description: 'The experience has been permanently deleted.',
      })
      
      router.push('/experiences')
    } catch (error) {
      console.error('Error deleting experience:', error)
      toast({
        title: 'Deletion failed',
        description: 'There was an error deleting the experience.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  // Get view URL for public experience
  const getPublicViewUrl = () => {
    if (experience.shareable_token) {
      return `/experiences/public/${experience.shareable_token}`
    }
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isLoading}>
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Experience Actions</DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href={`/experiences/${experience.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href={`/experiences/${experience.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Experience
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {experience.is_shareable && (
            <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Experience
            </DropdownMenuItem>
          )}
          
          {experience.is_shareable && experience.shareable_token && (
            <DropdownMenuItem asChild>
              <Link href={getPublicViewUrl() || '#'} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Page
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleToggleStatus} disabled={isLoading || experience.is_archived}>
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
          
          {experience.is_archived ? (
            <DropdownMenuItem onClick={() => setShowRestoreDialog(true)} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restore from Archive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setShowArchiveDialog(true)} disabled={isLoading}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)} 
            className="text-destructive focus:text-destructive" 
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Permanently
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the experience
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this experience?</AlertDialogTitle>
            <AlertDialogDescription>
              Archiving will hide this experience from public listings and disable booking.
              You can restore it from the archive later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} disabled={isLoading}>
              {isLoading ? 'Archiving...' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this experience?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the experience from the archive. It will remain inactive
              until you manually activate it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore} disabled={isLoading}>
              {isLoading ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Share Dialog */}
      {showShareDialog && (
        <ShareExperienceDialog 
          experienceId={experience.id} 
          experienceName={experience.name}
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </>
  )
}

export default ExperienceActions
