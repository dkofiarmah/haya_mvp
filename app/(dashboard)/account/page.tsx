"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { useOnboarding } from "@/hooks/use-onboarding"
import { User, Mail, LogOut, ArrowRight, Shield, AlertTriangle } from "lucide-react"

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const { isComplete } = useOnboarding()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }
  
  const goToProfileSettings = () => {
    router.push('/profile')
  }
  
  const handleResetPassword = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password."
      })
    }, 1500)
  }
  
  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your account information
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-xl font-bold">
                  {user?.user_metadata?.name || 'Tour Operator'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {user?.email || 'user@example.com'}
                </p>
                
                <div className="mt-6 space-y-2 w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={goToProfileSettings}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-8">
          {!isComplete && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Your account setup is incomplete</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Complete your account setup to unlock all features and personalize your experience.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => router.push("/onboarding")}
                    className="bg-amber-600 hover:bg-amber-700 text-white gap-2 whitespace-nowrap"
                  >
                    Continue Setup <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details and membership information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-1">
                  <div className="font-medium text-sm">Email Address</div>
                  <div className="text-sm flex items-center">
                    <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 py-1">
                  <div className="font-medium text-sm">Account Type</div>
                  <div className="text-sm">Tour Operator</div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 py-1">
                  <div className="font-medium text-sm">Member Since</div>
                  <div className="text-sm">April 2025</div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 py-1">
                  <div className="font-medium text-sm">Subscription Plan</div>
                  <div className="text-sm">Professional Plan ($79/month)</div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 py-1">
                  <div className="font-medium text-sm">Next Billing Date</div>
                  <div className="text-sm">May 20, 2025</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={goToProfileSettings} 
                variant="outline" 
                className="gap-2"
              >
                Manage Account <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent account activities and sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Last Login</p>
                    <p className="text-xs text-muted-foreground">Today at 9:42 AM</p>
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded">
                    Current Session
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Password Changed</p>
                    <p className="text-xs text-muted-foreground">April 10, 2025 at 2:15 PM</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Login from New Device</p>
                    <p className="text-xs text-muted-foreground">April 5, 2025 at 11:30 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
