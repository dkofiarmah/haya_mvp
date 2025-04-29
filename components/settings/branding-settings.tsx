import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

export function BrandingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
        <CardDescription>Customize your brand appearance across the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="visual" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visual">Visual Identity</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>
          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-md border">
                      <img
                        src="/placeholder.svg?height=96&width=96"
                        alt="Company logo"
                        className="h-16 w-16 rounded-md object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" className="mb-2">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground">Recommended size: 512x512px. PNG or SVG format.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-md border">
                      <img
                        src="/placeholder.svg?height=32&width=32"
                        alt="Favicon"
                        className="h-8 w-8 rounded-md object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" className="mb-2">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Favicon
                      </Button>
                      <p className="text-xs text-muted-foreground">Recommended size: 32x32px. PNG or ICO format.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Brand Colors</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-xs">
                      Primary Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary"></div>
                      <Input id="primary-color" defaultValue="#0070f3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color" className="text-xs">
                      Secondary Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-secondary"></div>
                      <Input id="secondary-color" defaultValue="#f5f5f5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-xs">
                      Accent Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-green-500"></div>
                      <Input id="accent-color" defaultValue="#10b981" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Fonts</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="heading-font" className="text-xs">
                      Heading Font
                    </Label>
                    <Input id="heading-font" defaultValue="Inter" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body-font" className="text-xs">
                      Body Font
                    </Label>
                    <Input id="body-font" defaultValue="Inter" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="messaging" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-tagline">Company Tagline</Label>
                <Input
                  id="company-tagline"
                  placeholder="Enter your company tagline"
                  defaultValue="Extraordinary Journeys, Expertly Crafted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-voice">Brand Voice Description</Label>
                <Textarea
                  id="brand-voice"
                  placeholder="Describe your brand's voice and tone"
                  defaultValue="Our brand voice is sophisticated yet approachable, knowledgeable but never pretentious. We communicate with warmth, expertise, and a passion for exceptional travel experiences."
                  className="min-h-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcome-message">Default Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  placeholder="Enter default welcome message for new clients"
                  defaultValue="Welcome to LuxTour! We're excited to help you plan your next extraordinary journey. Our team of travel experts is ready to create a personalized experience tailored to your preferences."
                  className="min-h-20"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-header">Email Header</Label>
                <div className="flex h-40 items-center justify-center rounded-md border">
                  <img
                    src="/placeholder.svg?height=160&width=600"
                    alt="Email header"
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
                <Button variant="outline" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Header Image
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <Textarea
                  id="email-signature"
                  placeholder="Enter your email signature"
                  defaultValue="Best regards,\n\nThe LuxTour Team\ninfo@luxtour.com | +1 (555) 987-6543\nwww.luxtour.com"
                  className="min-h-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-footer">Email Footer</Label>
                <Textarea
                  id="email-footer"
                  placeholder="Enter your email footer"
                  defaultValue="© 2025 LuxTour Travel Agency. All rights reserved.\n123 Luxury Lane, Suite 500, San Francisco, CA 94107, United States"
                  className="min-h-20"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
