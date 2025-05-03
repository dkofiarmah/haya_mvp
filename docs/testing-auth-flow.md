# Testing the Authentication and Onboarding Flow

This document provides instructions for testing the complete authentication and onboarding flow in the Haya application.

## Overview

We've implemented a streamlined onboarding process that consists of three main steps:

1. Company Details
2. Service Offerings
3. AI Configuration

Each step collects essential information that's required for setting up a tour operator on the Haya platform.

## Test Utility

We've created a special test page that allows you to easily test the entire flow without having to manually create accounts repeatedly. Visit `/test-auth-flow` in your browser to access this utility.

## Testing Instructions

### 1. Registration

1. Go to `/test-auth-flow` in your browser
2. In the "Register" tab, you'll see a form pre-filled with test data
3. Note the auto-generated unique email address (important for login)
4. Click "Register" to create a new account
5. Upon successful registration, you'll see a success message and the email will be copied to the Login tab

### 2. Login

1. After registration, the test page will automatically switch to the "Login" tab
2. The email from your registration will be pre-filled
3. The default password is "Password123!"
4. Click "Login" to authenticate
5. Upon successful login, you'll be redirected to the onboarding flow

### 3. Onboarding

1. When first arriving at the onboarding page, you'll see a welcome dialog
2. Click "Get Started" to begin the onboarding process
3. Follow the three steps to complete your profile:
   - Company Details: Enter basic company information
   - Service Offerings: Select tour types, languages, and other service details
   - AI Configuration: Set up AI preferences and enable assistants
4. Review your information on the final page
5. Click "Complete Setup" to finish onboarding
6. You'll be redirected to the dashboard

### Alternative Flow: Skip Onboarding

To test skipping onboarding:

1. During any step of the onboarding process, click "Skip for now"
2. Confirm in the dialog that appears
3. You'll be redirected to the dashboard, but the onboarding will remain incomplete

## Data Storage

The onboarding flow stores data in multiple places:

1. **Database**: Your company profile, user account, and preferences are saved to Supabase
2. **Local Storage**: Progress is saved locally, allowing users to return later to complete their setup

## Troubleshooting

If you encounter issues during testing:

1. **Registration Errors**: Check if the email is already registered
2. **Login Issues**: Verify that you're using the exact email from registration
3. **Onboarding Problems**: Check the browser console for any error messages

## Testing from Regular Flow

You can also test the traditional flow by:

1. Going to `/register` to create a new account
2. Going to `/login` to sign in
3. Being redirected to `/onboarding-new` to complete your profile

## Notes for Developers

- The system handles both new users and returning users differently
- Registration automatically creates an organization for the user
- The onboarding flow checks for incomplete setup and directs users accordingly
- All CRUD operations use RLS policies to ensure proper access control
