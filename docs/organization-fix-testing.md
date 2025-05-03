# Testing Procedure for Organization Fixes

This document outlines steps to verify the fixes to the organization permission system.

## Prerequisites

- Access to the development environment
- A test user account
- Access to the database (to verify policies)

## Test 1: Verify Database Policies

```sql
-- Check if policies are correctly set up
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM
    pg_policies
WHERE
    tablename = 'organization_users'
ORDER BY
    policyname;
```

Expected result: Four policies should exist:
- `admins_manage_members`
- `service_role_bypass`
- `users_manage_self`
- `view_organization_users`

## Test 2: Verify Database Functions

```sql
-- Verify function definitions
SELECT proname, prosecdef FROM pg_proc 
WHERE proname IN (
  'get_user_organizations_safe', 
  'service_set_organization_user',
  'service_create_organization',
  'service_update_organization'
);
```

Expected result: All functions should be listed and have `prosecdef = true` (meaning SECURITY DEFINER).

## Test 3: New User Onboarding Flow

1. Register a new user account
2. Complete the onboarding form with company details
3. Submit the form
4. Verify redirection to the dashboard
5. Check localStorage for `organization_id` and `onboarding_completed`

Expected result: No errors, successful submission and redirection.

## Test 4: Existing User Organization Access

1. Log in with an existing user account
2. Navigate to the dashboard
3. Visit organization settings
4. Make changes and save

Expected result: Changes save successfully.

## Test 5: Direct Database Verification

After completing onboarding with a new user:

```sql
-- Check organization creation
SELECT id, name, contact_email FROM organizations ORDER BY created_at DESC LIMIT 1;

-- Check user link to organization
SELECT user_id, organization_id, role
FROM organization_users
WHERE user_id = '[TEST_USER_ID]';

-- Check user profile update
SELECT onboarding_completed, last_active_organization
FROM user_profiles
WHERE id = '[TEST_USER_ID]';
```

Expected result: All records should exist and match the submitted data.

## Test 6: Service Role Function Test

Using the service role connection:

```sql
-- Test creating an organization
SELECT service_create_organization(
  'Test Service Org', 
  'test@example.com',
  '[TEST_USER_ID]'::uuid
);

-- Test updating an organization
SELECT service_update_organization(
  '[ORG_ID]'::uuid, 
  'Updated Org Name'
);
```

Expected result: Functions execute without errors and changes are reflected in the database.

## Troubleshooting

If tests fail:
1. Check server logs for detailed error messages
2. Examine policy definitions for potential recursion issues
3. Verify that all functions have SECURITY DEFINER privilege
4. Ensure service role has appropriate permissions
5. Look for errors in browser console during form submission
