"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ClientExperience {
  bookingChannels: string[];
  communicationPreferences: string[];
  paymentMethods: string[];
  cancellationPolicy: string;
  customerSupport: {
    channels: string[];
    availability: string;
  };
}

interface ClientExperienceStepProps {
  data: ClientExperience;
  onUpdateAction: (data: ClientExperience) => void;
  onNextAction: () => void;
  onBackAction: () => void;
}

const BOOKING_CHANNELS = [
  { label: "Website", value: "Website" },
  { label: "Mobile App", value: "Mobile App" },
  { label: "Phone", value: "Phone" },
  { label: "Email", value: "Email" },
  { label: "In-person", value: "In-person" },
  { label: "Booking.com", value: "Booking.com" },
  { label: "Expedia", value: "Expedia" },
  { label: "Airbnb Experiences", value: "Airbnb Experiences" },
  { label: "TripAdvisor", value: "TripAdvisor" },
  { label: "GetYourGuide", value: "GetYourGuide" },
  { label: "Viator", value: "Viator" },
  { label: "Travel Agents", value: "Travel Agents" }
]

const COMMUNICATION_PREFERENCES = [
  { label: "Email", value: "Email" },
  { label: "SMS", value: "SMS" },
  { label: "Phone", value: "Phone" },
  { label: "WhatsApp", value: "WhatsApp" },
  { label: "Mobile App Notifications", value: "Mobile App Notifications" },
  { label: "Web Chat", value: "Web Chat" },
  { label: "In-Person", value: "In-Person" }
]

const PAYMENT_METHODS = [
  { label: "Credit Card", value: "Credit Card" },
  { label: "Debit Card", value: "Debit Card" },
  { label: "PayPal", value: "PayPal" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Cash", value: "Cash" },
  { label: "Mobile Payment (Apple Pay, Google Pay)", value: "Mobile Payment" },
  { label: "Cryptocurrency", value: "Cryptocurrency" },
  { label: "Invoice/Purchase Order", value: "Invoice/Purchase Order" }
]

const SUPPORT_CHANNELS = [
  { label: "Email", value: "Email" },
  { label: "Phone", value: "Phone" },
  { label: "Live Chat", value: "Live Chat" },
  { label: "WhatsApp", value: "WhatsApp" },
  { label: "Social Media", value: "Social Media" },
  { label: "In-Person Support", value: "In-Person Support" },
  { label: "Mobile App Support", value: "Mobile App Support" }
]

const SUPPORT_AVAILABILITY_OPTIONS = [
  { label: "24/7", value: "24/7" },
  { label: "Business Hours (9AM-5PM)", value: "Business Hours (9AM-5PM)" },
  { label: "Extended Hours (8AM-8PM)", value: "Extended Hours (8AM-8PM)" },
  { label: "Weekdays Only", value: "Weekdays Only" },
  { label: "During Tours Only", value: "During Tours Only" },
  { label: "Custom Hours", value: "Custom Hours" }
]

export function ClientExperienceStep({
  data,
  onUpdateAction,
  onNextAction,
  onBackAction
}: ClientExperienceStepProps) {
  const [formState, setFormState] = useState<ClientExperience>(data)
  
  const handleSubmit = () => {
    onUpdateAction(formState)
    onNextAction()
  }

  const handleMultiSelect = (field: keyof ClientExperience, values: string[]) => {
    if (field === "bookingChannels" || field === "communicationPreferences" || field === "paymentMethods") {
      setFormState(prev => ({
        ...prev,
        [field]: values
      }))
    }
  }

  const handleSupportChannels = (values: string[]) => {
    setFormState(prev => ({
      ...prev,
      customerSupport: {
        ...prev.customerSupport,
        channels: values
      }
    }))
  }

  const handleSupportAvailability = (value: string) => {
    setFormState(prev => ({
      ...prev,
      customerSupport: {
        ...prev.customerSupport,
        availability: value
      }
    }))
  }

  const handleCancellationPolicy = (value: string) => {
    setFormState(prev => ({
      ...prev,
      cancellationPolicy: value
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Client Experience</h2>
        <p className="text-muted-foreground mt-2">
          Define how customers interact with your tour business
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="booking">
          <AccordionTrigger className="font-medium text-lg">Booking Process</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Booking Channels</CardTitle>
                  <CardDescription>
                    How do customers book tours with your business?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Combobox
                    options={BOOKING_CHANNELS}
                    selected={formState.bookingChannels}
                    onChange={(values) => handleMultiSelect("bookingChannels", values)}
                    placeholder="Select booking channels"
                    multiple={true}
                    searchable={true}
                    creatable={true}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formState.bookingChannels.map((channel) => (
                      <Badge key={channel} variant="outline">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Which payment methods do you accept?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Combobox
                    options={PAYMENT_METHODS}
                    selected={formState.paymentMethods}
                    onChange={(values) => handleMultiSelect("paymentMethods", values)}
                    placeholder="Select payment methods"
                    multiple={true}
                    searchable={true}
                    creatable={true}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formState.paymentMethods.map((method) => (
                      <Badge key={method} variant="outline">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="communication">
          <AccordionTrigger className="font-medium text-lg">Communication</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Communication Preferences</CardTitle>
                  <CardDescription>
                    How do you typically communicate with your customers?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Combobox
                    options={COMMUNICATION_PREFERENCES}
                    selected={formState.communicationPreferences}
                    onChange={(values) => handleMultiSelect("communicationPreferences", values)}
                    placeholder="Select communication methods"
                    multiple={true}
                    searchable={true}
                    creatable={true}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formState.communicationPreferences.map((pref) => (
                      <Badge key={pref} variant="outline">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionTrigger className="font-medium text-lg">Customer Support</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Support Channels</CardTitle>
                    <CardDescription>
                      How can customers reach your support team?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Combobox
                      options={SUPPORT_CHANNELS}
                      selected={formState.customerSupport.channels}
                      onChange={handleSupportChannels}
                      placeholder="Select support channels"
                      multiple={true}
                      searchable={true}
                      creatable={true}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formState.customerSupport.channels.map((channel) => (
                        <Badge key={channel} variant="outline">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Support Availability</CardTitle>
                    <CardDescription>
                      When is your customer support available?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={formState.customerSupport.availability}
                      onValueChange={handleSupportAvailability}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORT_AVAILABILITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="policies">
          <AccordionTrigger className="font-medium text-lg">Policies & Guidelines</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Cancellation Policy</CardTitle>
                  <CardDescription>
                    Describe your cancellation policy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., Full refund if cancelled 48 hours before the tour. 50% refund if cancelled 24 hours before the tour. No refund for cancellations less than 24 hours before the tour."
                    value={formState.cancellationPolicy}
                    onChange={(e) => handleCancellationPolicy(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4 flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBackAction}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button 
          type="button" 
          onClick={handleSubmit}
          className="flex items-center"
        >
          Next Step <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
