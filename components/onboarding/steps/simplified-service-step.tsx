"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Globe2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Combobox } from "@/components/ui/combobox"

// Define service offerings interface - must match the main form data structure
interface ServiceOfferings {
  tourTypes: string[];
  customPackages: boolean;
  groupSize: {
    min: number;
    max: number;
  };
  destinationsServed: string[];
  languages: string[];
  specialServices: string[];
}

interface SimplifiedServiceOfferingsStepProps {
  data: ServiceOfferings;
  onUpdateAction: (data: ServiceOfferings) => void;
  onNextAction: () => void;
  onBackAction: () => void;
}

// Tour type options
const TOUR_TYPES = [
  { label: "Cultural Tours", value: "cultural" },
  { label: "Adventure Tours", value: "adventure" },
  { label: "Food & Wine Tours", value: "food-wine" },
  { label: "Eco Tourism", value: "eco" },
  { label: "Wildlife Safari", value: "wildlife" },
  { label: "Beach Holidays", value: "beach" },
  { label: "City Breaks", value: "city" },
  { label: "Luxury Tours", value: "luxury" },
  { label: "Historical Tours", value: "historical" },
  { label: "Wellness Retreats", value: "wellness" }
]

// Major regions
const DESTINATIONS = [
  { label: "Europe", value: "europe" },
  { label: "North America", value: "north-america" },
  { label: "South America", value: "south-america" },
  { label: "Asia", value: "asia" },
  { label: "Africa", value: "africa" },
  { label: "Middle East", value: "middle-east" },
  { label: "Oceania", value: "oceania" },
  { label: "Caribbean", value: "caribbean" },
  { label: "Mediterranean", value: "mediterranean" },
  { label: "Scandinavian", value: "scandinavian" }
]

// Languages
const LANGUAGES = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Italian", value: "italian" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Mandarin", value: "mandarin" },
  { label: "Japanese", value: "japanese" },
  { label: "Arabic", value: "arabic" },
  { label: "Russian", value: "russian" }
]

export function SimplifiedServiceOfferingsStep({
  data,
  onUpdateAction,
  onNextAction,
  onBackAction
}: SimplifiedServiceOfferingsStepProps) {
  const [formState, setFormState] = useState<ServiceOfferings>(data)

  const handleTourTypesChange = (value: string[]) => {
    setFormState({ ...formState, tourTypes: value })
  }

  const handleDestinationsChange = (value: string[]) => {
    setFormState({ ...formState, destinationsServed: value })
  }

  const handleLanguagesChange = (value: string[]) => {
    setFormState({ ...formState, languages: value })
  }

  const handleCustomPackagesChange = (checked: boolean) => {
    setFormState({ ...formState, customPackages: checked })
  }

  const handleSubmit = () => {
    onUpdateAction(formState)
    onNextAction()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" /> 
            Tour Services
          </CardTitle>
          <CardDescription>
            Let us know what types of tours and services you offer
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Tour Types Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              What types of tours do you offer?
            </Label>
            <Combobox
              options={TOUR_TYPES}
              selected={formState.tourTypes}
              onChange={handleTourTypesChange}
              placeholder="Select tour types..."
              multiple={true}
            />
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formState.tourTypes.map((type) => {
                const label = TOUR_TYPES.find(t => t.value === type)?.label || type
                return (
                  <Badge key={type} variant="secondary">
                    {label}
                  </Badge>
                )
              })}
            </div>
          </div>
          
          {/* Destinations Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Which regions do you serve?
            </Label>
            <Combobox
              options={DESTINATIONS}
              selected={formState.destinationsServed}
              onChange={handleDestinationsChange}
              placeholder="Select destinations..."
              multiple={true}
            />
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formState.destinationsServed.map((dest) => {
                const label = DESTINATIONS.find(d => d.value === dest)?.label || dest
                return (
                  <Badge key={dest} variant="secondary">
                    {label}
                  </Badge>
                )
              })}
            </div>
          </div>
          
          {/* Languages Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Languages you support
            </Label>
            <Combobox
              options={LANGUAGES}
              selected={formState.languages}
              onChange={handleLanguagesChange}
              placeholder="Select languages..."
              multiple={true}
            />
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formState.languages.map((lang) => {
                const label = LANGUAGES.find(l => l.value === lang)?.label || lang
                return (
                  <Badge key={lang} variant="secondary">
                    {label}
                  </Badge>
                )
              })}
            </div>
          </div>
          
          {/* Custom Packages Option */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="custom-packages" className="font-medium">
              Do you offer custom tour packages?
            </Label>
            <Switch
              id="custom-packages"
              checked={formState.customPackages}
              onCheckedChange={handleCustomPackagesChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBackAction}
          className="space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <Button 
          onClick={handleSubmit}
          className="space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
