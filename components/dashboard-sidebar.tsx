"use client"

import React from "react"
import Link from "next/link"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Globe,
  Building,
  Users,
  Map,
  CalendarCheck,
  MessageCircle,
  CreditCard,
  BarChart2,
  Bot,
  Phone,
  Settings,
  LogOut,
  MenuIcon,
  User,
} from "lucide-react"
import { useOrganization } from "@/lib/organizations"

interface DashboardSidebarProps {
  pathname: string
  closeSidebar?: () => void
}

export function DashboardSidebar({ pathname, closeSidebar }: DashboardSidebarProps) {
  const { signOut, user } = useAuth()
  const { currentOrganization } = useOrganization()

  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-blue-500",
    },
    {
      label: "Experiences",
      icon: Globe,
      href: "/experiences",
      color: "text-amber-500",
      description: "Manage your destinations and activities"
    },
    {
      label: "Accommodations",
      icon: Building,
      href: "/accommodations",
      color: "text-purple-500",
      description: "Lodges, hotels, and camps"
    },
    {
      label: "Customers",
      icon: Users,
      href: "/customers",
      color: "text-pink-500",
      description: "Customer profiles and preferences"
    },
    {
      label: "Tours & Itineraries",
      icon: Map,
      href: "/itineraries",
      color: "text-emerald-500",
      description: "Create and manage travel plans"
    },
    {
      label: "Bookings",
      icon: CalendarCheck,
      href: "/bookings",
      color: "text-orange-500",
      description: "Manage tour reservations"
    },
    {
      label: "Messaging Hub",
      icon: MessageCircle,
      href: "/messages",
      color: "text-blue-500",
      description: "WhatsApp, email, and social channels"
    },
    {
      label: "Payments",
      icon: CreditCard,
      href: "/payments",
      color: "text-green-500",
      description: "Invoices and transactions"
    },
    {
      label: "Reports",
      icon: BarChart2,
      href: "/reports",
      color: "text-indigo-500",
      description: "Business insights and KPIs"
    },
  ]

  const aiRoutes = [
    {
      label: "AI Assistants",
      icon: Bot,
      href: "/ai-assistants",
      color: "text-violet-500",
      description: "Configure your intelligent agents"
    },
    {
      label: "Knowledge Base",
      icon: Globe,
      href: "/knowledge-base",
      color: "text-amber-500",
      description: "AI training materials"
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img 
            src="/haya-logo.svg" 
            alt="HAYA" 
            className="h-8 w-8" 
          />
          <h1 className="text-xl font-bold">HAYA</h1>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-4">
          <div className="mb-2">
            <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              Core Business
            </h2>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={closeSidebar}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50 hover:text-foreground",
                  pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground"
                )}
              >
                <route.icon className={cn("h-4 w-4", route.color)} />
                {route.label}
              </Link>
            ))}
          </div>

          <div className="mb-2 mt-6">
            <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              AI Tools
            </h2>
            {aiRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={closeSidebar}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50 hover:text-foreground",
                  pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground"
                )}
              >
                <route.icon className={cn("h-4 w-4", route.color)} />
                {route.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* User menu - Redesigned */}
      <div className="mt-auto border-t p-4">
        <div className="relative">
          {/* Organization and User info */}
          <UserProfileMenu user={user} organization={currentOrganization} signOut={signOut} />
        </div>
      </div>
    </div>
  )
}

function UserProfileMenu({ user, organization, signOut }: { user: any; organization: any; signOut: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isOpen && !(e.target as Element).closest('.user-menu-container')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="user-menu-container relative">
      <div 
        className={`flex items-center gap-3 p-3 rounded-md ${isOpen ? 'bg-muted' : 'hover:bg-muted/50'} cursor-pointer transition-colors duration-150`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        role="button"
        tabIndex={0}
      >
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex flex-col overflow-hidden flex-1">
          <span className="font-semibold text-xs text-primary truncate">
            {organization?.name || 'Loading...'}
          </span>
          <span className="font-medium text-sm truncate">
            {user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'User')}
          </span>
          <span className="text-xs text-muted-foreground">Tour Operator</span>
        </div>
        <div className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Enhanced dropdown menu with solid background color */}
      {isOpen && (
        <div className="absolute bottom-full mb-1 left-0 right-0 bg-white dark:bg-gray-900 border rounded-md shadow-lg p-1.5 z-50 animate-in fade-in duration-100">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Profile Settings
          </Link>
          <Link
            href="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <User className="h-4 w-4" />
            My Account
          </Link>
          <div className="border-t my-1"></div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2.5 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors duration-150 text-destructive group"
          >
            <LogOut className="h-4 w-4 group-hover:animate-pulse" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}