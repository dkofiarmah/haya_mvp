# Fix for User Profile API Issues

This README explains how to fix the 400 Bad Request errors when accessing user profiles and the security warnings about using `getSession()`.

## Issues Fixed

1. **400 Bad Request Error for User Profiles API**
   - Error: `127.0.0.1:54321/rest/v1/user_profiles?id=eq.48770b2d-ae82-4dd2-8868-c1903f89fe89`
   - Cause: Improper authentication or Row-Level Security (RLS) policy issues

2. **Security Warning for `getSession()`**
   - Warning: `Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure!`
   - Cause: Using potentially insecure client-side storage

## Solutions Implemented

### 1. Fixed Security Warning in `experiences.ts`
- Replaced `supabase.auth.getSession()` with `supabase.auth.getUser()`
- This change authenticates data by contacting the Supabase Auth server rather than relying on client-side storage

### 2. Added RLS Policy Fix for User Profiles
- Created a new SQL script `fix-user-profiles-api-access.sql`
- This updates the RLS policies to properly handle API requests to the user_profiles table

### 3. Created Proper User Profile Utilities
- Added `lib/user-profile.ts` with secure methods to fetch user profiles
- Created `hooks/use-user-profile.ts` for client components to safely access profiles
- Added a server API route `/app/api/user/profile/route.ts` for secure server-side profile operations

## How to Apply the Fixes

1. **Update Auth in Server Actions**
   - The code in `experiences.ts` has already been updated to use `getUser()`
   - Apply similar changes in any other server actions using `getSession()`

2. **Update Database RLS Policies**
   - Run the SQL in `fix-user-profiles-api-access.sql` against your Supabase database
   - This can be done through the SQL Editor in the Supabase Dashboard

3. **Use the New User Profile Utilities**
   - Replace direct API calls to user_profiles with the new utilities
   - Client components should use `useUserProfile()` hook
   - Server components should import functions from `lib/user-profile.ts`
   - API routes can be accessed at `/api/user/profile`

## Testing the Fixes

After applying these changes, test your application to ensure:
1. You can access user profile data without 400 errors
2. The warning about `getSession()` no longer appears
3. All authentication flows continue to work properly

If you encounter any issues, check the browser console and server logs for error details.
