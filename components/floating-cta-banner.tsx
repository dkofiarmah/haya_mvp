'use client'

import React, { useEffect, useState } from 'react';

const FloatingCTABanner = ({ 
  onClose 
}: { 
  onClose: () => void 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transform ${isVisible ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-500 ease-out`}
    >
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/90 to-primary rounded-lg shadow-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/safari-sunset.svg')] opacity-10 bg-cover bg-right"></div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          aria-label="Close banner"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Special Launch Offer: 30% OFF</h3>
            <p className="text-white/90 text-sm">Limited time promotion for early adopters. First 100 sign-ups only!</p>
          </div>
          <div className="shrink-0">
            <a 
              href="/auth/register" 
              className="inline-block px-6 py-2 bg-white text-primary rounded-full font-medium text-sm hover:bg-white/90 transition-colors shadow-sm"
            >
              Claim Your Discount →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTABanner;
