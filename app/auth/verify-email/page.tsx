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

// Component that uses useSearchParams() and will be wrapped in Suspense
function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { confirmEmailVerification } = useAuth();

  useEffect(() => {
    const verify = async () => {
      try {
        // For Supabase, the token comes from the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get('access_token');

        if (!token) {
          setStatus('error');
          setMessage('Verification token missing or invalid.');
          return;
        }

        await confirmEmailVerification(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! Redirecting...');
        // Redirect to onboarding after successful verification
        setTimeout(() => router.push('/onboarding'), 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may be invalid or expired.');
      }
    };

    verify();
  }, [router, confirmEmailVerification]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="items-center text-center">
            {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />}
            {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500 mb-4" />}
            {status === 'error' && <AlertCircle className="h-12 w-12 text-destructive mb-4" />}
            <CardTitle className="text-2xl">
              {status === 'loading' && 'Verifying Your Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Please wait while we verify your email address...'}
              {status === 'success' && 'Your email has been successfully verified.'}
              {status === 'error' && 'We encountered an issue verifying your email.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert variant={status === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {status !== 'loading' && (
              <Button asChild>
                <Link href={status === 'success' ? '/onboarding' : '/login'}>
                  {status === 'success' ? 'Continue to Onboarding' : 'Return to Login'}
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Main page component that wraps VerifyEmailContent in Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
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
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
