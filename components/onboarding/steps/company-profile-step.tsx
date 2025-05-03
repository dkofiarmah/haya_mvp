"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { Badge } from "@/components/ui/badge"

interface CompanyDetails {
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
}

interface CompanyProfileStepProps {
  data: CompanyDetails;
  onUpdateAction: (data: CompanyDetails) => void;
  onNextAction: () => void;
  showOrgNameUpdate?: boolean; // Whether to show organization name update field
}

const EMPLOYEE_COUNT_OPTIONS = [
  { label: "1-5 employees", value: "1-5" },
  { label: "6-20 employees", value: "6-20" },
  { label: "21-50 employees", value: "21-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201+ employees", value: "201+" }
]

const REGIONS = [
  { label: "North America", value: "North America" },
  { label: "South America", value: "South America" },
  { label: "Europe", value: "Europe" },
  { label: "Africa", value: "Africa" },
  { label: "Middle East", value: "Middle East" },
  { label: "Asia", value: "Asia" },
  { label: "Oceania", value: "Oceania" }
]

const BUSINESS_MODEL_OPTIONS = [
  { label: "B2C (Direct to Consumer)", value: "b2c" },
  { label: "B2B (Business to Business)", value: "b2b" },
  { label: "Both B2C and B2B", value: "both" }
]

export function CompanyProfileStep({ 
  data, 
  onUpdateAction, 
  onNextAction,
  showOrgNameUpdate = false
}: CompanyProfileStepProps) {
  const [formState, setFormState] = useState<CompanyDetails>(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orgNameChanged, setOrgNameChanged] = useState(false)
  
  // Simpler form validation - only require organization name
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formState.name.trim()) {
      newErrors.name = "Company name is required"
    }
    
    // Only these essential fields are required
    if (!formState.locations.headquarters) {
      newErrors.headquarters = "Please select your headquarters location"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdateAction(formState)
      onNextAction()
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormState(prev => {
      // Handle nested properties
      if (field.includes(".")) {
        const [parent, child, grandchild] = field.split(".")
        if (grandchild) {
          return {
            ...prev,
            [parent]: {
              ...prev[parent as keyof CompanyDetails],
              [child]: {
                ...prev[parent as keyof CompanyDetails][child as keyof typeof prev[keyof CompanyDetails]],
                [grandchild]: value
              }
            }
          }
        } else {
          return {
            ...prev,
            [parent]: {
              ...prev[parent as keyof CompanyDetails],
              [child]: value
            }
          }
        }
      }
      
      // Handle top-level properties
      return {
        ...prev,
        [field]: value
      }
    })
    
    // Clear error for the field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const handleRegionChange = (selectedRegions: string[]) => {
    setFormState(prev => ({
      ...prev,
      locations: {
        ...prev.locations,
        operatingRegions: selectedRegions
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Company Profile</h2>
        <p className="text-muted-foreground mt-2">
          Tell us about your tour business so we can personalize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name <span className="text-destructive">*</span></Label>
            <Input
              id="company-name"
              placeholder="Enter your company name"
              value={formState.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="company-description"
              placeholder="Briefly describe your tour business"
              value={formState.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-website">Website</Label>
            <Input
              id="company-website"
              placeholder="https://yourcompany.com"
              value={formState.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className={errors.website ? "border-destructive" : ""}
            />
            {errors.website && (
              <p className="text-sm text-destructive">{errors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-established">Year Established</Label>
            <Input
              id="year-established"
              placeholder="e.g., 2010"
              value={formState.yearEstablished}
              onChange={(e) => handleChange("yearEstablished", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employee-count">Company Size</Label>
            <Select
              value={formState.employeeCount}
              onValueChange={(value) => handleChange("employeeCount", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_COUNT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-model">Business Model</Label>
            <Select
              value={formState.businessModel.type}
              onValueChange={(value: "b2c" | "b2b" | "both") => 
                handleChange("businessModel.type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your business model" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="headquarters">Main Location/Headquarters</Label>
            <Input
              id="headquarters"
              placeholder="e.g., Paris, France"
              value={formState.locations.headquarters}
              onChange={(e) => handleChange("locations.headquarters", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Operating Regions</Label>
            <Combobox
              options={REGIONS}
              selected={formState.locations.operatingRegions}
              onChange={handleRegionChange}
              placeholder="Select regions"
              multiple={true}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formState.locations.operatingRegions.map((region) => (
                <Badge key={region} variant="outline">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="specialties">Business Specialties</Label>
            <Input
              id="specialties"
              placeholder="e.g., Adventure Tours, Cultural Experiences"
              value={formState.specialties}
              onChange={(e) => handleChange("specialties", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-market">Target Market</Label>
            <Input
              id="target-market"
              placeholder="e.g., Millennials, Luxury Travelers"
              value={formState.targetMarket}
              onChange={(e) => handleChange("targetMarket", e.target.value)}
            />
          </div>
        </div>

        {formState.businessModel.type !== "b2b" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avg-booking-value">Average Booking Value</Label>
              <Input
                id="avg-booking-value"
                placeholder="e.g., $500"
                value={formState.businessModel.averageBookingValue}
                onChange={(e) => handleChange("businessModel.averageBookingValue", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-bookings">Estimated Annual Bookings</Label>
              <Input
                id="annual-bookings"
                placeholder="e.g., 500"
                value={formState.businessModel.annualBookings}
                onChange={(e) => handleChange("businessModel.annualBookings", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end">
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
