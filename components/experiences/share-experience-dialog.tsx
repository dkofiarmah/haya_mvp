'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check, Share2, Twitter, Facebook, Mail } from 'lucide-react'
import { getExperienceShareableLink } from '@/app/actions/experiences-api'
import { useToast } from '@/components/ui/use-toast'

interface ShareExperienceDialogProps {
  experienceId: string
  experienceName: string
  isOpen: boolean
  onClose: () => void
}

export function ShareExperienceDialog({
  experienceId,
  experienceName,
  isOpen,
  onClose
}: ShareExperienceDialogProps) {
  const { toast } = useToast()
  const [shareUrl, setShareUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    const getShareableLink = async () => {
      try {
        setLoading(true)
        const result = await getExperienceShareableLink(experienceId)
        
        if (result.success && result.token) {
          setShareUrl(`${baseUrl}/experiences/public/${result.token}`)
        }
      } catch (error) {
        console.error('Error getting shareable link:', error)
        toast({
          title: 'Error',
          description: 'Failed to generate shareable link',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      getShareableLink()
    }
  }, [experienceId, isOpen, baseUrl, toast])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    
    toast({
      title: 'Copied!',
      description: 'Shareable link copied to clipboard',
    })
    
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    const text = `Check out ${experienceName} on Haya!`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank')
  }

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank')
  }

  const shareByEmail = () => {
    const subject = `Check out ${experienceName} on Haya!`
    const body = `I thought you might be interested in this experience:\n\n${experienceName}\n\n${shareUrl}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Experience</DialogTitle>
          <DialogDescription>
            Share this experience with your customers or on social media.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              value={shareUrl}
              readOnly
              placeholder="Loading shareable link..."
              disabled={loading}
            />
          </div>
          <Button 
            type="button" 
            size="icon" 
            onClick={handleCopyLink} 
            disabled={loading || !shareUrl}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={shareOnTwitter}
            disabled={loading || !shareUrl}
            title="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={shareOnFacebook}
            disabled={loading || !shareUrl}
            title="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={shareByEmail}
            disabled={loading || !shareUrl}
            title="Share via Email"
          >
            <Mail className="h-4 w-4" />
            <span className="sr-only">Share via Email</span>
          </Button>
        </div>
        
        <DialogFooter className="flex items-center mt-4 sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Anyone with this link can view this experience
          </p>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShareExperienceDialog
