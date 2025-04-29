import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

export default function middleware(request: NextRequest) {
  // For root path or paths that start with (dashboard), redirect to the appropriate path
  const pathname = request.nextUrl.pathname
  
  if (pathname === '/' || pathname.startsWith('/(dashboard)')) {
    let newPath = pathname

    // Handle the root path - redirect to dashboard
    if (pathname === '/') {
      newPath = '/dashboard'
    } 
    // For paths that start with /(dashboard), remove the parentheses to avoid build issues
    else if (pathname.startsWith('/(dashboard)')) {
      newPath = pathname.replace('/(dashboard)', '/dashboard')
    }
    
    const newUrl = new URL(newPath, request.url)
    return NextResponse.redirect(newUrl)
  }
  
  return NextResponse.next()
}
