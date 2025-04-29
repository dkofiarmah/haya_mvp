"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ServiceOfferings } from "../types"
import { Icons } from "../icons"
import { cn } from "@/lib/utils"

interface ServiceOfferingsStepProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ServiceOfferings
  onUpdateAction: (data: ServiceOfferings) => void
  onNextAction: () => void
  onBackAction: () => void
}

const TOUR_TYPES = [
  "Luxury Retreats",
  "Cultural Experiences",
  "Adventure Tours",
  "Wellness Journeys",
  "Food & Wine Tours",
  "Private Yacht Charters",
  "Safari Expeditions",
  "Custom Experiences"
] as const

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Mandarin",
  "Japanese",
  "Arabic"
] as const

const SPECIAL_SERVICES = [
  "Private Jets",
  "Luxury Transportation",
  "Personal Concierge",
  "Private Security",
  "Personal Chef",
  "Photography Services",
  "Translation Services",
  "VIP Access"
] as const

export const ServiceOfferingsStep = React.forwardRef<HTMLDivElement, ServiceOfferingsStepProps>(
  ({ data, onUpdateAction, onNextAction, onBackAction, className, ...props }, ref) => {
    const toggleTourType = (type: string) => {
      const newTypes = data.tourTypes.includes(type)
        ? data.tourTypes.filter(t => t !== type)
        : [...data.tourTypes, type]
      onUpdateAction({ ...data, tourTypes: newTypes })
    }

    const toggleLanguage = (lang: string) => {
      const newLangs = data.languages.includes(lang)
        ? data.languages.filter(l => l !== lang)
        : [...data.languages, lang]
      onUpdateAction({ ...data, languages: newLangs })
    }

    const toggleService = (service: string) => {
      const newServices = data.specialServices.includes(service)
        ? data.specialServices.filter(s => s !== service)
        : [...data.specialServices, service]
      onUpdateAction({ ...data, specialServices: newServices })
    }

    const isValid = data.tourTypes.length > 0 && data.languages.length > 0

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <Label>Tour Types</Label>
              <div className="flex flex-wrap gap-2">
                {TOUR_TYPES.map((type) => (
                  <Badge
                    key={type}
                    variant={data.tourTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTourType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Custom Packages</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer tailored experiences
                  </p>
                </div>
                <Switch
                  checked={data.customPackages}
                  onCheckedChange={(checked) => onUpdateAction({ ...data, customPackages: checked })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Group Size Limits</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSize">Minimum</Label>
                  <Input
                    id="minSize"
                    type="number"
                    min="1"
                    max={data.groupSize.max}
                    value={data.groupSize.min}
                    onChange={(e) => onUpdateAction({
                      ...data,
                      groupSize: { ...data.groupSize, min: parseInt(e.target.value) || 1 }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSize">Maximum</Label>
                  <Input
                    id="maxSize"
                    type="number"
                    min={data.groupSize.min}
                    value={data.groupSize.max}
                    onChange={(e) => onUpdateAction({
                      ...data,
                      groupSize: { ...data.groupSize, max: parseInt(e.target.value) || data.groupSize.min }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Languages Supported</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <Badge
                    key={lang}
                    variant={data.languages.includes(lang) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleLanguage(lang)}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Special Services</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIAL_SERVICES.map((service) => (
                  <Badge
                    key={service}
                    variant={data.specialServices.includes(service) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleService(service)}
                  >
                    {service}
                  </Badge>
                ))}
              </div>
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

ServiceOfferingsStep.displayName = "ServiceOfferingsStep"
