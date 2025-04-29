"use client"

import * as React from "react"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OnboardingFormData } from "../types"
import { Icons } from "../icons"
import { cn } from "@/lib/utils"

interface ReviewStepProps extends React.HTMLAttributes<HTMLDivElement> {
  data: OnboardingFormData
  isLoading: boolean
  onSubmitAction: () => void
  onBackAction: () => void
}

export const ReviewStep = React.forwardRef<HTMLDivElement, ReviewStepProps>(
  ({ data, isLoading, onSubmitAction, onBackAction, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Company Details</h3>
              <div className="grid gap-2 text-sm">
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="font-medium">Company Name</div>
                  <div className="col-span-2">{data.companyDetails.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="font-medium">Website</div>
                  <div className="col-span-2">{data.companyDetails.website || "Not provided"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="font-medium">Business Type</div>
                  <div className="col-span-2 capitalize">{data.companyDetails.businessModel.type}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="font-medium">Location</div>
                  <div className="col-span-2">{data.companyDetails.locations.headquarters}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Services</h3>
              <div className="space-y-2">
                <CardDescription>Tour Types</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {data.serviceOfferings.tourTypes.map((type) => (
                    <Badge key={type} variant="secondary">{type}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <CardDescription>Languages</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {data.serviceOfferings.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">{lang}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                <div className="font-medium">Group Size</div>
                <div className="col-span-2">
                  {data.serviceOfferings.groupSize.min} - {data.serviceOfferings.groupSize.max} travelers
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Client Experience</h3>
              <div className="space-y-2">
                <CardDescription>Booking Channels</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {data.clientExperience.bookingChannels.map((channel) => (
                    <Badge key={channel} variant="secondary">{channel}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <CardDescription>Payment Methods</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {data.clientExperience.paymentMethods.map((method) => (
                    <Badge key={method} variant="secondary">{method}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                <div className="font-medium">Support Availability</div>
                <div className="col-span-2 capitalize">
                  {data.clientExperience.customerSupport.availability}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">AI Configuration</h3>
              <div className="grid gap-2 text-sm">
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="font-medium">Communication Style</div>
                  <div className="col-span-2 capitalize">{data.aiPreferences.communicationStyle}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="font-medium">Response Length</div>
                  <div className="col-span-2 capitalize">{data.aiPreferences.responseLength}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="font-medium">Automation Level</div>
                  <div className="col-span-2 capitalize">{data.aiPreferences.automationLevel}</div>
                </div>
              </div>
              <div className="space-y-2">
                <CardDescription>Enabled Assistants</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.assistantPreferences)
                    .filter(([_, enabled]) => enabled)
                    .map(([key]) => (
                      <Badge key={key} variant="secondary" className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBackAction}>
                <Icons.arrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={onSubmitAction} disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

ReviewStep.displayName = "ReviewStep"
