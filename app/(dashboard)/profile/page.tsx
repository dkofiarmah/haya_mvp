"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { useOnboarding } from "@/hooks/use-onboarding"
import { 
  UserCircle, 
  Building, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  ArrowRight
} from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const { isComplete } = useOnboarding()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Basic form state
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    companyName: "",
    jobTitle: ""
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulating an API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile and preferences
        </p>
      </div>
      
      {!isComplete && (
        <Card className="mb-8 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-amber-800">Your profile setup is incomplete</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Complete your profile setup to unlock all features and personalize your experience.
                </p>
              </div>
              <Button 
                onClick={() => router.push("/onboarding")}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                Continue Setup <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-5 h-auto p-1">
          <TabsTrigger value="profile" className="flex items-center gap-2 py-2">
            <UserCircle className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2 py-2">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2 py-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 py-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 py-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Your full name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="your.email@example.com" 
                    disabled 
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed directly. Contact support for assistance.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+1 (555) 123-4567" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    name="jobTitle" 
                    value={formData.jobTitle} 
                    onChange={handleInputChange} 
                    placeholder="Tour Manager" 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <UserCircle className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline">Upload new picture</Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 400x400 pixels
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Update your password to maintain account security
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      View and manage your currently active login sessions
                    </p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={formData.companyName} 
                    onChange={handleInputChange} 
                    placeholder="Your company name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    placeholder="https://yourcompany.com" 
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    placeholder="123 Travel Street, City, Country" 
                  />
                </div>
              </div>
              
              {!isComplete && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Complete your onboarding</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        To update all your company information, please complete the onboarding process.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => router.push("/onboarding")}
                      >
                        Complete Onboarding
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button disabled={!isComplete}>
                Save Company Info
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize your dashboard experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Compact View</h4>
                    <p className="text-sm text-muted-foreground">
                      Display more information with less spacing
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sidebar Collapsed by Default</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with a collapsed sidebar for more workspace
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Configure system-wide settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically update data and refresh views
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show AI Suggestions</h4>
                    <p className="text-sm text-muted-foreground">
                      Get smart recommendations and tips as you work
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                Save System Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which emails you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Bookings</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new tour bookings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Customer Messages</h4>
                    <p className="text-sm text-muted-foreground">
                      Be notified when customers send new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Confirmations</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about payments and invoices
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Get product updates and promotional emails
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>
                Configure alerts and notifications within the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Task Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Show alerts for upcoming tasks and deadlines
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">AI Assistant Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when AI assistants need your attention
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sound Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for important notifications
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                Save In-App Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                View and manage your current subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-block px-2 py-1 bg-primary/10 rounded-md text-primary text-xs font-medium mb-2">
                      PROFESSIONAL PLAN
                    </div>
                    <h3 className="font-medium text-lg">$79/month</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed monthly • Renews on May 20, 2025
                    </p>
                  </div>
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    Unlimited tour bookings
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    5 AI assistants
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    10 team members
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    Advanced analytics
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline">
                View Plans
              </Button>
              <Button variant="default">
                Upgrade Plan
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Invoice #INV-2543</p>
                    <p className="text-sm text-muted-foreground">April 20, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">$79.00</span>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Invoice #INV-2499</p>
                    <p className="text-sm text-muted-foreground">March 20, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">$79.00</span>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Invoice #INV-2455</p>
                    <p className="text-sm text-muted-foreground">February 20, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">$79.00</span>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                View All Invoices
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
