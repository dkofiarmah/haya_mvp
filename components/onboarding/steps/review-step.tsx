"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface OnboardingFormData {
  companyDetails: {
    name: string;
    description: string;
    website: string;
    yearEstablished: string;
    employeeCount: string;
    specialties: string;
    targetMarket: string;
    locations: {
      headquarters: string;
      operatingRegions: string[];
    };
    businessModel: {
      type: "b2c" | "b2b" | "both";
      averageBookingValue: string;
      annualBookings: string;
    };
  };
  serviceOfferings: {
    tourTypes: string[];
    customPackages: boolean;
    groupSize: {
      min: number;
      max: number;
    };
    destinationsServed: string[];
    languages: string[];
    specialServices: string[];
  };
  clientExperience: {
    bookingChannels: string[];
    communicationPreferences: string[];
    paymentMethods: string[];
    cancellationPolicy: string;
    customerSupport: {
      channels: string[];
      availability: string;
    };
  };
  aiPreferences: {
    communicationStyle: "casual" | "professional" | "friendly";
    responseLength: "concise" | "balanced" | "detailed";
    languagePreference: string;
    automationLevel: "minimal" | "balanced" | "extensive";
    customizationLevel: "low" | "moderate" | "high";
    proactiveEngagement: boolean;
  };
  assistantPreferences: {
    discovery: boolean;
    itinerary: boolean;
    concierge: boolean;
    notifications: boolean;
    bookingAssistant: boolean;
    customerSupport: boolean;
    marketingAssistant: boolean;
  };
}

interface ReviewStepProps {
  data: OnboardingFormData;
  onBackAction: () => void;
  onSubmitAction: () => void;
  isLoading: boolean;
}

