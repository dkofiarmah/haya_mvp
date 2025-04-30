"use client"

import { useEffect, useState } from 'react'

export function SvgBackground() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <svg 
        width="100%" 
        height="100%" 
        preserveAspectRatio="none" 
        className="opacity-5"
      >
        <circle cx="10%" cy="10%" r="50" fill="#6366F1" opacity="0.7" />
        <circle cx="90%" cy="10%" r="70" fill="#EC4899" opacity="0.7" />
        <circle cx="50%" cy="50%" r="100" fill="#6366F1" opacity="0.3" />
        <circle cx="20%" cy="90%" r="40" fill="#EC4899" opacity="0.6" />
        <circle cx="80%" cy="80%" r="60" fill="#6366F1" opacity="0.4" />
      </svg>
    </div>
  )
}
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        
        {/* Abstract patterns */}
        <circle cx="10%" cy="10%" r="50" fill="url(#gradient1)" opacity="0.7" />
        <circle cx="90%" cy="10%" r="70" fill="url(#gradient1)" opacity="0.7" />
        <circle cx="50%" cy="50%" r="100" fill="url(#gradient1)" opacity="0.3" />
        <circle cx="20%" cy="90%" r="40" fill="url(#gradient1)" opacity="0.6" />
        <circle cx="80%" cy="80%" r="60" fill="url(#gradient1)" opacity="0.4" />
        
        {/* Connecting lines */}
        <path 
          d="M100,100 Q200,50 300,200 T500,100" 
          stroke="url(#gradient1)" 
          strokeWidth="1"
          fill="none" 
          opacity="0.2"
        />
        <path 
          d="M700,200 Q600,150 500,300 T300,400" 
          stroke="url(#gradient1)" 
          strokeWidth="1"
          fill="none" 
          opacity="0.3"
        />
      </svg>
    </div>
  )
}
      >
        {/* Gradient background */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'var(--primary-color)', stopOpacity: 0.1}} />
            <stop offset="100%" style={{stopColor: 'var(--primary-color)', stopOpacity: 0.05}} />
          </linearGradient>
          
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: 'var(--primary-color)', stopOpacity: 0.08}} />
            <stop offset="100%" style={{stopColor: 'var(--primary-color)', stopOpacity: 0.02}} />
          </linearGradient>
          
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="var(--primary-color)" opacity="0.3" />
          </pattern>
        </defs>
        
        {/* Background pattern */}
        <rect 
          x="0" y="0" width="100%" height="100%" 
          fill="url(#dots)" 
          opacity="0.05"
          className="svg-element"
        />
        
        {/* Animated subtle circles */}
        <circle 
          cx="10%" 
          cy="20%" 
          r="5%" 
          fill="none" 
          stroke="var(--primary-color)" 
          strokeWidth="0.5" 
          opacity="0.3"
          className="svg-element animate-pulse-slow"
          style={{animationDuration: '7s'}}
        />
        
        <circle 
          cx="85%" 
          cy="65%" 
          r="8%" 
          fill="none" 
          stroke="var(--primary-color)" 
          strokeWidth="0.5" 
          opacity="0.2"
          className="svg-element animate-pulse-slow"
          style={{animationDuration: '10s'}}
        />
        
        <circle 
          cx="30%" 
          cy="85%" 
          r="6%" 
          fill="none" 
          stroke="var(--primary-color)" 
          strokeDasharray="5,5"
          strokeWidth="0.5" 
          opacity="0.15"
          className="svg-element animate-rotate"
          style={{transformOrigin: 'center'}}
        />
        
        {/* Decorative lines */}
        <line 
          x1="0%" y1="25%" 
          x2="25%" y2="25%" 
          stroke="var(--primary-color)" 
          strokeWidth="0.5" 
          opacity="0.2"
          className="svg-element"
        />
        
        <line 
          x1="75%" y1="70%" 
          x2="100%" y2="70%" 
          stroke="var(--primary-color)" 
          strokeWidth="0.5" 
          opacity="0.2" 
          className="svg-element"
        />
        
        <line 
          x1="40%" y1="90%" 
          x2="60%" y2="90%" 
          stroke="var(--primary-color)" 
          strokeWidth="0.5" 
          strokeDasharray="10,5"
          opacity="0.15" 
          className="svg-element"
        />
        
        {/* Safari-inspired abstract elements */}
        <path
          d="M150,80 C180,60 190,120 220,100 C250,80 260,140 290,120"
          fill="none"
          stroke="var(--primary-color)"
          strokeWidth="1"
          opacity="0.1"
          className="svg-element animate-float"
          style={{animationDuration: '8s'}}
        />
        
        <path
          d="M850,380 C880,360 890,420 920,400 C950,380 960,440 990,420"
          fill="none"
          stroke="var(--primary-color)"
          strokeWidth="1"
          opacity="0.1"
          className="svg-element animate-float"
          style={{animationDuration: '9s', animationDelay: '1s'}}
        />
        
        {/* Abstract shapes */}
        <polygon
          points="400,50 420,80 380,80"
          fill="var(--primary-color)"
          opacity="0.1"
          className="svg-element animate-float"
          style={{animationDuration: '5s'}}
        />
        
        <polygon
          points="800,250 820,280 780,280"
          fill="var(--primary-color)"
          opacity="0.1"
          className="svg-element animate-float"
          style={{animationDuration: '6s', animationDelay: '0.5s'}}
        />
        
        {/* Subtle wave pattern */}
        <path
          d="M0,100 C100,90 200,110 300,90 C400,70 500,130 600,110 C700,90 800,110 900,100 L900,200 L0,200 Z"
          fill="url(#grad1)"
          opacity="0.03"
          transform="translate(0, 400)"
          className="svg-element animate-float"
        />
        
        <path
          d="M0,80 C150,100 300,60 450,80 C600,100 750,60 900,80 L900,200 L0,200 Z"
          fill="url(#grad2)"
          opacity="0.03"
          transform="translate(0, 600)"
          className="svg-element animate-float"
          style={{animationDuration: '12s', animationDelay: '2s'}}
        />
        
        {/* Safari-themed silhouettes */}
        <path
          d="M120,700 C140,680 160,690 180,670 C200,650 210,660 240,650 C280,640 320,650 340,630"
          stroke="var(--primary-color)"
          strokeWidth="1"
          fill="none"
          opacity="0.07"
          className="svg-element"
          transform="scale(0.8)"
        />
        
        {/* Acacia tree silhouette */}
        <path
          d="M800,680 L810,640 L790,640 Z"
          fill="var(--primary-color)"
          opacity="0.08"
          className="svg-element"
        />
        <path
          d="M800,640 C780,625 760,635 750,620 C740,605 760,590 780,605 C800,590 820,605 810,620 C800,635 820,625 800,640 Z"
          fill="var(--primary-color)"
          opacity="0.08"
          className="svg-element"
        />
      </svg>
    </div>
  )
}
