# Organization Permission System Fix (Updated)

## Problem Summary

Users were encountering 500 Internal Server Errors during onboarding form submission with the error message "infinite recursion detected in policy for relation 'organization_users'". This was due to Row Level Security (RLS) policies causing a circular dependency and the onboarding form incorrectly trying to create new organizations even though one was already created during signup.

## Root Cause

The core issues were:

1. **Recursive RLS Policies**: The row security policies on the `organization_users` table were referencing themselves:
   - The policy would check if a user had access to an organization
   - To do this check, it would query the `organization_users` table
   - This query would trigger the same policy, creating an infinite loop

2. **Duplicate Organization Creation**: The onboarding form was trying to create new organizations instead of using the one created during the signup process.

## Solutions Implemented

### 1. Fixed Row Level Security Policies

- Dropped all problematic policies on `organization_users` table:
  - `view_organization_users`
  - `manage_organization_users`
  - `users_manage_self`
  - `users_view_org_members`
  - `admins_manage_members`

- Created new non-recursive policies that use a safe function approach:
  - `view_organization_users`: Allows users to view organization members using the safe function
  - `users_manage_self`: Allows users to manage their own organization user records
  - `admins_manage_members`: Allows admins/owners to manage all members in their organization
  - `service_role_bypass`: Allows service role to bypass all restrictions

### 2. Created Security Definer Functions

Created functions that execute with the privileges of the function creator, not the caller:

- `get_user_organizations_safe`: Returns organizations a user belongs to without triggering RLS
- `get_organization_for_user`: Directly retrieves a user's organization ID via user_profiles or organization_users
- `service_set_organization_user`: Safely links users to organizations
- `service_create_organization`: Creates organizations with proper permissions
- `service_update_organization`: Updates organization details safely

### 3. Simplified Organization Lookup and Onboarding Form Logic

- Created a dedicated helper function:
  ```typescript
  export async function getUserOrganizationId(user: User): Promise<string | null> {
    // First check localStorage for organization ID from signup
    // Then use the secure get_organization_for_user database function
  }
  ```

- Replaced complex organization retrieval with simpler logic:
  1. Use localStorage data from signup if available
  2. Call `get_organization_for_user` RPC function if needed
  3. No more creation of redundant organizations

- Streamlined form submission process:
  1. Use the improved `getUserOrganizationId` helper to find existing organization
  2. Submit form data through a dedicated function that updates everything in one place
  3. Properly update user profile and clean up localStorage data

## Security Considerations

- All service functions have been created with `SECURITY DEFINER` to avoid RLS loops
- The `service_role_bypass` policy provides essential administrative access
- Permission checks are built into the service functions for additional safety

## Future Improvements

1. Create additional service functions for other organization operations
2. Add more comprehensive error handling and logging
3. Implement retry mechanisms for failed operations
4. Consider using cached organization IDs more extensively to reduce database queries
5. Add transaction support to ensure all related operations complete together
6. Clean up localStorage data once onboarding is complete to prevent stale data

## Testing Notes

To test the fixed implementation:

1. Create a new user through the `/register` page
2. Complete the onboarding form
3. Verify that no organization creation errors occur
4. Check that the organization settings are saved correctly
5. Verify the user profile is marked as having completed onboarding

## Notes for Developers

When modifying RLS policies or working with organization permissions:

- Always consider potential recursion issues in policy definitions
- Prefer using `SECURITY DEFINER` functions for critical operations
- Test with both standard users and service role access
- Always use the `getUserOrganizationId` helper function to find organizations
- Never create new organizations in the onboarding form - organizations should only be created during signup
- Implement graceful fallbacks for permission-related failures

## Key Files

- `/lib/get-user-organization.ts`: Helper function for finding user organizations
- `/components/onboarding/onboarding-form-submit.ts`: Centralized form submission logic
- `/create-get-organization-function.sql`: Database function for direct organization lookup
- `/fix-organization-users-policies-final.sql`: Fixed RLS policies
- `/create-service-functions.sql`: Service functions for organization management
- `/add-service-role-bypass-policy.sql`: Additional bypass policy for user_profiles
