import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fixRlsPolicy } from '@/lib/supabase/rls-fix';
import { AlertCircle, Bug } from 'lucide-react';

export interface ErrorDiagnosticProps {
  error: Error | string;
  onRetry?: () => void; 
  onReset?: () => void;
}

export function ErrorDiagnostic({ error, onRetry, onReset }: ErrorDiagnosticProps) {
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixAttempted, setFixAttempted] = useState<boolean>(false);
  const [fixResult, setFixResult] = useState<{ success: boolean; message?: string } | null>(null);
  
  const errorMessage = error instanceof Error ? error.message : error;
  
  // Determine if this is likely a permission/RLS error
  const isPermissionError = 
    errorMessage.includes('violates row-level security policy') || 
    errorMessage.includes('permission denied') ||
    errorMessage.includes('42501') || // PostgreSQL permission denied error code
    errorMessage.includes('RLS');
  
  const handleFixPermissions = async () => {
    setIsFixing(true);
    
    try {
      const result = await fixRlsPolicy();
      setFixResult({
        success: result,
        message: result 
          ? 'Database permissions have been updated. Please try again.' 
          : 'Could not fix permissions automatically. Please contact support.'
      });
    } catch (error) {
      setFixResult({
        success: false,
        message: 'An error occurred while trying to fix permissions.'
      });
    } finally {
      setIsFixing(false);
      setFixAttempted(true);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Registration Error</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTitle className="font-semibold">
            {isPermissionError ? 'Database Permission Error' : 'Sign Up Failed'}
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm">
            {errorMessage}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-3">
          {isPermissionError && !fixAttempted && (
            <Button 
              onClick={handleFixPermissions}
              disabled={isFixing}
              variant="outline"
              className="w-full"
            >
              {isFixing ? 'Fixing Database Permissions...' : 'Fix Database Permissions'}
            </Button>
          )}
          
          {fixResult && (
            <Alert variant={fixResult.success ? "default" : "destructive"} className="mb-4">
              <AlertDescription>
                {fixResult.message}
              </AlertDescription>
            </Alert>
          )}
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              disabled={isFixing || (isPermissionError && !fixAttempted)}
              className="w-full"
            >
              Try Again
            </Button>
          )}
          
          {onReset && (
            <Button 
              onClick={onReset}
              disabled={isFixing}
              variant="ghost"
              className="w-full"
            >
              Reset Form
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
