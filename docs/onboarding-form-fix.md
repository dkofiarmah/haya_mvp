# Onboarding Form Error Fix

This document explains the fix for the `ReferenceError: orgUserData is not defined` error that occurred in the onboarding form submission process.

## Problem

The error occurred in the `handleSubmit` function of the onboarding-form.tsx file. The issue was related to accessing organization data using conditionally defined variables, which could be undefined in certain code paths.

Specifically:
- The original code tried to access `orgUserData` even when it wasn't defined in certain code paths
- The RPC function `get_user_organizations_safe` might return data in a structure different than expected
- Missing fallback strategies when the initial methods failed

## Solution

The fix implements a robust, multi-method approach to retrieve the organization ID:

### 1. Direct Query (Primary Method)
First, we directly query the `organization_users` table, which is the most reliable method when permissions are set correctly:

```typescript
const { data: orgUserData, error: orgUserError } = await supabaseClient
  .from('organization_users')
  .select('organization_id')
  .eq('user_id', user.id)
  .single();
```

### 2. RPC Function (Fallback Method)
If the direct query fails, we try the RPC function which bypasses RLS policies:

```typescript
const { data, error } = await supabaseClient
  .rpc('get_user_organizations_safe', { user_uuid: user.id });
```

We added extra logic to handle various possible response structures from this function.

### 3. User Profile (Last Resort)
If both methods above fail, we check the user profile for the last active organization:

```typescript
const { data: profileData, error: profileError } = await supabaseClient
  .from('user_profiles')
  .select('last_active_organization')
  .eq('id', user.id)
  .single();
```

### 4. Verification
After retrieving an organization ID through any method, we verify that it exists and is accessible:

```typescript
const { data: orgData, error: orgError } = await supabaseClient
  .from('organizations')
  .select('id, name')
  .eq('id', organizationId)
  .single();
```

## RPC Function

We also improved the `get_user_organizations_safe` function to return more useful data:

```sql
CREATE OR REPLACE FUNCTION get_user_organizations_safe(user_uuid UUID)
RETURNS TABLE (
  organization_id UUID,
  role TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ou.organization_id, ou.role
  FROM organization_users ou
  WHERE ou.user_id = user_uuid;
END;
$$;
```

This function has SECURITY DEFINER permission, allowing it to bypass RLS policies when retrieving organization data.

## Benefits of This Fix

1. **Robustness**: Multiple fallback strategies ensure that the function works in various scenarios
2. **Better Error Handling**: Detailed error logging helps identify the specific failure point
3. **Type Safety**: Properly checking existence of properties before accessing them
4. **Maintainability**: Clear, step-by-step approach that's easy to understand and modify
