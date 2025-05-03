'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorDiagnosticInfo {
  error?: string;
  errorType?: string;
  details?: string;
  help?: string;
}

export default function DiagnosticHelperPage() {
  const [diagnosticInfo, setDiagnosticInfo] = useState<ErrorDiagnosticInfo>({});
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSystemStatus() {
      try {
        // Get error information from the URL if available
        const params = new URLSearchParams(window.location.search);
        const errorType = params.get('error');
        const details = params.get('details');
        
        if (errorType) {
          setDiagnosticInfo({
            errorType,
            details: details || undefined,
          });
        } else {
          // If no specific error is provided, check for common issues
          await checkForCommonIssues();
        }
      } catch (error) {
        console.error('Error during diagnostic check:', error);
        setDiagnosticInfo({
          error: 'Failed to run system diagnostics',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setLoading(false);
      }
    }
    
    checkSystemStatus();
  }, []);

  async function checkForCommonIssues() {
    // Check RPC function
    try {
      const response = await fetch('/api/organizations/user-organizations');
      if (!response.ok) {
        setDiagnosticInfo({
          errorType: 'api_error',
          details: 'API endpoint for organizations is not responding correctly',
          help: 'This can be fixed by applying the database fix automatically.',
        });
        return;
      }
    } catch (error) {
      setDiagnosticInfo({
        errorType: 'connection_error',
        details: 'Could not connect to the API',
        help: 'Please check your internet connection and try again.',
      });
      return;
    }
    
    // Everything seems OK
    setDiagnosticInfo({
      errorType: 'no_issues',
      details: 'No issues detected with the system',
    });
  }

  async function applyFix() {
    setFixing(true);
    try {
      const response = await fetch('/api/admin/fix-rpc');
      if (response.ok) {
        // Successfully fixed
        setDiagnosticInfo(prev => ({
          ...prev,
          errorType: 'fixed',
          help: 'The system has been successfully fixed. You can now continue.'
        }));
      } else {
        const data = await response.json();
        setDiagnosticInfo(prev => ({
          ...prev,
          errorType: 'fix_failed',
          help: data.error || 'Failed to apply the fix. Please contact support.'
        }));
      }
    } catch (error) {
      setDiagnosticInfo(prev => ({
        ...prev,
        errorType: 'fix_error',
        details: error instanceof Error ? error.message : 'Unknown error during fix',
        help: 'Please try again or contact support if the issue persists.'
      }));
    } finally {
      setFixing(false);
    }
  }

  function renderDiagnosticResults() {
    switch (diagnosticInfo.errorType) {
      case 'null_organization_id':
        return (
          <>
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <CardTitle className="text-2xl">Organization ID Issue</CardTitle>
            <CardDescription>
              We detected an issue with organization ID assignment when creating experiences.
            </CardDescription>
            <div className="mt-4 bg-muted p-4 rounded-md text-sm">
              <p className="font-medium">Technical details:</p>
              <p className="mt-1">{diagnosticInfo.details || 'null organization_id constraint violation'}</p>
            </div>
          </>
        );
      
      case 'api_error':
        return (
          <>
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <CardTitle className="text-2xl">API Function Missing</CardTitle>
            <CardDescription>
              We detected an issue with one of the required API functions.
            </CardDescription>
            <div className="mt-4 bg-muted p-4 rounded-md text-sm">
              <p className="font-medium">Technical details:</p>
              <p className="mt-1">{diagnosticInfo.details || 'Missing RPC function'}</p>
              {diagnosticInfo.help && <p className="mt-2 text-blue-600">{diagnosticInfo.help}</p>}
            </div>
          </>
        );
      
      case 'fixed':
        return (
          <>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">System Fixed!</CardTitle>
            <CardDescription>
              The issue has been successfully resolved. You can now continue using the app.
            </CardDescription>
          </>
        );
      
      case 'fix_failed':
      case 'fix_error':
        return (
          <>
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-2xl">Fix Failed</CardTitle>
            <CardDescription>
              We couldn't automatically fix the issue.
            </CardDescription>
            <div className="mt-4 bg-red-50 p-4 rounded-md text-sm text-red-700">
              <p className="font-medium">Error details:</p>
              <p className="mt-1">{diagnosticInfo.details || 'Unknown error during fix'}</p>
              {diagnosticInfo.help && <p className="mt-2">{diagnosticInfo.help}</p>}
            </div>
          </>
        );

      case 'no_issues':
        return (
          <>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">System Healthy</CardTitle>
            <CardDescription>
              No issues were detected with your system. Everything is working as expected.
            </CardDescription>
          </>
        );

      default:
        return (
          <>
            <AlertCircle className="h-12 w-12 text-blue-500 mb-4 animate-pulse" />
            <CardTitle className="text-2xl">Checking System</CardTitle>
            <CardDescription>
              We're checking your system for any issues...
            </CardDescription>
          </>
        );
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg animate-in fade-in zoom-in-95">
          <CardHeader className="items-center text-center">
            {loading ? (
              <>
                <AlertCircle className="h-12 w-12 text-blue-500 mb-4 animate-pulse" />
                <CardTitle className="text-2xl">Checking System</CardTitle>
                <CardDescription>
                  We're checking your system for any issues...
                </CardDescription>
              </>
            ) : renderDiagnosticResults()}
          </CardHeader>
          
          <CardContent className="text-center">
            {!loading && ['api_error', 'null_organization_id'].includes(diagnosticInfo.errorType || '') && (
              <Button
                onClick={applyFix}
                disabled={fixing || diagnosticInfo.errorType === 'fixed'}
                className="w-full"
              >
                {fixing ? 'Applying Fix...' : 'Apply Automatic Fix'}
              </Button>
            )}
            
            {!loading && (diagnosticInfo.errorType === 'fixed' || diagnosticInfo.errorType === 'no_issues') && (
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {!loading && ['fix_failed', 'fix_error'].includes(diagnosticInfo.errorType || '') && (
              <div className="mt-4">
                <Button onClick={applyFix} className="mr-2" variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.push('/dashboard')} variant="default">
                  Continue Anyway
                </Button>
              </div>
            )}
            
            <div className="w-full mt-8 pt-4 border-t text-center text-xs text-gray-500">
              <p>
                Having trouble? Contact support at help@haya.app
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
