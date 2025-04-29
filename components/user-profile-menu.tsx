"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Settings, User, LogOut, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UserProfileMenuProps {
  user: any
  organization: any
  signOut: () => void
  closeSidebar?: () => void
}

export function UserProfileMenu({ user, organization, signOut, closeSidebar }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      {/* User info and toggle button */}
      <div 
        className={cn(
          "flex items-center gap-3 rounded-md p-3 cursor-pointer transition-colors duration-150",
          isOpen ? "bg-muted" : "hover:bg-muted/50"
        )}
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
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {/* Menu popup - positioned above the trigger instead of below */}
      {isOpen && (
        <div className="absolute bottom-full mb-1 left-0 right-0 bg-card rounded-md border shadow-lg p-1 z-50 transform-gpu animate-in fade-in-50 slide-in-from-bottom-2 duration-100">
          <Link
            href="/profile"
            onClick={() => {
              setIsOpen(false)
              closeSidebar?.()
            }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Profile Settings
          </Link>
          <Link
            href="/account"
            onClick={() => {
              setIsOpen(false)
              closeSidebar?.()
            }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <User className="h-4 w-4" />
            My Account
          </Link>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
