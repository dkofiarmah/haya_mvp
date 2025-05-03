"use client"

import { useState, useEffect } from "react"
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
import { ArrowRight, Globe, Building2 } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"

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

interface SimplifiedCompanyStepProps {
  data: CompanyDetails;
  onUpdateAction: (data: CompanyDetails) => void;
  onNextAction: () => void;
  showOrgNameUpdate?: boolean;
}

const COUNTRIES = [
  { label: "United States", value: "United States" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Canada", value: "Canada" },
  { label: "Australia", value: "Australia" },
  { label: "France", value: "France" },
  { label: "Germany", value: "Germany" },
  { label: "Spain", value: "Spain" },
  { label: "Italy", value: "Italy" },
  { label: "Japan", value: "Japan" },
  { label: "China", value: "China" },
  { label: "India", value: "India" },
  { label: "Brazil", value: "Brazil" },
  { label: "Mexico", value: "Mexico" },
  { label: "South Africa", value: "South Africa" },
]

const EMPLOYEE_COUNT_OPTIONS = [
  { label: "1-5 employees", value: "1-5" },
  { label: "6-20 employees", value: "6-20" },
  { label: "21-50 employees", value: "21-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201+ employees", value: "201+" }
]

export function SimplifiedCompanyStep({ 
  data, 
  onUpdateAction, 
  onNextAction,
  showOrgNameUpdate = true // Changed default to true so company name is always shown
}: SimplifiedCompanyStepProps) {
  // Log the incoming data to verify name is present
  console.log("SimplifiedCompanyStep received data:", data);
  
  const [formState, setFormState] = useState<CompanyDetails>(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Check for missing company name when component mounts
  useEffect(() => {
    if (!data.name && showOrgNameUpdate) {
      console.warn("Company name is missing in provided data");
    } else {
      console.log("Company name from data:", data.name);
    }
    
    // If name is missing in formState but present in data, update it
    if (!formState.name && data.name) {
      console.log("Updating form state with name from data");
      setFormState(prev => ({
        ...prev,
        name: data.name
      }));
    }
  }, [data, formState.name, showOrgNameUpdate]);
  
  // Simple form validation - only require essential fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    console.log("Validating form with name:", formState.name);
    
    // Check if name is empty - protect against undefined
    if (!formState.name || !formState.name.trim()) {
      console.log("Company name is missing or empty");
      newErrors.name = "Company name is required"
    }
    
    // Headquarters location is no longer required since we get it from organization creation
    
    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0;
    console.log("Form validation result:", isValid ? "Valid" : "Invalid");
    return isValid;
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdateAction(formState)
      onNextAction()
    }
  }

  const handleUpdateName = (value: string) => {
    console.log("Updating company name to:", value);
    
    setFormState(prev => ({
      ...prev,
      name: value
    }))
    
    if (errors.name) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated.name
        return updated
      })
    }
  }
  
  const handleUpdateDescription = (value: string) => {
    setFormState(prev => ({
      ...prev,
      description: value
    }))
  }

  const handleUpdateHeadquarters = (value: string) => {
    setFormState(prev => ({
      ...prev,
      locations: {
        ...prev.locations,
        headquarters: value
      }
    }))
    
    if (errors.headquarters) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated.headquarters
        return updated
      })
    }
  }
  
  const handleUpdateEmployeeCount = (value: string) => {
    setFormState(prev => ({
      ...prev,
      employeeCount: value
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> 
            Company Details
          </CardTitle>
          <CardDescription>
            Verify or update your company name and organization information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Organization Name - always show but mark as prefilled if we have a value */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium flex items-center">
              Company Name <span className="text-destructive">*</span>
              {formState.name && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">From registration</span>}
            </Label>
            <Input
              id="name"
              value={formState.name || ""}
              onChange={(e) => handleUpdateName(e.target.value)}
              placeholder="Your tour company name"
              className={`${errors.name ? "border-destructive ring-destructive" : formState.name ? "border-blue-200 focus:border-blue-300 focus:ring-blue-200" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {formState.name ? 
                "This is the name you provided during registration. Please verify it's correct or update it if needed." : 
                "Enter your company name"}
            </p>
          </div>
          
          {/* Company Description - simplified */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              About Your Company
            </Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) => handleUpdateDescription(e.target.value)}
              placeholder="A brief description of your tour business"
              rows={3}
            />
          </div>
          
          {/* Headquarters Location - display as readonly */}
          {formState.locations.headquarters ? (
            <div className="space-y-2">
              <Label htmlFor="headquarters" className="font-medium">
                Headquarters Location
              </Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                <span className="text-muted-foreground">
                  {formState.locations.headquarters}
                </span>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  From organization registration
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Location from your organization details
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="headquarters" className="font-medium">
                Headquarters Location
              </Label>
              <Select 
                value={formState.locations.headquarters} 
                onValueChange={handleUpdateHeadquarters}
              >
                <SelectTrigger id="headquarters">
                  <SelectValue placeholder="Select your headquarters location" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Company Size - optional */}
          <div className="space-y-2">
            <Label htmlFor="employeeCount" className="font-medium">
              Company Size
            </Label>
            <Select 
              value={formState.employeeCount} 
              onValueChange={handleUpdateEmployeeCount}
            >
              <SelectTrigger id="employeeCount">
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
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="space-x-2">
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
