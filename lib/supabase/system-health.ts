'use client';

import { supabaseClient } from './auth-client';

/**
 * Check if the get_user_organizations_safe RPC function exists
 * and create a fallback if it doesn't
 * 
 * @returns True if the function exists or was created, false otherwise
 */
export async function checkOrFixRpcFunction(userId: string): Promise<boolean> {
  try {
    // Try to call the function to check if it exists
    const { data, error } = await (supabaseClient as any)
      .rpc('get_user_organizations_safe', { user_uuid: userId });
      
    if (error && error.message && 
        (error.message.includes('function') && error.message.includes('does not exist'))) {
      // Function doesn't exist, try to get data through our fallback API
      try {
        const response = await fetch('/api/organizations/user-organizations');
        if (response.ok) {
          // Our fallback API works
          return true;
        }
        
        // Fallback API doesn't work, try to create the function
        const fixResponse = await fetch('/api/admin/fix-rpc');
        return fixResponse.ok;
      } catch (apiError) {
        console.error('Failed to use fallback API or fix RPC:', apiError);
        return false;
      }
    }
    
    // Function exists or there was a different error
    return !error || !error.message.includes('function');
  } catch (e) {
    console.error('Error checking RPC function:', e);
    return false;
  }
}

/**
 * Comprehensive check for system issues
 */
export async function checkSystemHealth(): Promise<{
  status: 'healthy' | 'issues' | 'error';
  issues: Array<{
    type: string;
    details: string;
    severity: 'low' | 'medium' | 'high';
    fixable: boolean;
  }>;
}> {
  const issues: Array<{
    type: string;
    details: string;
    severity: 'low' | 'medium' | 'high';
    fixable: boolean;
  }> = [];
  
  try {
    // Check RPC function
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (sessionData.session?.user) {
      try {
        const { error: rpcError } = await (supabaseClient as any)
          .rpc('get_user_organizations_safe', { user_uuid: sessionData.session.user.id });
        
        if (rpcError && rpcError.message && 
            (rpcError.message.includes('function') && rpcError.message.includes('does not exist'))) {
          issues.push({
            type: 'missing_rpc',
            details: 'The get_user_organizations_safe RPC function is missing',
            severity: 'high',
            fixable: true
          });
        }
      } catch (e) {
        issues.push({
          type: 'rpc_error',
          details: e instanceof Error ? e.message : 'Unknown error checking RPC function',
          severity: 'medium', 
          fixable: false
        });
      }
    }

    // If we found any issues, return status as issues
    if (issues.length > 0) {
      return { status: 'issues', issues };
    }
    
    // No issues found
    return { status: 'healthy', issues: [] };
  } catch (error) {
    console.error('Error checking system health:', error);
    
    issues.push({
      type: 'system_check_error',
      details: error instanceof Error ? error.message : 'Unknown error during system check',
      severity: 'medium',
      fixable: false
    });
    
    return { status: 'error', issues };
  }
}

/**
 * Fix a specific system issue
 */
export async function fixSystemIssue(issueType: string): Promise<{
  fixed: boolean;
  message: string;
}> {
  try {
    switch (issueType) {
      case 'missing_rpc':
        const response = await fetch('/api/admin/fix-rpc');
        if (!response.ok) {
          const data = await response.json();
          return { 
            fixed: false, 
            message: data.error || 'Failed to create RPC function'
          };
        }
        return { 
          fixed: true, 
          message: 'Successfully created missing RPC function'
        };
      
      default:
        return {
          fixed: false,
          message: `Don't know how to fix issue type: ${issueType}`
        };
    }
  } catch (error) {
    return {
      fixed: false,
      message: error instanceof Error ? error.message : 'Unknown error during fix'
    };
  }
}
