"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [email, setEmail] = useState("")
  const { requestPasswordReset } = useAuth() // Assuming this function exists in your auth provider

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    if (!email) {
      setError("Please enter your email address.")
      setIsLoading(false)
      return
    }

    try {
      // Replace with your actual password reset function call
      await requestPasswordReset(email)
      setSuccessMessage("If an account exists for this email, a password reset link has been sent.")
      setEmail("") // Clear email field on success
    } catch (error: any) {
      // Avoid revealing if an email exists or not for security
      // Log the actual error for debugging if needed: console.error(error)
      setSuccessMessage("If an account exists for this email, a password reset link has been sent.")
      // setError("Failed to send reset link. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="space-y-1 text-center">
            {/* Optional: Add Logo */}
            {/* <Image src="/logo.svg" alt="Haya Logo" width={40} height={40} className="mx-auto mb-4" /> */}
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email below to receive a password reset link.
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
              {successMessage && (
                 <Alert variant="default" className="text-sm border-green-200 bg-green-50 text-green-800">
                   <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>{successMessage}</AlertDescription>
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
                  disabled={isLoading || !!successMessage} // Disable if loading or success
                  required
                  autoComplete="email"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading || !!successMessage}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Remembered your password?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
