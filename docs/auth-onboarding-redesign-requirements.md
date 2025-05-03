# Authentication and Onboarding Redesign Requirements

## Overview
This document outlines the requirements for redesigning the authentication (login/registration) and onboarding processes for Haya, a B2B SaaS platform for tour operators.

## Current Issues
1. Onboarding process is too long (5 steps)
2. Too much information required upfront
3. User experience is not optimized for mobile
4. Authentication flows are not unified
5. Progress tracking is limited
6. No ability to skip and complete later

## Redesign Goals

### Authentication System
1. **Unified Experience**: Create a cohesive design system across all auth-related pages
2. **Simplified Forms**: Reduce fields to only essential information
3. **Improved Validation**: Clear error messages and real-time validation
4. **Social Authentication**: Add options for social login (Google, Apple)
5. **Security Features**: Implement 2FA and enhanced password policies
6. **Mobile Optimization**: Ensure perfect experience on all devices

### Onboarding Flow
1. **Reduced Steps**: Change from 5 steps to 3 steps
   - Company Details (essential company info)
   - Service Offerings (tour types, languages, group size)
   - AI Configuration (AI preferences and assistant selection)
   - Review (summary before completion)

2. **Skip Functionality**: Allow users to skip onboarding and complete later
   - Confirmation dialog when skipping
   - Clear CTA to resume incomplete onboarding

3. **Progress Saving**: Auto-save progress as users complete each step
   - Persist partial data in local storage
   - Sync with backend when complete

4. **Visual Progress**: Clear indicators showing progress through steps
   - Step navigation
   - Progress bar/indicators

## User Flows

### Registration Flow
1. User visits `/auth/signup`
2. Enters essential account information
3. Submits form and receives verification email
4. Clicks verification link in email
5. Redirected to `/auth/verify` confirmation page
6. Automatically redirected to `/setup` (onboarding)

### Login Flow
1. User visits `/auth/login`
2. Enters credentials and logs in
3. If onboarding incomplete, redirected to `/setup`
4. If onboarding complete, redirected to `/dashboard`

### Onboarding Flow
1. User arrives at `/setup` after registration/login
2. Sees welcome dialog with overview
3. Completes 3-step onboarding process
4. Reviews information before final submission
5. Redirected to dashboard upon completion

### Skip Flow
1. User clicks "Skip for now" during onboarding
2. Sees confirmation dialog explaining limitations
3. If confirmed, redirected to dashboard
4. Sees prompt to complete onboarding in dashboard/profile

## Technical Requirements

### Frontend
- React components for each auth page and onboarding step
- Form state management with validation
- Progress tracking and persistence
- Responsive design for all screen sizes

### Backend
- Updated API endpoints for authentication
- Simplified data models for user profiles
- Progress saving functionality
- Skip/resume capability

## Success Metrics
1. **Completion Rate**: % of users who complete onboarding
2. **Time to Complete**: Average time to complete onboarding
3. **Error Rate**: % of form submissions with errors
4. **Skip Rate**: % of users who skip onboarding

## Implementation Timeline
1. Design mockups and wireframes: 1 week
2. Authentication system implementation: 2 weeks
3. Onboarding flow implementation: 2 weeks
4. Testing and refinement: 1 week
5. Deployment: 1 day
