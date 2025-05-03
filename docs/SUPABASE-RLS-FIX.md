# Supabase RLS Policy Fix

This document explains the fixes applied to address the PostgreSQL RLS (Row Level Security) policy issues that were causing 500 errors in the application.

## Issues Fixed

### 1. Infinite Recursion in Organization Users Policy

**Problem**: The RLS policy for the `organization_users` table was causing an infinite recursion error because it was self-referencing. 

Error message:
```
infinite recursion detected in policy for relation "organization_users"
```

**Solution**: Fixed the `admins_manage_members` policy to remove the circular reference by correctly referencing the organization ID in the policy.

```sql
-- Original problematic policy (simplified):
-- The organization_users_1.organization_id = organization_users_1.organization_id reference was causing recursion

-- Fixed policy:
CREATE POLICY admins_manage_members ON organization_users 
FOR ALL 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM organization_users ou
    WHERE ou.user_id = auth.uid() 
    AND ou.organization_id = organization_users.organization_id
    AND ou.role IN ('owner', 'admin')
  )
);
```

### 2. Missing RPC Function

**Problem**: The code was referencing a function called `get_user_organizations_safe` which didn't exist.

**Solution**: Created the missing function which provides a safe way to fetch user organizations without triggering RLS recursion.

```sql
CREATE OR REPLACE FUNCTION get_user_organizations_safe(user_uuid UUID)
RETURNS TABLE (
  organization_id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use the security definer privilege to access the table directly
  -- without triggering RLS recursion
  RETURN QUERY
  SELECT ou.organization_id 
  FROM organization_users ou
  WHERE ou.user_id = user_uuid;
END;
$$;
```

### 3. WebCrypto API Warning

**Warning**: `WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.`

**Explanation**: This warning comes from the Supabase auth library. It's indicating that the browser or environment doesn't support the WebCrypto API, causing the PKCE (Proof Key for Code Exchange) security enhancement to fall back to a less secure method.

This warning doesn't affect functionality but indicates slightly reduced security for the auth flow. This is commonly seen in development environments and older browsers.

## Additional Notes

- If you still encounter 500 errors after these fixes, you might need to check other RLS policies for similar recursion issues.
- Make sure to rebuild and restart your application after applying these fixes.

## Applying These Fixes in Production

For production environments:

1. Connect to your Supabase PostgreSQL instance
2. Apply the same SQL fixes (`fix-organization-users-policy.sql` and `create-safe-function.sql`)
3. Restart your application servers

For Supabase hosted instances, you can apply these through the SQL Editor in the Supabase Dashboard.
