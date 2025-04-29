import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Download, Users } from "lucide-react"

export function SubscriptionSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription and billing details.</CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground">Professional</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-medium">Professional Plan</h3>
                <p className="text-sm text-muted-foreground">$199 per month, billed annually</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Active
                </Badge>
                <span className="text-sm text-muted-foreground">Renews on Oct 15, 2025</span>
              </div>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 10 team members</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">All AI agents included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited itineraries</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Custom branding</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <Button variant="outline" className="flex-1">
              Change Plan
            </Button>
            <Button variant="outline" className="flex-1 text-red-500">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Manage your payment methods and billing history.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Payment Method</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 09/2026</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Billing History</h3>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>
            <div className="rounded-lg border">
              <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-sm font-medium">
                <div>Date</div>
                <div>Description</div>
                <div>Amount</div>
                <div className="text-right">Invoice</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-4 items-center p-3">
                  <div className="text-sm">Oct 15, 2024</div>
                  <div className="text-sm">Professional Plan (Annual)</div>
                  <div className="text-sm">$2,388.00</div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center p-3">
                  <div className="text-sm">Oct 15, 2023</div>
                  <div className="text-sm">Professional Plan (Annual)</div>
                  <div className="text-sm">$2,388.00</div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center p-3">
                  <div className="text-sm">Oct 15, 2022</div>
                  <div className="text-sm">Standard Plan (Annual)</div>
                  <div className="text-sm">$1,188.00</div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Monitor your current usage and plan limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Team Members</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">of 10 used</div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-1/2 rounded-full bg-primary"></div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
                <span className="text-sm font-medium">API Calls</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">24,389</div>
                <div className="text-sm text-muted-foreground">of 50,000 used</div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-[48%] rounded-full bg-primary"></div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-sm font-medium">Storage</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">2.4 GB</div>
                <div className="text-sm text-muted-foreground">of 10 GB used</div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-[24%] rounded-full bg-primary"></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View Detailed Usage Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
