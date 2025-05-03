"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Mail, LogOut, Menu, X, User, Search, Bot, Compass, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { cn } from "@/lib/utils"
import * as React from "react"
import { AICopilot } from "@/components/ai-copilot"

export function TopNavigation() {
  const { user, signOut } = useAuth()
  const [unreadMessages] = useState<number>(3) // Replace with real data
  const [unreadNotifications] = useState<number>(2) // Replace with real data
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [isAICopilotOpen, setIsAICopilotOpen] = useState<boolean>(false)

  // Get user initials for avatar fallback
  const userInitials = user?.email 
    ? user.email.split('@')[0].substring(0, 2).toUpperCase() 
    : "HA";

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-background border-b">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between relative">
          {/* Empty div for balance - hidden on desktop */}
          <div className="w-10 md:hidden"></div>
          
          {/* Logo - centered on mobile, hidden on desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
            <Link href="/dashboard" className="flex items-center" aria-label="HAYA">
              <img 
                src="/haya-logo.svg" 
                alt="HAYA" 
                className="h-9 w-9" 
              />
            </Link>
          </div>
          
          {/* Mobile menu button - right side */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              style={{
                float: "right",
                position: "relative",
                right: "-300px"
              }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
            {/* Search (optional) */}
            <div className="relative w-60 mr-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 h-9"
              />
            </div>

            {/* AI Copilot Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setIsAICopilotOpen(true)}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Travel Assistant</span>
            </Button>

            {/* Messages Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Mail className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {/* Replace with real messages */}
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <p className="font-medium">New Booking Request</p>
                    <p className="text-xs text-muted-foreground">Safari Adventure Tour - 2 adults</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <p className="font-medium">Customer Question</p>
                    <p className="text-xs text-muted-foreground">About the Mountain Trek experience</p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/messages" className="w-full cursor-pointer">
                    View All Messages
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {/* Replace with real notifications */}
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <p className="font-medium">Payment Received</p>
                    <p className="text-xs text-muted-foreground">$500 received for Beach Tour</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <p className="font-medium">New Review</p>
                    <p className="text-xs text-muted-foreground">5-star review for City Walking Tour</p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View All Notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Empty div for spacing on the right side on mobile, creating balanced layout */}
          <div className="w-10 md:hidden"></div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-background border-t overflow-hidden transition-all duration-300 ease-in-out",
        mobileMenuOpen ? "max-h-96" : "max-h-0"
      )}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {/* Mobile Messages */}
            <Link 
              href="/messages" 
              className="flex flex-col items-center justify-center p-3 border rounded-md"
            >
              <div className="relative">
                <Mail className="h-6 w-6 mb-1" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </div>
              <span className="text-xs">Messages</span>
            </Link>
            
            {/* Mobile Notifications */}
            <Link 
              href="/notifications" 
              className="flex flex-col items-center justify-center p-3 border rounded-md"
            >
              <div className="relative">
                <Bell className="h-6 w-6 mb-1" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <span className="text-xs">Notifications</span>
            </Link>
            
            {/* Mobile AI Copilot */}
            <div
              className="flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer"
              onClick={() => setIsAICopilotOpen(true)}
            >
              <Sparkles className="h-6 w-6 mb-1 text-amber-500" />
              <span className="text-xs">Travel Assistant</span>
            </div>
            
            {/* Mobile Profile */}
            <Link 
              href="/profile" 
              className="flex flex-col items-center justify-center p-3 border rounded-md"
            >
              <Avatar className="h-6 w-6 mb-1">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="text-xs">Profile</span>
            </Link>
          </div>
          
          {/* Mobile Sign Out */}
          <button 
            className="flex items-center justify-center w-full p-3 border rounded-md mt-4"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
      
      {/* AI Copilot Component */}
      {isAICopilotOpen && <AICopilot isOpen={isAICopilotOpen} onClose={() => setIsAICopilotOpen(false)} />}
    </div>
  )
}
