'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { 
  Copy, 
  MoreVertical, 
  Power, 
  PowerOff, 
  Trash 
} from 'lucide-react'
import { 
  deleteExperience, 
  duplicateExperience, 
  toggleExperienceStatus 
} from '@/app/actions/experiences'

interface ExperienceActionsProps {
  id: string
  name: string
  isActive: boolean
}

export function ExperienceActionsMenu({ id, name, isActive }: ExperienceActionsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  
  // Handle duplicate
  const handleDuplicate = async () => {
    try {
      setIsLoading(true)
      const result = await duplicateExperience(id)
      
      if (result?.success) {
        toast({
          title: 'Experience duplicated',
          description: `"${name}" has been duplicated successfully.`,
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
      const result = await toggleExperienceStatus(id)
      
      if (result?.success) {
        toast({
          title: result.is_active ? 'Experience activated' : 'Experience deactivated',
          description: `"${name}" has been ${result.is_active ? 'activated' : 'deactivated'} successfully.`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isActive ? 'deactivate' : 'activate'} experience.`,
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
      const result = await deleteExperience(id)
      
      if (result?.success) {
        toast({
          title: 'Experience deleted',
          description: `"${name}" has been deleted successfully.`,
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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleStatus} disabled={isLoading}>
          {isActive ? (
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this experience?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the experience
                &quot;{name}&quot; and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
                disabled={isLoading}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
