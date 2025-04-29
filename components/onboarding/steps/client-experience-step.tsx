"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ClientExperience } from "../types"
import { Icons } from "../icons"
import { cn } from "@/lib/utils"

interface ClientExperienceStepProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ClientExperience
  onUpdateAction: (data: ClientExperience) => void
  onNextAction: () => void
  onBackAction: () => void
}

const BOOKING_CHANNELS = [
  "Direct Website",
  "Email Inquiries",
  "Phone Calls",
  "Travel Agencies",
  "Social Media",
  "Referrals",
  "Online Travel Platforms"
] as const

const COMMUNICATION_PREFERENCES = [
  "Email",
  "WhatsApp",
  "Phone",
  "SMS",
  "Video Calls",
  "In-Person Meetings",
  "Mobile App"
] as const

const PAYMENT_METHODS = [
  "Credit Card",
  "Bank Transfer",
  "Wire Transfer",
  "PayPal",
  "Cryptocurrency",
  "Escrow Services"
] as const

const SUPPORT_CHANNELS = [
  "24/7 Concierge",
  "Email Support",
  "Phone Support",
  "WhatsApp",
  "Live Chat",
  "Emergency Hotline"
] as const

export const ClientExperienceStep = React.forwardRef<HTMLDivElement, ClientExperienceStepProps>(
  ({ data, onUpdateAction, onNextAction, onBackAction, className, ...props }, ref) => {
    const toggleBookingChannel = (channel: string) => {
      const newChannels = data.bookingChannels.includes(channel)
        ? data.bookingChannels.filter(c => c !== channel)
        : [...data.bookingChannels, channel]
      onUpdateAction({ ...data, bookingChannels: newChannels })
    }

    const toggleCommunicationPreference = (pref: string) => {
      const newPrefs = data.communicationPreferences.includes(pref)
        ? data.communicationPreferences.filter(p => p !== pref)
        : [...data.communicationPreferences, pref]
      onUpdateAction({ ...data, communicationPreferences: newPrefs })
    }

    const togglePaymentMethod = (method: string) => {
      const newMethods = data.paymentMethods.includes(method)
        ? data.paymentMethods.filter(m => m !== method)
        : [...data.paymentMethods, method]
      onUpdateAction({ ...data, paymentMethods: newMethods })
    }

    const toggleSupportChannel = (channel: string) => {
      const newChannels = data.customerSupport.channels.includes(channel)
        ? data.customerSupport.channels.filter(c => c !== channel)
        : [...data.customerSupport.channels, channel]
      onUpdateAction({
        ...data,
        customerSupport: { ...data.customerSupport, channels: newChannels }
      })
    }

    const isValid = 
      data.bookingChannels.length > 0 &&
      data.communicationPreferences.length > 0 &&
      data.paymentMethods.length > 0 &&
      data.customerSupport.channels.length > 0

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <Label>Booking Channels</Label>
              <div className="flex flex-wrap gap-2">
                {BOOKING_CHANNELS.map((channel) => (
                  <Badge
                    key={channel}
                    variant={data.bookingChannels.includes(channel) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleBookingChannel(channel)}
                  >
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Communication Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {COMMUNICATION_PREFERENCES.map((pref) => (
                  <Badge
                    key={pref}
                    variant={data.communicationPreferences.includes(pref) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCommunicationPreference(pref)}
                  >
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Payment Methods</Label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <Badge
                    key={method}
                    variant={data.paymentMethods.includes(method) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePaymentMethod(method)}
                  >
                    {method}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Customer Support</Label>
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  {SUPPORT_CHANNELS.map((channel) => (
                    <Badge
                      key={channel}
                      variant={data.customerSupport.channels.includes(channel) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSupportChannel(channel)}
                    >
                      {channel}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label>Support Availability</Label>
                  <Select
                    value={data.customerSupport.availability}
                    onValueChange={(value: '24/7' | 'business-hours' | 'custom') =>
                      onUpdateAction({
                        ...data,
                        customerSupport: { ...data.customerSupport, availability: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24/7">24/7 Support</SelectItem>
                      <SelectItem value="business-hours">Business Hours</SelectItem>
                      <SelectItem value="custom">Custom Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Cancellation Policy</Label>
              <Textarea
                placeholder="Describe your cancellation and refund policy..."
                value={data.cancellationPolicy}
                onChange={(e) => onUpdateAction({ ...data, cancellationPolicy: e.target.value })}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBackAction}>
                <Icons.arrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={onNextAction} disabled={!isValid}>
                Next <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

ClientExperienceStep.displayName = "ClientExperienceStep"
