"use client"

import { useEffect, useRef, useState } from 'react'

// Enhanced animation for decorative elements with safari-themed particles
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Handle resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    canvas.width = windowSize.width
    canvas.height = windowSize.height
    
    // Safari-themed particle types
    const particleTypes = ['dust', 'leaf', 'sparkle']
    
    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor(windowSize.width / 50), 30) // Responsive particle count
    
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      type: string
      rotation: number
      rotationSpeed: number
      opacity: number
      opacityChange: number
      
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)]
        
        // Different properties based on type
        if (this.type === 'dust') {
          this.size = Math.random() * 4 + 1
          this.color = `rgba(var(--primary-rgb), ${Math.random() * 0.2})`
          this.speedX = Math.random() * 0.5 - 0.25
          this.speedY = Math.random() * 0.5 - 0.25
        } else if (this.type === 'leaf') {
          this.size = Math.random() * 5 + 3
          this.color = `rgba(var(--primary-rgb), ${Math.random() * 0.3 + 0.1})`
          this.speedX = Math.random() * 1 - 0.5
          this.speedY = Math.random() * 0.5 - 0.1 // Slower vertical movement
          this.rotation = Math.random() * 360
          this.rotationSpeed = (Math.random() * 2 - 1) * 0.5
        } else { // sparkle
          this.size = Math.random() * 2 + 0.5
          this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
          this.speedX = Math.random() * 0.2 - 0.1
          this.speedY = Math.random() * 0.2 - 0.1
          this.opacity = Math.random() * 0.7 + 0.3
          this.opacityChange = (Math.random() > 0.5 ? 1 : -1) * 0.01
        }
        
        this.rotation = 0
        this.rotationSpeed = 0
        this.opacity = 1
        this.opacityChange = 0
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        // Boundary checks with edge wrapping
        if (this.x > canvas.width + this.size) {
          this.x = -this.size
        } else if (this.x < -this.size) {
          this.x = canvas.width + this.size
        }
        
        if (this.y > canvas.height + this.size) {
          this.y = -this.size
        } else if (this.y < -this.size) {
          this.y = canvas.height + this.size
        }
        
        // Update rotation for leaves
        if (this.type === 'leaf') {
          this.rotation += this.rotationSpeed
        }
        
        // Update opacity for sparkles
        if (this.type === 'sparkle') {
          this.opacity += this.opacityChange
          if (this.opacity > 0.9 || this.opacity < 0.2) {
            this.opacityChange = -this.opacityChange
          }
        }
      }
      
      draw() {
        if (!ctx) return
        
        if (this.type === 'dust') {
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (this.type === 'leaf') {
          ctx.save()
          ctx.translate(this.x, this.y)
          ctx.rotate(this.rotation * Math.PI / 180)
          
          // Simple leaf shape
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.restore()
        } else { // sparkle
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
          )
          gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`)
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return
      
      // Clear with slight opacity for trailing effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()
  }, [windowSize])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 opacity-30 pointer-events-none"
    />
  )
}
