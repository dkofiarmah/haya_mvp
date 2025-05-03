import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CompanySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Update your company details and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Enter company name" defaultValue="LuxTour Travel Agency" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://example.com" defaultValue="https://luxtour.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-description">Company Description</Label>
            <Textarea
              id="company-description"
              placeholder="Enter a brief description of your company"
              defaultValue="LuxTour is a luxury travel agency specializing in bespoke travel experiences for discerning clients. We create personalized itineraries for honeymoons, family adventures, and cultural immersions around the world."
              className="min-h-32"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" placeholder="contact@example.com" defaultValue="info@luxtour.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 987-6543" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {/* North America */}
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  {/* Europe */}
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="it">Italy</SelectItem>
                  <SelectItem value="es">Spain</SelectItem>
                  <SelectItem value="nl">Netherlands</SelectItem>
                  <SelectItem value="ch">Switzerland</SelectItem>
                  {/* Africa */}
                  <SelectItem value="za">South Africa</SelectItem>
                  <SelectItem value="eg">Egypt</SelectItem>
                  <SelectItem value="ke">Kenya</SelectItem>
                  <SelectItem value="tz">Tanzania</SelectItem>
                  <SelectItem value="ma">Morocco</SelectItem>
                  <SelectItem value="ng">Nigeria</SelectItem>
                  <SelectItem value="gh">Ghana</SelectItem>
                  <SelectItem value="et">Ethiopia</SelectItem>
                  <SelectItem value="rw">Rwanda</SelectItem>
                  <SelectItem value="ug">Uganda</SelectItem>
                  {/* Middle East */}
                  <SelectItem value="ae">UAE</SelectItem>
                  <SelectItem value="sa">Saudi Arabia</SelectItem>
                  <SelectItem value="qa">Qatar</SelectItem>
                  <SelectItem value="il">Israel</SelectItem>
                  <SelectItem value="jo">Jordan</SelectItem>
                  <SelectItem value="om">Oman</SelectItem>
                  <SelectItem value="lb">Lebanon</SelectItem>
                  <SelectItem value="bh">Bahrain</SelectItem>
                  <SelectItem value="kw">Kuwait</SelectItem>
                  {/* Other */}
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="custom">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="pst">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                  <SelectItem value="cst">Central Time (CST)</SelectItem>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">US Dollar (USD)</SelectItem>
                  <SelectItem value="eur">Euro (EUR)</SelectItem>
                  <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                  <SelectItem value="cad">Canadian Dollar (CAD)</SelectItem>
                  <SelectItem value="aud">Australian Dollar (AUD)</SelectItem>
                  <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your business address"
              defaultValue="123 Luxury Lane, Suite 500, San Francisco, CA 94107, United States"
              className="min-h-20"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
