'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { fixRlsPolicy, testUserProfilesPermissions } from '@/lib/supabase/rls-fix';
import { useRouter } from 'next/navigation';

export default function FixRlsIssuePage() {
  const [status, setStatus] = useState<'checking' | 'fixing' | 'fixed' | 'failed'>('checking');
  const [message, setMessage] = useState<string>('Checking database permissions...');
  const router = useRouter();
  
  const runTest = async () => {
    try {
      setStatus('checking');
      setMessage('Testing database permissions...');
      
      // First test if we can already create user profiles
      const permissionsOk = await testUserProfilesPermissions();
      
      if (permissionsOk) {
        setStatus('fixed');
        setMessage('Database permissions are already set correctly.');
        return;
      }
      
      // Permissions test failed, try to fix it
      setStatus('fixing');
      setMessage('Attempting to fix database permissions...');
      
      const fixed = await fixRlsPolicy();
      
      if (fixed) {
        // Test again to make sure the fix worked
        const retestOk = await testUserProfilesPermissions();
        if (retestOk) {
          setStatus('fixed');
          setMessage('Database permissions have been fixed successfully!');
        } else {
          setStatus('failed');
          setMessage('Failed to fix database permissions despite successful API call.');
        }
      } else {
        setStatus('failed');
        setMessage('Could not fix the database permissions issue.');
      }
    } catch (error) {
      console.error('Error during RLS fix process:', error);
      setStatus('failed');
      setMessage('An unexpected error occurred: ' + 
        (error instanceof Error ? error.message : String(error)));
    }
  };
  
  const tryRegistrationAgain = () => {
    router.push('/register');
  };
  
  // Run the test when the component mounts
  useState(() => {
    runTest();
  });
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="items-center text-center">
            {status === 'checking' && (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-amber-500 animate-pulse mb-4" />
                <CardTitle className="text-2xl">Checking System</CardTitle>
                <CardDescription>Verifying database permissions...</CardDescription>
              </div>
            )}
            
            {status === 'fixing' && (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
                <CardTitle className="text-2xl">Fixing Database</CardTitle>
                <CardDescription>Applying permission fixes...</CardDescription>
              </div>
            )}
            
            {status === 'fixed' && (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle className="text-2xl">System Fixed!</CardTitle>
                <CardDescription>Database permissions have been updated.</CardDescription>
              </div>
            )}
            
            {status === 'failed' && (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <CardTitle className="text-2xl">Fix Failed</CardTitle>
                <CardDescription>We couldn't automatically fix the database issue.</CardDescription>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="mb-6 text-sm">
              <p>{message}</p>
            </div>
            
            {status === 'failed' && (
              <Button
                onClick={runTest}
                className="w-full mb-4"
              >
                Try Again
              </Button>
            )}
            
            {status === 'fixed' && (
              <Button
                onClick={tryRegistrationAgain}
                className="w-full mb-4"
              >
                Try Registration Again
              </Button>
            )}
            
            <div className="mt-4 pt-4 border-t text-center text-sm">
              <Link href="/" className="text-primary hover:underline inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
