"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface SkipOnboardingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isSkipping: boolean
}

export function SkipOnboardingDialog({
  open,
  onOpenChange,
  onConfirm,
  isSkipping
}: SkipOnboardingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Skip Setup?
          </DialogTitle>
          <DialogDescription className="pt-2">
            You can complete the setup later, but you'll have limited functionality until then. We recommend taking a few minutes to complete it now.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <p className="text-sm">If you skip now, you can access setup anytime from your dashboard.</p>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSkipping}
          >
            Continue Setup
          </Button>
          <Button 
            variant="default"
            onClick={onConfirm}
            disabled={isSkipping}
          >
            {isSkipping ? "Saving..." : "Skip for Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
