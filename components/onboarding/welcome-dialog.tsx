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
import { Gift } from "lucide-react"

interface WelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeDialog({
  open,
  onOpenChange
}: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Gift className="h-5 w-5 text-primary mr-2" />
            Welcome to HAYA!
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            We're excited to have you on board. Let's set up your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="text-sm space-y-3">
            <p className="font-medium">Let's complete your profile with just a few quick steps:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Confirm your organization details</li>
              <li>Tell us about the tours and services you offer</li>
              <li>Set up your AI preferences to enhance your operations</li>
            </ul>
            <p className="pt-2">
              This quick setup takes just 2-3 minutes and helps us customize your HAYA experience.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Complete Your Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
