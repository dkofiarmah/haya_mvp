"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { cn } from "@/lib/utils"

// Create a separate component to use the searchParams hook
function NavigationProgressInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    // Show progress bar and start incrementing progress
    setIsNavigating(true)
    setComplete(false)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Gradually increase to 90% (reserving the last 10% for actual completion)
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        // Speed up as we go to simulate real loading
        const increment = Math.max(1, Math.floor((90 - prev) / 10))
        return prev + increment
      })
    }, 100)

    // When navigation is done, complete the progress
    const timeout = setTimeout(() => {
      setProgress(100)
      const completeTimeout = setTimeout(() => {
        setComplete(true)
        setIsNavigating(false)
      }, 200) // Keep it visible briefly after reaching 100%
      
      return () => clearTimeout(completeTimeout)
    }, 300) // Short delay before completing to ensure bar is visible

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [pathname, searchParams])

  if (complete) return null

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 transition-opacity",
        isNavigating ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        width: `${progress}%`,
        transition: 'width 0.2s ease-in-out',
      }}
    />
  )
}

// Export the main component that wraps the inner component in Suspense
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  )
}
