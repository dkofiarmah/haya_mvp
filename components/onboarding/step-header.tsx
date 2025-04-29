"use client"

import { LucideIcon } from "lucide-react"

interface StepHeaderProps {
  title: string
  Icon: LucideIcon
}

export function StepHeader({ title, Icon }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  )
}
