"use client"

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/providers/supabase-auth-provider';
import { Loader2, CheckCircle, AlertCircle, MailCheck } from 'lucide-react';
import { authConfig } from '@/lib/config';
import { AuthFlowStatus } from '@/components/auth-flow-status';
import { authFlowRoutes, appRoutes } from '@/lib/routes';
import { supabaseClient } from '@/lib/supabase/auth-client';

// Component that uses useSearchParams() and will be wrapped in Suspense
function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting'>('waiting');
  const [message, setMessage] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, confirmEmailVerification } = useAuth();
  
  // Check if we're in development and if verification should be skipped
  const isDevelopment = process.env.NODE_ENV === 'development';
  const [skipVerificationInDev, setSkipVerificationInDev] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we're in development mode and should skip verification
    if (isDevelopment) {
      // Try to read from an environment variable
      const skipEnvVar = process.env.NEXT_PUBLIC_SKIP_EMAIL_VERIFICATION_IN_DEV === 'true';
      setSkipVerificationInDev(skipEnvVar);
    }
  }, [isDevelopment]);

  useEffect(() => {
    const verify = async () => {
      try {
        // For Supabase, the token comes from the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get('access_token') || searchParams.get('token_hash');

        if (!token) {
          if (user?.email_confirmed_at || skipVerificationInDev) {
            // User is already verified or we're in dev mode with skip enabled
            setStatus('success');
            setMessage('Your email is verified. You can continue.');
            return;
          }
          
          setStatus('waiting');
          setMessage('Please check your email for the verification link.');
          return;
        }

        setStatus('loading');
        await confirmEmailVerification(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! Redirecting...');
        // Redirect to organization creation after successful verification
        setTimeout(() => router.push(authConfig.emailVerification.redirectAfterVerification), 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may be invalid or expired.');
      }
    };

    verify();
  }, [router, confirmEmailVerification, user, skipVerificationInDev, searchParams]);

  const handleContinueToOrganization = () => {
    router.push(authConfig.emailVerification.redirectAfterVerification);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <AuthFlowStatus currentStep="verify-email" />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
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
              {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />}
              {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500 mb-4" />}
              {status === 'error' && <AlertCircle className="h-12 w-12 text-destructive mb-4" />}
              {status === 'waiting' && <MailCheck className="h-12 w-12 text-primary mb-4" />}
              <CardTitle className="text-2xl">
                {status === 'loading' && 'Verifying Your Email'}
                {status === 'success' && 'Email Verified!'}
                {status === 'error' && 'Verification Failed'}
                {status === 'waiting' && 'Verify Your Email'}
              </CardTitle>
              <CardDescription>
                {status === 'loading' && 'Please wait while we verify your email address...'}
                {status === 'success' && 'Your email has been successfully verified.'}
                {status === 'error' && 'We encountered an issue verifying your email.'}
                {status === 'waiting' && 'Please check your inbox and click the verification link we sent you.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert variant={status === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              {status === 'waiting' && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Didn't receive the email? Check your spam folder or request a new verification link.</p>
                </div>
              )}
              
              {isDevelopment && skipVerificationInDev && status !== 'success' && (
                <div className="mt-4 p-2 bg-amber-50 text-amber-700 text-sm rounded-md">
                  <p>Development mode: Email verification is being bypassed. Click continue to proceed.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              {status !== 'loading' && (
                <>
                  {(status === 'success' || (isDevelopment && skipVerificationInDev)) && (
                    <Button onClick={handleContinueToOrganization}>
                      Continue to Organization Setup
                    </Button>
                  )}
                  {status === 'error' && (
                    <Button asChild variant="secondary">
                      <Link href="/login">Return to Login</Link>
                    </Button>
                  )}
                  {status === 'waiting' && (
                    <Button asChild variant="secondary">
                      <Link href="/auth/login">Back to Login</Link>
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main page component that wraps VerifyEmailContent in Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        {/* We can't use AuthFlowStatus here because it might require Suspense itself */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <Card className="shadow-lg">
              <CardHeader className="items-center text-center">
                <MailCheck className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Verifying Email</CardTitle>
                <CardDescription>Please wait while we verify your email address.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto my-4 text-primary" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
