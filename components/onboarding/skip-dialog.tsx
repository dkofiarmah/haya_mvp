"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface SkipOnboardingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading: boolean
}

export function SkipOnboardingDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading
}: SkipOnboardingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Skip onboarding setup?
          </DialogTitle>
          <DialogDescription>
            You can always complete your setup later from your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm space-y-2">
            <p>
              Your progress will be saved, but skipping setup means:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Some features may be limited until you complete the setup</li>
              <li>AI assistants will use default settings instead of customized ones</li>
              <li>You'll miss out on personalized recommendations</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Continue Setup
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm}
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? "Processing..." : "Skip for Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
