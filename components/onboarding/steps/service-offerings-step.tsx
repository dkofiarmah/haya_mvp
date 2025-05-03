"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

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

interface ServiceOfferingsStepProps {
  data: ServiceOfferings;
  onUpdateAction: (data: ServiceOfferings) => void;
  onNextAction: () => void;
  onBackAction: () => void;
}

// Sample data for selections
const TOUR_TYPES = [
  { label: "City Tours", value: "City Tours" },
  { label: "Cultural Experiences", value: "Cultural Experiences" },
  { label: "Food & Wine", value: "Food & Wine" },
  { label: "Adventure", value: "Adventure" },
  { label: "Trekking & Hiking", value: "Trekking & Hiking" },
  { label: "Wildlife & Safari", value: "Wildlife & Safari" },
  { label: "Historical", value: "Historical" },
  { label: "Wellness", value: "Wellness" },
  { label: "Photography", value: "Photography" },
  { label: "Private Tours", value: "Private Tours" },
  { label: "Group Tours", value: "Group Tours" },
  { label: "Day Trips", value: "Day Trips" },
  { label: "Multi-day Trips", value: "Multi-day Trips" }
]

const POPULAR_DESTINATIONS = [
  // Europe
  { label: "Paris, France", value: "Paris, France" },
  { label: "Rome, Italy", value: "Rome, Italy" },
  { label: "Barcelona, Spain", value: "Barcelona, Spain" },
  { label: "London, UK", value: "London, UK" },
  { label: "Amsterdam, Netherlands", value: "Amsterdam, Netherlands" },
  { label: "Zurich, Switzerland", value: "Zurich, Switzerland" },
  
  // North America
  { label: "New York, USA", value: "New York, USA" },
  { label: "Miami, USA", value: "Miami, USA" },
  { label: "San Francisco, USA", value: "San Francisco, USA" },
  { label: "Toronto, Canada", value: "Toronto, Canada" },
  
  // Africa
  { label: "Cape Town, South Africa", value: "Cape Town, South Africa" },
  { label: "Cairo, Egypt", value: "Cairo, Egypt" },
  { label: "Nairobi, Kenya", value: "Nairobi, Kenya" },
  { label: "Marrakech, Morocco", value: "Marrakech, Morocco" },
  { label: "Zanzibar, Tanzania", value: "Zanzibar, Tanzania" },
  { label: "Lagos, Nigeria", value: "Lagos, Nigeria" },
  { label: "Accra, Ghana", value: "Accra, Ghana" },
  { label: "Addis Ababa, Ethiopia", value: "Addis Ababa, Ethiopia" },
  { label: "Kigali, Rwanda", value: "Kigali, Rwanda" },
  { label: "Kampala, Uganda", value: "Kampala, Uganda" },
  
  // Middle East
  { label: "Dubai, UAE", value: "Dubai, UAE" },
  { label: "Abu Dhabi, UAE", value: "Abu Dhabi, UAE" },
  { label: "Riyadh, Saudi Arabia", value: "Riyadh, Saudi Arabia" },
  { label: "Doha, Qatar", value: "Doha, Qatar" },
  { label: "Jerusalem, Israel", value: "Jerusalem, Israel" },
  { label: "Amman, Jordan", value: "Amman, Jordan" },
  { label: "Muscat, Oman", value: "Muscat, Oman" },
  { label: "Beirut, Lebanon", value: "Beirut, Lebanon" },
  { label: "Manama, Bahrain", value: "Manama, Bahrain" },
  { label: "Kuwait City, Kuwait", value: "Kuwait City, Kuwait" },
  
  // Asia & Oceania
  { label: "Tokyo, Japan", value: "Tokyo, Japan" },
  { label: "Bangkok, Thailand", value: "Bangkok, Thailand" },
  { label: "Bali, Indonesia", value: "Bali, Indonesia" },
  { label: "Sydney, Australia", value: "Sydney, Australia" }
]

const LANGUAGES = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Italian", value: "Italian" },
  { label: "Japanese", value: "Japanese" },
  { label: "Mandarin", value: "Mandarin" },
  { label: "Arabic", value: "Arabic" },
  { label: "Russian", value: "Russian" },
  { label: "Portuguese", value: "Portuguese" }
]

