'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Minimize2, 
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExperienceImageGalleryProps {
  images: string[]
  alt?: string
}

export default function ExperienceImageGallery({ 
  images, 
  alt = 'Experience image'
}: ExperienceImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  
  // No images provided
  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }
  
  // Single image display
  if (images.length === 1) {
    return (
      <div className="relative rounded-md overflow-hidden">
        <Image
          src={images[0]} 
          alt={alt}
          width={1200}
          height={675}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    )
  }
  
  // Gallery with navigation
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }
  
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  
  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev)
  }
  
  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = images[currentIndex]
    link.download = `experience-image-${currentIndex + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <>
      {/* Main gallery */}
      <div className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-black/90' : 'rounded-md overflow-hidden'}`}>
        <div className={`${fullscreen ? 'h-screen flex items-center justify-center' : 'w-full'}`}>
          <Image
            src={images[currentIndex]} 
            alt={`${alt} ${currentIndex + 1}`}
            width={1920}
            height={1080}
            className={`${fullscreen ? 'max-h-[90vh] w-auto mx-auto' : 'w-full h-auto object-cover aspect-video'}`}
            priority={currentIndex === 0}
          />
        </div>
        
        {/* Navigation for multiple images */}
        <div className="absolute inset-0 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full ml-2 bg-black/40 text-white hover:bg-black/60"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full mr-2 bg-black/40 text-white hover:bg-black/60"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
            onClick={toggleFullscreen}
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          {fullscreen && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                onClick={downloadImage}
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                onClick={() => setFullscreen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnails */}
      {!fullscreen && images.length > 1 && (
        <div className="flex mt-2 gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all ${
                index === currentIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
