"use client"

import React, { useEffect, useState } from 'react'

const SvgBackground = () => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
    </div>
  )
}

export default SvgBackground