const SPECIAL_SERVICES = [
  { label: "Wheelchair Accessible", value: "Wheelchair Accessible" },
  { label: "Family Friendly", value: "Family Friendly" },
  { label: "Pet Friendly", value: "Pet Friendly" },
  { label: "Eco-Friendly", value: "Eco-Friendly" },
  { label: "Luxury", value: "Luxury" },
  { label: "Budget", value: "Budget" },
  { label: "Small Group", value: "Small Group" },
  { label: "Solo Traveler Friendly", value: "Solo Traveler Friendly" },
  { label: "Transportation Included", value: "Transportation Included" },
  { label: "Meals Included", value: "Meals Included" },
  { label: "Guide Included", value: "Guide Included" },
  { label: "Photography Assistance", value: "Photography Assistance" }
]

export function ServiceOfferingsStep({
  data,
  onUpdateAction,
  onNextAction,
  onBackAction
}: ServiceOfferingsStepProps) {
  const [formState, setFormState] = useState<ServiceOfferings>(data)
  
  const handleSubmit = () => {
    onUpdateAction(formState)
    onNextAction()
  }

  const handleMultiSelect = (field: keyof ServiceOfferings, values: string[]) => {
    setFormState(prev => ({
      ...prev,
      [field]: values
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      customPackages: checked
    }))
  }

  const handleGroupSizeChange = (values: number[]) => {
    setFormState(prev => ({
      ...prev,
      groupSize: {
        min: values[0],
        max: values[1]
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Service Offerings</h2>
        <p className="text-muted-foreground mt-2">
          Define the tour services you provide to your clients
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tour Types</CardTitle>
            <CardDescription>
              Select the types of tours and experiences you offer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Combobox
              options={TOUR_TYPES}
              selected={formState.tourTypes}
              onChange={(values) => handleMultiSelect("tourTypes", values)}
              placeholder="Select tour types"
              multiple={true}
              searchable={true}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {formState.tourTypes.map((type) => (
                <Badge key={type} variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Custom Packages</CardTitle>
              <CardDescription>
                Do you offer customized tour packages?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="custom-packages"
                  checked={formState.customPackages}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="custom-packages">
                  {formState.customPackages ? "Yes, we offer customized tours" : "No, we only offer fixed packages"}
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Group Size</CardTitle>
              <CardDescription>
                What's the typical size range for your tour groups?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pt-4 px-2">
                <Slider
                  defaultValue={[formState.groupSize.min, formState.groupSize.max]}
                  max={50}
                  min={1}
                  step={1}
                  onValueChange={handleGroupSizeChange}
                  className="mb-6"
                />
                <div className="flex justify-between items-center mt-2">
                  <span>Min: {formState.groupSize.min} {formState.groupSize.min === 1 ? "person" : "people"}</span>
                  <span>Max: {formState.groupSize.max} people</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Destinations</CardTitle>
            <CardDescription>
              Which destinations do your tour services cover?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Combobox
              options={POPULAR_DESTINATIONS}
              selected={formState.destinationsServed}
              onChange={(values) => handleMultiSelect("destinationsServed", values)}
              placeholder="Select or enter destinations"
              multiple={true}
              searchable={true}
              creatable={true}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {formState.destinationsServed.map((destination) => (
                <Badge key={destination} variant="outline">
                  {destination}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Languages</CardTitle>
              <CardDescription>
                Which languages are supported in your tours?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Combobox
                options={LANGUAGES}
                selected={formState.languages}
                onChange={(values) => handleMultiSelect("languages", values)}
                placeholder="Select languages"
                multiple={true}
                searchable={true}
                creatable={true}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formState.languages.map((language) => (
                  <Badge key={language} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Special Services</CardTitle>
              <CardDescription>
                Do you offer any special services or accommodations?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Combobox
                options={SPECIAL_SERVICES}
                selected={formState.specialServices}
                onChange={(values) => handleMultiSelect("specialServices", values)}
                placeholder="Select special services"
                multiple={true}
                searchable={true}
                creatable={true}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formState.specialServices.map((service) => (
                  <Badge key={service} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
