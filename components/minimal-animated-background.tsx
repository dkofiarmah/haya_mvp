"use client"

import React, { useEffect, useRef } from 'react'

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 opacity-30 pointer-events-none"
    />
  )
}

export default AnimatedBackground
