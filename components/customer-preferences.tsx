import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"

interface CustomerPreferencesProps {
  preferences: {
    travelStyle: string[]
    dietaryRestrictions: string[]
    specialRequests: string
  }
}

export function CustomerPreferences({ preferences }: CustomerPreferencesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Customer Preferences</CardTitle>
          <CardDescription>Travel preferences and special requirements</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Preferences
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium">Travel Style</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.travelStyle.map((style) => (
              <Badge key={style} variant="secondary">
                {style}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium">Dietary Restrictions</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.dietaryRestrictions.length > 0 ? (
              preferences.dietaryRestrictions.map((diet) => (
                <Badge key={diet} variant="secondary">
                  {diet}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No dietary restrictions specified</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium">Special Requests</h3>
          <p className="mt-2 text-sm">{preferences.specialRequests || "No special requests specified"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Recommended Tours</h3>
          <div className="mt-2 space-y-2">
            <div className="rounded-lg border p-3">
              <div className="font-medium">Bali Luxury Retreat</div>
              <p className="text-sm text-muted-foreground">Matches preferences for Luxury travel</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-medium">Japan Cultural Tour</div>
              <p className="text-sm text-muted-foreground">Matches preferences for Cultural travel</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-medium">New Zealand Adventure</div>
              <p className="text-sm text-muted-foreground">Matches preferences for Adventure travel</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
