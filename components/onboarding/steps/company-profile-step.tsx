"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CompanyDetails } from "../types"
import { Icons } from "../icons"
import { cn } from "@/lib/utils"

interface CompanyProfileStepProps extends React.HTMLAttributes<HTMLDivElement> {
  data: CompanyDetails
  onUpdateAction: (data: CompanyDetails) => void
  onNextAction: () => void
}

const OPERATING_REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Middle East",
  "Africa",
  "Asia",
  "Oceania"
] as const

export const CompanyProfileStep = React.forwardRef<HTMLDivElement, CompanyProfileStepProps>(
  ({ data, onUpdateAction, onNextAction, className, ...props }, ref) => {
    const isValid = data.name && data.description && data.businessModel.type

    const toggleOperatingRegion = (region: string) => {
      const newRegions = data.locations.operatingRegions.includes(region)
        ? data.locations.operatingRegions.filter(r => r !== region)
        : [...data.locations.operatingRegions, region]
      
      onUpdateAction({
        ...data,
        locations: { ...data.locations, operatingRegions: newRegions }
      })
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center justify-between">
                Company Name
                <span className="text-xs text-muted-foreground">
                  This will be your organization name in the system
                </span>
              </Label>
              <Input
                id="name"
                placeholder="Your luxury travel company name"
                value={data.name}
                onChange={(e) => onUpdateAction({ ...data, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your luxury travel business..."
                value={data.description}
                onChange={(e) => onUpdateAction({ ...data, description: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-company.com"
                  value={data.website}
                  onChange={(e) => onUpdateAction({ ...data, website: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearEstablished">Year Established</Label>
                <Input
                  id="yearEstablished"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder={new Date().getFullYear().toString()}
                  value={data.yearEstablished}
                  onChange={(e) => onUpdateAction({ ...data, yearEstablished: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={data.businessModel.type}
                onValueChange={(value: 'b2c' | 'b2b' | 'both') => 
                  onUpdateAction({
                    ...data,
                    businessModel: { ...data.businessModel, type: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2c">B2C (Direct to Travelers)</SelectItem>
                  <SelectItem value="b2b">B2B (Travel Agencies)</SelectItem>
                  <SelectItem value="both">Both B2C and B2B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headquarters">Headquarters Location</Label>
              <Input
                id="headquarters"
                placeholder="City, Country"
                value={data.locations.headquarters}
                onChange={(e) => 
                  onUpdateAction({
                    ...data,
                    locations: { ...data.locations, headquarters: e.target.value }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Operating Regions</Label>
              <div className="flex flex-wrap gap-2">
                {OPERATING_REGIONS.map((region) => (
                  <Badge
                    key={region}
                    variant={data.locations.operatingRegions.includes(region) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleOperatingRegion(region)}
                  >
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMarket">Target Market</Label>
              <Textarea
                id="targetMarket"
                placeholder="Describe your ideal customers (e.g., affluent couples, luxury family travelers)..."
                value={data.targetMarket}
                onChange={(e) => onUpdateAction({ ...data, targetMarket: e.target.value })}
              />
            </div>

            <Button 
              className="w-full mt-6" 
              onClick={onNextAction}
              disabled={!isValid}
            >
              Next <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
)

CompanyProfileStep.displayName = "CompanyProfileStep"