export function ReviewStep({
  data,
  onBackAction,
  onSubmitAction,
  isLoading
}: ReviewStepProps) {
  // Helper function to get readable business model
  const getBusinessModelLabel = (type: "b2c" | "b2b" | "both") => {
    switch (type) {
      case "b2c": return "B2C (Direct to Consumer)";
      case "b2b": return "B2B (Business to Business)";
      case "both": return "Both B2C and B2B";
      default: return "Not specified";
    }
  }
  
  // Helper function to get readable AI communication style
  const getCommunicationStyleLabel = (style: "casual" | "professional" | "friendly") => {
    switch (style) {
      case "casual": return "Casual";
      case "professional": return "Professional";
      case "friendly": return "Friendly";
      default: return "Not specified";
    }
  }
  
  // Helper function to get readable response length
  const getResponseLengthLabel = (length: "concise" | "balanced" | "detailed") => {
    switch (length) {
      case "concise": return "Concise";
      case "balanced": return "Balanced";
      case "detailed": return "Detailed";
      default: return "Not specified";
    }
  }
  
  // Helper function to get readable automation level
  const getAutomationLevelLabel = (level: "minimal" | "balanced" | "extensive") => {
    switch (level) {
      case "minimal": return "Minimal";
      case "balanced": return "Balanced";
      case "extensive": return "Extensive";
      default: return "Not specified";
    }
  }

  // Helper function to get language label from code
  const getLanguageLabel = (code: string) => {
    const languages: Record<string, string> = {
      "en": "English",
      "es": "Spanish",
      "fr": "French",
      "de": "German",
      "it": "Italian",
      "jp": "Japanese",
      "zh": "Chinese (Simplified)",
      "pt": "Portuguese",
      "ar": "Arabic",
      "ru": "Russian"
    };
    
    return languages[code] || code;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review & Complete Setup</h2>
        <p className="text-muted-foreground mt-2">
          Review your tour business setup and make any changes before completing
        </p>
      </div>

      <Accordion type="multiple" defaultValue={["company", "services"]} className="w-full space-y-4">
        <AccordionItem value="company" className="border rounded-lg shadow-sm">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
            <div className="flex flex-col items-start">
              <span className="font-semibold">Company Profile</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="col-span-1 md:col-span-2">
                <dt className="font-medium text-muted-foreground">Company Name</dt>
                <dd className="mt-1">{data.companyDetails.name || "Not provided"}</dd>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <dt className="font-medium text-muted-foreground">Description</dt>
                <dd className="mt-1">{data.companyDetails.description || "Not provided"}</dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Website</dt>
                <dd className="mt-1">{data.companyDetails.website || "Not provided"}</dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Year Established</dt>
                <dd className="mt-1">{data.companyDetails.yearEstablished || "Not provided"}</dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Company Size</dt>
                <dd className="mt-1">{data.companyDetails.employeeCount || "Not provided"}</dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Business Model</dt>
                <dd className="mt-1">{getBusinessModelLabel(data.companyDetails.businessModel.type)}</dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Main Location</dt>
                <dd className="mt-1">{data.companyDetails.locations.headquarters || "Not provided"}</dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Operating Regions</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.companyDetails.locations.operatingRegions?.length > 0 
                    ? data.companyDetails.locations.operatingRegions.map(region => (
                        <Badge key={region} variant="outline" className="font-normal">
                          {region}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
            </dl>
            
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={onBackAction}>
                Edit
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="services" className="border rounded-lg shadow-sm">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
            <div className="flex flex-col items-start">
              <span className="font-semibold">Service Offerings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <dl className="grid grid-cols-1 gap-y-4 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">Tour Types</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.serviceOfferings.tourTypes?.length > 0 
                    ? data.serviceOfferings.tourTypes.map(type => (
                        <Badge key={type} variant="outline" className="font-normal">
                          {type}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Custom Packages</dt>
                <dd className="mt-1">
                  {data.serviceOfferings.customPackages ? "Yes, offered" : "No, only fixed packages"}
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Group Size Range</dt>
                <dd className="mt-1">
                  {data.serviceOfferings.groupSize.min} to {data.serviceOfferings.groupSize.max} people
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Destinations Served</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.serviceOfferings.destinationsServed?.length > 0 
                    ? data.serviceOfferings.destinationsServed.map(destination => (
                        <Badge key={destination} variant="outline" className="font-normal">
                          {destination}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Languages</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.serviceOfferings.languages?.length > 0 
                    ? data.serviceOfferings.languages.map(language => (
                        <Badge key={language} variant="outline" className="font-normal">
                          {language}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Special Services</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.serviceOfferings.specialServices?.length > 0 
                    ? data.serviceOfferings.specialServices.map(service => (
                        <Badge key={service} variant="outline" className="font-normal">
                          {service}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
            </dl>
            
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onBackAction()}>
                Edit
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="client" className="border rounded-lg shadow-sm">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
            <div className="flex flex-col items-start">
              <span className="font-semibold">Client Experience</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <dl className="grid grid-cols-1 gap-y-4 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">Booking Channels</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.clientExperience.bookingChannels?.length > 0 
                    ? data.clientExperience.bookingChannels.map(channel => (
                        <Badge key={channel} variant="outline" className="font-normal">
                          {channel}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Communication Preferences</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.clientExperience.communicationPreferences?.length > 0 
                    ? data.clientExperience.communicationPreferences.map(pref => (
                        <Badge key={pref} variant="outline" className="font-normal">
                          {pref}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Payment Methods</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.clientExperience.paymentMethods?.length > 0 
                    ? data.clientExperience.paymentMethods.map(method => (
                        <Badge key={method} variant="outline" className="font-normal">
                          {method}
                        </Badge>
                      ))
                    : "Not provided"}
                </dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Cancellation Policy</dt>
                <dd className="mt-1">{data.clientExperience.cancellationPolicy || "Not provided"}</dd>
              </div>
              
              <div>
                <dt className="font-medium text-muted-foreground">Customer Support</dt>
                <dd className="mt-1">
                  <div><span className="text-muted-foreground">Channels:</span> {data.clientExperience.customerSupport.channels?.join(", ") || "Not provided"}</div>
                  <div><span className="text-muted-foreground">Availability:</span> {data.clientExperience.customerSupport.availability || "Not provided"}</div>
                </dd>
              </div>
            </dl>
            
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onBackAction()}>
                Edit
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai" className="border rounded-lg shadow-sm">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
            <div className="flex flex-col items-start">
              <span className="font-semibold">AI Configuration</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h4 className="font-medium">AI Preferences</h4>
                <dl className="mt-2 space-y-2 text-sm">
                  <div>
                    <dt className="inline font-medium text-muted-foreground">Communication Style:</dt>
                    <dd className="inline ml-1">{getCommunicationStyleLabel(data.aiPreferences.communicationStyle)}</dd>
                  </div>
                  
                  <div>
                    <dt className="inline font-medium text-muted-foreground">Response Length:</dt>
                    <dd className="inline ml-1">{getResponseLengthLabel(data.aiPreferences.responseLength)}</dd>
                  </div>
                  
                  <div>
                    <dt className="inline font-medium text-muted-foreground">Primary Language:</dt>
                    <dd className="inline ml-1">{getLanguageLabel(data.aiPreferences.languagePreference)}</dd>
                  </div>
                  
                  <div>
                    <dt className="inline font-medium text-muted-foreground">Automation Level:</dt>
                    <dd className="inline ml-1">{getAutomationLevelLabel(data.aiPreferences.automationLevel)}</dd>
                  </div>
                  
                  <div>
                    <dt className="inline font-medium text-muted-foreground">Proactive Engagement:</dt>
                    <dd className="inline ml-1">{data.aiPreferences.proactiveEngagement ? "Enabled" : "Disabled"}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="font-medium">Enabled Assistants</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className={data.assistantPreferences.discovery ? "" : "text-muted-foreground line-through"}>
                    Discovery Assistant
                  </li>
                  <li className={data.assistantPreferences.itinerary ? "" : "text-muted-foreground line-through"}>
                    Itinerary Planner
                  </li>
                  <li className={data.assistantPreferences.concierge ? "" : "text-muted-foreground line-through"}>
                    Concierge Assistant
                  </li>
                  <li className={data.assistantPreferences.bookingAssistant ? "" : "text-muted-foreground line-through"}>
                    Booking Assistant
                  </li>
                  <li className={data.assistantPreferences.customerSupport ? "" : "text-muted-foreground line-through"}>
                    Customer Support
                  </li>
                  <li className={data.assistantPreferences.notifications ? "" : "text-muted-foreground line-through"}>
                    Notifications Assistant
                  </li>
                  <li className={data.assistantPreferences.marketingAssistant ? "" : "text-muted-foreground line-through"}>
                    Marketing Assistant
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onBackAction()}>
                Edit
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Complete Setup</CardTitle>
          <CardDescription>
            Your workspace is almost ready! Review your information above and complete your setup.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col sm:flex-row gap-3 items-center">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBackAction}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Button 
            type="button" 
            onClick={onSubmitAction}
            className="w-full sm:w-auto order-1 sm:order-2"
            disabled={isLoading}
          >
            {isLoading ? "Setting up your workspace..." : "Complete Setup"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
