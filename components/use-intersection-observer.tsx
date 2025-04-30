"use client"

import { useEffect, useState, RefObject } from 'react'

interface UseIntersectionObserverProps {
  ref: RefObject<Element>
  threshold?: number
  rootMargin?: string
}

// Create a simple hook function
function useIntersectionObserver({
  ref,
  threshold = 0.1,
  rootMargin = '0px'
}: UseIntersectionObserverProps): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when observer callback fires
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin,
        threshold,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref, rootMargin, threshold])

  return isIntersecting
}

// Export it as default
export default useIntersectionObserver
