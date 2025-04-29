'use client'

import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Copy, Share2, Globe } from 'lucide-react'

interface ShareableLinkManagerProps {
  experienceId: string;
  isShareable: boolean;
  shareableToken?: string;
  onToggleShareable: (isShareable: boolean) => Promise<void>;
  onRegenerate: () => Promise<{ token: string }>;
}

export default function ShareableLinkManager({
  experienceId,
  isShareable,
  shareableToken,
  onToggleShareable,
  onRegenerate
}: ShareableLinkManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [token, setToken] = useState(shareableToken || '')

  // Generate the full share URL
  const shareUrl = token 
    ? `${window.location.origin}/experiences/share-redirect/${experienceId}`
    : ''
  
  // Copy the URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: 'Link Copied',
      description: 'The shareable link has been copied to your clipboard',
    })
  }
  
  // Toggle the shareable status
  const handleToggleShareable = async () => {
    setIsToggling(true)
    try {
      await onToggleShareable(!isShareable)
      toast({
        title: isShareable ? 'Sharing Disabled' : 'Sharing Enabled',
        description: isShareable 
          ? 'This experience is no longer shareable'
          : 'This experience can now be shared with others',
      })
    } catch (error) {
      console.error('Failed to toggle shareable status:', error)
      toast({
        title: 'Action Failed',
        description: 'There was an error updating the shareable status',
        variant: 'destructive',
      })
    } finally {
      setIsToggling(false)
    }
  }
  
  // Regenerate the shareable token
  const handleRegenerate = async () => {
    if (!confirm('Are you sure you want to regenerate the link? The old link will no longer work.')) {
      return
    }
    
    setIsRegenerating(true)
    try {
      const result = await onRegenerate()
      setToken(result.token)
      toast({
        title: 'Link Regenerated',
        description: 'A new shareable link has been generated',
      })
    } catch (error) {
      console.error('Failed to regenerate token:', error)
      toast({
        title: 'Regeneration Failed',
        description: 'There was an error creating a new link',
        variant: 'destructive',
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Share2 className="w-4 h-4 mr-2" />
          Manage Shareable Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shareable Link</DialogTitle>
          <DialogDescription>
            Create a public link that allows anyone to view this experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isShareable} 
              onCheckedChange={handleToggleShareable}
              disabled={isToggling}
            />
            <Label>Enable public sharing</Label>
          </div>
          
          {isShareable && token && (
            <>
              <div className="flex flex-col space-y-2 mt-4">
                <Label htmlFor="share-link">Public link</Label>
                <div className="flex items-center">
                  <div className="bg-muted w-8 h-8 flex items-center justify-center rounded-l-md border border-r-0">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="share-link"
                    value={shareUrl}
                    className="rounded-l-none"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate Link'}
                </Button>
                <p className="text-xs mt-1 text-muted-foreground">
                  This will create a new shareable link and invalidate the current one.
                </p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
