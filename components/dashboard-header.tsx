"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Mail, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/supabase-auth-provider"

export function DashboardHeader() {
  const { signOut } = useAuth()
  const [unreadMessages] = useState(3) // Replace with real data
  const [unreadNotifications] = useState(2) // Replace with real data

  return (
    <div className="fixed top-0 right-0 z-50 p-4 flex items-center gap-2">
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

      {/* Sign Out Button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={signOut}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  )
}
