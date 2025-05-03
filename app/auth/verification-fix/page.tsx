'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/supabase-auth-provider';
import { redirect } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

/**
 * This component provides an automatic fix for the missing RPC function
 * that's used in the onboarding process and profile management.
 */
export default function VerificationPendingFix() {
  const [status, setStatus] = useState<'checking' | 'fixing' | 'fixed' | 'failed'>('checking');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      redirect('/auth/login');
    }

    const checkAndFixRPC = async () => {
      try {
        // First check if the function exists by trying to call it
        const { data, error } = await supabaseClient
          .rpc('get_user_organizations_safe', { user_uuid: user.id });

        if (error && error.message.includes('function') && error.message.includes('does not exist')) {
          // Function is missing, go to fix page
          setStatus('fixing');
          
          // Attempt to fix it
          const fixResponse = await fetch('/api/admin/fix-rpc');
          if (!fixResponse.ok) {
            throw new Error('Failed to fix the RPC function');
          }
          
          // Check if it works now
          const retryCheck = await supabaseClient
            .rpc('get_user_organizations_safe', { user_uuid: user.id });
          
          if (retryCheck.error && retryCheck.error.message.includes('function') && 
              retryCheck.error.message.includes('does not exist')) {
            throw new Error('RPC function still not available after fix attempt');
          }
          
          setStatus('fixed');
        } else {
          // Function exists or there was some other error
          setStatus('fixed');
        }
      } catch (e) {
        console.error('Error checking or fixing RPC function:', e);
        setStatus('failed');
        setError(e instanceof Error ? e.message : 'Unknown error occurred');
      }
    };

    checkAndFixRPC();
  }, [user]);

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return (
          <>
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4 animate-pulse" />
            <CardTitle className="text-2xl">Checking System</CardTitle>
            <CardDescription>
              We're checking if your account is properly set up...
            </CardDescription>
          </>
        );
      case 'fixing':
        return (
          <>
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4 animate-pulse" />
            <CardTitle className="text-2xl">Applying Fix</CardTitle>
            <CardDescription>
              We're applying a fix to your account setup. This will only take a moment...
            </CardDescription>
          </>
        );
      case 'fixed':
        return (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <CardTitle className="text-2xl">System Fixed!</CardTitle>
            <CardDescription>
              Your account setup has been fixed. You can now continue with the verification process.
            </CardDescription>
          </>
        );
      case 'failed':
        return (
          <>
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-2xl">Fix Failed</CardTitle>
            <CardDescription>
              We encountered a problem while fixing your account setup.
              Please try again or contact support if the issue persists.
            </CardDescription>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="items-center text-center">
            {renderContent()}
          </CardHeader>
          
          <CardContent className="text-center">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {status === 'fixed' && (
              <Button
                onClick={() => window.location.href = '/auth/verification-pending'}
                className="w-full"
              >
                Continue to Verification
              </Button>
            )}
            
            {status === 'failed' && (
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
            )}
            
            <div className="w-full mt-4 pt-4 border-t text-center text-sm">
              <Link href="/auth/login" className="text-primary hover:underline inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
