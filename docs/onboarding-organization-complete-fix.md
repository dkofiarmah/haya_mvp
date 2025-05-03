# Onboarding Organization Fix

## Problem
Users were encountering 500 Internal Server Errors and 403 Forbidden errors during the onboarding process because:

1. The onboarding form was incorrectly trying to create a new organization when one was already created during signup
2. The organization created during signup was stored in `localStorage` using the key `newUserInfo`, but the onboarding form was looking for it under `newOrgInfo`
3. Row Level Security (RLS) policies on the `organization_users` table had recursive dependencies causing infinite recursion
4. Policies on the `organizations` table were inconsistent and not allowing proper access

## Solution

### Database Policy Fixes

1. **Fixed organization_users policies:**
   - Dropped problematic policies causing infinite recursion
   - Created `get_user_organizations_safe` function with `SECURITY DEFINER` to avoid RLS loops
   - Implemented clear non-recursive policies

2. **Fixed organizations policies:**
   - Dropped confusing policies that were inconsistently formatted
   - Created clear insert/select/update policies using the safe helper function
   - Added a service role bypass policy

### Organization Retrieval Logic

Fixed the `getExistingOrganization` helper function to:
1. Properly check `newUserInfo` localStorage data which contains `organizationId` from signup
2. Also check the old `newOrgInfo` key as a fallback
3. Try user_profiles for `last_active_organization` as a secondary option
4. Use the secure RPC function `get_user_organizations_safe` to find user's organizations
5. Use direct query as a last resort
6. Only create a new organization if no existing one is found

### Form Pre-population

Updated the `OnboardingForm` component to correctly check both localStorage keys:
1. First load any saved onboarding data
2. Then check `newOrgInfo` and `newUserInfo` formats to pre-populate the form
3. Use the company name from whichever format is available

## Testing Notes

When testing the fix, observe that:
1. New users should seamlessly transition from signup to onboarding
2. The onboarding form should be pre-populated with company name from signup
3. No 500 errors about infinite recursion should occur
4. No 403 Forbidden errors should happen when trying to access organization data
5. After completing onboarding, users should remain in the same organization created during signup

## Implementation Details

### Key Files Modified
- `/lib/get-existing-organization.ts` - Helper function to safely find existing organizations
- `/components/onboarding/onboarding-form.tsx` - Form initialization and submission logic
- SQL policy files for the database

### Key Data Flow
1. Signup creates organization and stores `organizationId` in `newUserInfo`
2. Onboarding retrieves this ID using `getExistingOrganization`
3. Onboarding form updates the existing organization rather than creating a new one
4. User profile is updated with `last_active_organization` pointing to the same organization
