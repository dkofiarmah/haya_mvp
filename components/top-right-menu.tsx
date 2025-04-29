"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { Bell, LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopRightMenu() {
  const { signOut } = useAuth()
  const router = useRouter()
  
  const handleSignOut = () => {
    signOut()
    router.push("/login")
  }

  return (
    <div className="fixed top-0 right-0 z-50 p-4 flex items-center gap-2 bg-white dark:bg-gray-900 shadow-sm rounded-bl-lg">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative" 
        aria-label="Messages"
      >
        <Mail className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
          3
        </span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
          2
        </span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 px-3 hover:bg-accent"
            aria-label="User menu"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background w-56 border shadow-md">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-500 focus:text-red-500 focus:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
