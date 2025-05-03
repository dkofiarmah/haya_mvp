'use client';

import { useEffect, useState } from 'react';

export default function FixMissingRPCPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const runFix = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/admin/fix-rpc');
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Fix was applied successfully.');
      } else {
        setStatus('error');
        setMessage(data.error || 'An error occurred while applying the fix.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to apply fix: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  useEffect(() => {
    // Automatically run the fix when the page loads
    runFix();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Database Fix Utility</h1>
          <p className="mt-2 text-gray-600">
            This utility fixes the missing RPC function: get_user_organizations_safe
          </p>
        </div>

        <div className="mt-6">
          <div className={`p-4 rounded-md ${
            status === 'success' 
              ? 'bg-green-50 text-green-700' 
              : status === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            <p className="font-medium">
              {status === 'idle' && 'Ready to apply fix'}
              {status === 'loading' && 'Applying fix...'}
              {status === 'success' && 'Fix applied successfully'}
              {status === 'error' && 'Failed to apply fix'}
            </p>
            {message && <p className="mt-2 text-sm">{message}</p>}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={runFix}
              disabled={status === 'loading'}
              className={`px-4 py-2 rounded-md ${
                status === 'loading'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {status === 'loading' ? 'Applying...' : 'Apply Fix Again'}
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              <b>What this does:</b> Creates a missing SQL function in the database that's required
              by the application.
            </p>
            <p className="mt-2">
              <b>After fixing:</b> Return to the previous page and try your operation again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
