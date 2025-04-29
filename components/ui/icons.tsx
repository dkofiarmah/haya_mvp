"use client"

import {
  Loader2 as Spinner,
  Play,
  Check,
  Wand,
  MessageCircle,
  Users,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  ArrowLeft, // Add ArrowLeft import
  // Add other necessary icons from lucide-react here
} from "lucide-react"

export const Icons = {
  spinner: Spinner,
  play: Play,
  check: Check,
  wand: Wand,
  messageCircle: MessageCircle,
  users: Users,
  clock: Clock,
  trendingUp: TrendingUp,
  star: Star,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft, // Add arrowLeft export
  // Add other icons as needed
} as const
