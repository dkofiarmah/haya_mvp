'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface FormButtonProps {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
  onClick?: () => void
}

export function FormButton({
  children,
  disabled = false,
  isLoading = false,
  type = 'submit',
  variant = 'default',
  className = '',
  onClick
}: FormButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      className={`w-full ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

interface FormErrorProps {
  error: string | null
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null
  
  return (
    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
      {error}
    </div>
  )
}

interface FormSuccessProps {
  message: string | null
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null
  
  return (
    <div className="bg-emerald-500/15 text-emerald-500 text-sm p-3 rounded-md">
      {message}
    </div>
  )
}
