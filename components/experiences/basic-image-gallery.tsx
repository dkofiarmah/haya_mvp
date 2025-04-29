'use client'

import { useState } from 'react'
import Image from 'next/image'

type ImageGalleryProps = {
  images: string[]
  alt?: string
}

export default function BasicImageGallery({ images, alt = 'Experience image' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle empty image array
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  // For single image
  if (images.length === 1) {
    return (
      <div className="relative w-full h-96 overflow-hidden rounded-lg">
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // For multiple images with navigation
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {/* Main image */}
      <img
        src={images[currentIndex]}
        alt={`${alt} - ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === currentIndex
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`View image ${idx + 1}`}
          />
        ))}
      </div>

      {/* Left/Right navigation buttons */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  )
}
