"use client"

import Link from 'next/link'

export default function AuthLandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Auth System Redesign</h1>
          <p className="text-gray-600 mb-8">
            This page will be replaced with the new authentication system design. 
            The previous login, registration, and onboarding flows have been removed.
          </p>
          
          <div className="grid gap-4">
            <Link 
              href="/auth/login" 
              className="block w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-center"
            >
              Login Placeholder
            </Link>
            
            <Link 
              href="/auth/signup" 
              className="block w-full py-2 px-4 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors text-center"
            >
              Register Placeholder
            </Link>
            
            <Link 
              href="/setup" 
              className="block w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              Onboarding Placeholder
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-3">Design Requirements</h2>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li>• Create a unified authentication experience</li>
              <li>• Simplify onboarding to essential information only</li>
              <li>• Improve form validation and error handling</li>
              <li>• Add better progress tracking and state management</li>
              <li>• Ensure mobile responsiveness throughout the flow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
