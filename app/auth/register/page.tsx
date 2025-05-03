"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/auth-client"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { ErrorDiagnostic } from "@/components/error-diagnostic"

// Component to wrap the registration form
function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const router = useRouter()
  const { signUpWithEmail } = useAuth()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    if (!formData.fullName) {
      setError("Please enter your full name")
      setIsLoading(false)
      return
    }
    // Company name check removed - will be asked during org creation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
       setError("Please enter a valid email address")
       setIsLoading(false)
       return
    }

    try {
      // Use the signUpWithEmail method from our auth provider
      const { userId, organizationId } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullName
      );
      
      setSuccessMessage("Account created! Check your inbox for a verification email.");
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      
      // Navigate to verification pending page
      router.push('/auth/verification-pending');
    } catch (error: any) {
      console.error("Registration error:", error);
      // Store the error message directly without redirection
      // The ErrorDiagnostic component will handle RLS issues
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {successMessage && !error && (
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Verification Email Sent!</CardTitle>
            <CardDescription>
              {successMessage} Please click the link in the email to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Didn't receive it? Check your spam folder.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/auth/login">
              <Button variant="default">Go to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      {!successMessage && (
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="space-y-1 text-center">
            <div className="relative">
              <Link href="/auth/login" className="absolute -top-2 -left-1 text-sm flex items-center text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back
              </Link>
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
            </div>
            <CardTitle className="text-2xl">Create your Haya Account</CardTitle>
            <CardDescription>
              Get started in seconds.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              {error && (
                <Alert variant="destructive" className="text-sm">
                   <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={isLoading}
                  required
                  autoComplete="name"
                />
              </div>
              {/* Company name removed - will be asked during org creation */}
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    8+ characters
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    &nbsp; {/* Adding space to align with the password field */}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </CardFooter>
          </form>
          <div className="p-4 pt-0 mt-2 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
