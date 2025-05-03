"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { supabaseClient } from "@/lib/supabase/auth-client"
import Image from "next/image"

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signInWithEmail, user } = useAuth()

  useEffect(() => {
    // Check for password reset success message
    const resetSuccess = searchParams.get('passwordReset')
    if (resetSuccess === 'true') {
      setSuccess('Your password has been reset successfully. Please log in with your new password.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await signInWithEmail(email, password)
      
      // Get the refreshed session with current user
      const { data: sessionData } = await supabaseClient.auth.getSession()
      const currentUser = sessionData.session?.user
      
      if (!currentUser) {
        throw new Error("Failed to retrieve user session")
      }
      
      // Check if email is verified
      if (!currentUser.email_confirmed_at) {
        router.push('/auth/verification-pending')
        return
      }
      
      // Set a flag in session storage to indicate coming from login
      sessionStorage.setItem('from_login', 'true')
      
      // Check if the user needs to complete onboarding and if they have an organization
      const { data: profileData } = await supabaseClient
        .from('user_profiles')
        .select('onboarding_completed, last_active_organization')
        .eq('id', currentUser.id)
        .single()
        
      // Check if user has any organization
      const { data: orgData } = await supabaseClient
        .from('organization_users')
        .select('organization_id')
        .eq('user_id', currentUser.id)
        
      // If no organization, redirect to create one
      if (!orgData || orgData.length === 0) {
        router.push('/onboarding/create-organization')
        return
      }
      
      // If onboarding is not completed, redirect to onboarding
      if (!profileData?.onboarding_completed) {
        router.push('/onboarding')
        return
      }
      
      const redirectUrl = searchParams.get('redirect') || '/dashboard'
      router.push(redirectUrl)
    } catch (error: any) {
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email address before logging in. Check your inbox for the verification link.")
      } else if (error.message?.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. Please try again.")
      } else {
        setError("An error occurred during login. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mb-4 block text-center">
              <Image
                src="/haya-logo.svg"
                alt="HAYA"
                width={32}
                height={32}
                className="mx-auto h-8 w-8"
                priority
                fetchPriority="high"
              />
            </Link>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your Haya dashboard.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-600 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline underline-offset-4"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="font-medium text-primary hover:underline underline-offset-4">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
