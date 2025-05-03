"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Building, Loader2, ChevronRight, Check } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase/auth-client'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { authConfig } from '@/lib/config'
import { CreateOrgStatus } from '@/components/create-org-status'
import { authFlowRoutes } from '@/lib/routes'

export default function CreateOrganizationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    phone: '',
    website: '', // Keep website for the form but will be stored in settings
    address: '', // Keep address for the form but will be stored in settings
    country: '',
  })
  const router = useRouter()
  const { user } = useAuth()

  // Check if user can access this page
  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // If user hasn't verified email, redirect to verification page
    // Note: In development environment with verification skipped, this check is skipped too
    const isDevelopment = process.env.NODE_ENV === 'development';
    const shouldSkipVerification = isDevelopment && authConfig.emailVerification.skipInDevelopment;
    
    if (!user.email_confirmed_at && !shouldSkipVerification) {
      router.push(authFlowRoutes.verifyEmail);
      return;
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.name) {
      setError('Organization name is required')
      setIsLoading(false)
      return
    }
    
    if (!formData.country) {
      setError('Please select a country from the dropdown')
      setIsLoading(false)
      return
    }

    try {
      // Generate a unique URL-friendly slug from organization name
      let slug = formData.name
        .toLowerCase()
        .trim()
        .normalize('NFKD') // Normalize unicode characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      
      // Add a timestamp to ensure uniqueness
      const timestamp = Date.now().toString(36)
      slug = `${slug}-${timestamp}`

      // Create organization with the correct schema
      const { data: newOrg, error: orgError } = await supabaseClient
        .from('organizations')
        .insert({
          name: formData.name,
          logo_url: null,
          slug,
          contact_email: formData.contact_email || user?.email,
          phone: formData.phone || null,
          subscription_status: 'trial',
          subscription_tier: 'starter',
          max_users: 5,
          max_experiences: 100,
          max_ai_agents: 3,
          settings: {
            companyDetails: {
              locations: {
                headquarters: formData.country,
                operatingRegions: [formData.country]
              },
              website: formData.website || null,
              address: formData.address || null,
              specialties: [],
              employeeCount: null
            },
            serviceOfferings: {
              tourTypes: [],
              languages: ["English"]
            },
            aiPreferences: {
              responseLength: "balanced",
              automationLevel: "balanced",
              communicationStyle: "professional",
              customizationLevel: "moderate",
              languagePreference: "en",
              proactiveEngagement: true
            },
            enabledAssistants: ["discovery", "itinerary", "concierge", "notifications"]
          }
        })
        .select()
        .single()

      if (orgError) throw orgError
      if (!newOrg) throw new Error('Failed to create organization')

      // Link user to organization as owner
      const { error: linkError } = await supabaseClient
        .from('organization_users')
        .insert({
          user_id: user!.id,
          organization_id: newOrg.id,
          role: 'owner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (linkError) throw linkError

      // Update user profile with the new organization
      const { error: profileUpdateError } = await supabaseClient
        .from('user_profiles')
        .update({
          last_active_organization: newOrg.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id)

      if (profileUpdateError) throw profileUpdateError

      // Organization created successfully, redirect to the configured path
      router.push(authConfig.organization.redirectAfterCreation)
    } catch (err: any) {
      console.error('Error creating organization:', err)
      setError(err.message || 'Failed to create organization. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Steps removed as requested */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mb-4 block text-center">
              <Image
                src="/haya-logo.svg"
                alt="HAYA"
                width={60}
                height={60}
                className="mx-auto"
                priority
                fetchPriority="high"
              />
            </Link>
            <Building className="h-12 w-12 text-primary mb-4 mx-auto" />
            <CardTitle className="text-2xl">Create Your Organization</CardTitle>
            <CardDescription>
              Tell us about your travel company to set up your personalized workspace
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-2">
              Fields marked with * are required
            </p>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-medium">
                  Organization Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Your travel company name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact_email" className="font-medium">
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder={user?.email || "contact@example.com"}
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="website" className="font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="country" className="font-medium">
                  Country *
                </Label>
                <select
                  id="country"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={isLoading}
                  required
                >
                  <option value="">Select a country</option>
                  {/* Major Markets */}
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  
                  {/* African Countries */}
                  <optgroup label="Africa">
                    <option value="South Africa">South Africa</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Seychelles">Seychelles</option>
                  </optgroup>
                  
                  {/* Middle Eastern Countries */}
                  <optgroup label="Middle East">
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Israel">Israel</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Oman">Oman</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Turkey">Turkey</option>
                  </optgroup>
                  
                  {/* European Countries */}
                  <optgroup label="Europe">
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Greece">Greece</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Norway">Norway</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Finland">Finland</option>
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Poland">Poland</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Croatia">Croatia</option>
                  </optgroup>
                  
                  {/* Other Major Countries */}
                  <optgroup label="Other Regions">
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Indonesia">Indonesia</option>
                  </optgroup>
                  
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address" className="font-medium">
                  Business Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete business address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={isLoading}
                  className="resize-none"
                  rows={2}
                />
              </div>
              

            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Organization...
                  </>
                ) : (
                  <>
                    Create Tour Company
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                By creating an organization, you agree to our 
                <Link href="/terms" className="text-primary hover:underline ml-1">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        </div>
      </div>
    </div>
  )
}
