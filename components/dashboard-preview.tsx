// Dashboard preview with safari theme elements
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const DashboardPreview = () => {
  const [imageFailed, setImageFailed] = useState(false);
  
  // Check if the actual dashboard image exists
  useEffect(() => {
    const checkImage = async () => {
      try {
        const res = await fetch('/dashboard-preview.png');
        if (!res.ok) {
          setImageFailed(true);
        }
      } catch (error) {
        setImageFailed(true);
      }
    };
    
    checkImage();
  }, []);
  
  // If we have a real dashboard image, use it
  if (!imageFailed) {
    return (
      <div className="relative w-full h-full min-h-[400px]">
        <Image 
          src="/dashboard-preview.png" 
          alt="Haya dashboard preview" 
          fill
          className="object-cover rounded-lg"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }
  
  // Otherwise, use our SVG fallback
  return (
    <div className="relative w-full h-full min-h-[400px] shadow-lg rounded-lg overflow-hidden">
      <Image
        src="/dashboard-preview.svg"
        alt="Haya dashboard preview"
        fill
        className="object-cover rounded-lg"
      />
      
      {/* Add some animated elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 bg-white/80 backdrop-blur-sm px-8 py-6 rounded-lg shadow-lg max-w-md text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Powerful Dashboard Analytics</h3>
          <p className="text-gray-600">Gain insights into your business performance with intuitive visualizations and real-time metrics</p>
        </div>
      </div>
      
      {/* Animated notification */}
      <div className="absolute top-5 right-5 animate-pulse-slow p-2 bg-white rounded-lg shadow-md flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        <div className="text-xs text-gray-700">New booking received</div>
      </div>
    </div>
  );
};

export default DashboardPreview;
