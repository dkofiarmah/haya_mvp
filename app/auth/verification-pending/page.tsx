"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, MailIcon, ArrowRight, RefreshCcw } from 'lucide-react'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { supabaseClient } from '@/lib/supabase/auth-client'
import { isDevelopmentMode } from '@/lib/utils/environment'
// Import removed as it's unused

export default function VerificationPendingPage() {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified'>('pending')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  
  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])
  
  // Function to check if email is verified
  const checkEmailVerification = async () => {
    setIsCheckingEmail(true)
    setError(null)
    
    try {
      // Refresh the session to get updated user info
      const { data, error } = await supabaseClient.auth.refreshSession()
      
      if (error) {
        throw error
      }
      
      // Check if email is confirmed (verified)
      if (data.user?.email_confirmed_at) {
        // Before redirecting, check if the RPC function exists
        try {
          // Using the correct parameter name based on other usages
          const { error: rpcError } = await supabaseClient
            .rpc('get_user_organizations_safe', { user_uuid: data.user.id });
            
          // If the function doesn't exist, redirect to the fix page
          if (rpcError && rpcError.message.includes('function') && rpcError.message.includes('does not exist')) {
            console.log("RPC function missing, redirecting to fix page")
            router.push('/auth/verification-fix')
            return
          }
        } catch (rpcCheckError) {
          console.error("Error checking RPC function:", rpcCheckError)
          // Continue with normal flow even if check fails
        }
        
        setVerificationStatus('verified')
        // Short delay before redirecting
        setTimeout(() => {
          router.push('/onboarding')
        }, 1500)
      } else {
        setVerificationStatus('pending')
      }
    } catch (err: any) {
      setError(err.message || 'Error checking verification status')
    } finally {
      setIsCheckingEmail(false)
    }
  }
  
  // For development mode, provide option to bypass verification
  const bypassVerification = () => {
    router.push('/onboarding')
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="items-center text-center">
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
            
            {verificationStatus === 'pending' ? (
              <>
                <MailIcon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                <CardDescription>
                  We've sent a verification email to your inbox.
                  Please check your email and click the verification link to continue.
                </CardDescription>
              </>
            ) : (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle className="text-2xl">Email Verified!</CardTitle>
                <CardDescription>
                  Your email has been verified successfully. Redirecting to onboarding...
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="text-center">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {verificationStatus === 'pending' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try refreshing.
                </p>
                
                <Button 
                  onClick={checkEmailVerification} 
                  disabled={isCheckingEmail} 
                  className="w-full"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {isCheckingEmail ? 'Checking...' : "I've verified my email"}
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            {/* Development mode bypass option */}
            {isDevelopmentMode() && verificationStatus === 'pending' && (
              <div className="w-full">
                <Button 
                  variant="outline" 
                  onClick={bypassVerification} 
                  className="w-full text-amber-600 border-amber-300"
                >
                  Development Mode: Skip Verification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  (This option is only available in development mode)
                </p>
              </div>
            )}
            
            {verificationStatus === 'pending' && (
              <div className="w-full mt-4 pt-4 border-t text-center text-sm">
                <Link href="/auth/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
