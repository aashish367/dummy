"use client";

import { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export default function Loader({ onComplete, duration = 3000 }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 600);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 transition-all duration-600 ${isComplete ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'}`}>
      <div className="flex flex-col items-center space-y-10 max-w-lg mx-auto px-6">
        
        {/* Main Animation Container */}
        <div className="relative">
          {/* Outer Pulsing Ring */}
          <div className="absolute -inset-8 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full animate-ping opacity-20" />
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full animate-pulse opacity-30" />
          
          {/* Main Gear Container */}
          <div className="relative w-32 h-32">
            {/* Rotating Outer Gear */}
            <div 
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: '4s' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 rounded-full relative shadow-2xl">
                {/* Gear Teeth */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-8 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-sm shadow-md"
                    style={{
                      top: '-12px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`,
                      transformOrigin: '50% 76px'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Inner Clock Face */}
            <div className="absolute inset-6 bg-white rounded-full shadow-inner border-4 border-orange-100 flex items-center justify-center">
              {/* Clock Numbers */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute text-xs font-bold ${i % 3 === 0 ? 'text-orange-600' : 'text-orange-400'}`}
                  style={{
                    top: '12px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                    transformOrigin: '50% 28px'
                  }}
                >
                  <span style={{ transform: `rotate(${-i * 30}deg)`, display: 'inline-block' }}>
                    {i === 0 ? 12 : i}
                  </span>
                </div>
              ))}
              
              {/* Moving Clock Hands */}
              <div
                className="absolute w-1 h-6 bg-orange-600 rounded-full origin-bottom shadow-sm"
                style={{
                  top: '22px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${progress * 3.6}deg)`,
                  transformOrigin: '50% 18px'
                }}
              />
              <div
                className="absolute w-0.5 h-4 bg-yellow-600 rounded-full origin-bottom"
                style={{
                  top: '26px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${progress * 36}deg)`,
                  transformOrigin: '50% 14px'
                }}
              />
              
              {/* Center Hub */}
              <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full shadow-md" />
            </div>
          </div>
          
          {/* Floating Elements */}
          <div 
            className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg animate-bounce shadow-lg"
            style={{ animationDelay: '0.5s', animationDuration: '2s' }}
          >
            <div className="absolute inset-1 border border-yellow-200 rounded opacity-60" />
          </div>
          
          <div 
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full animate-bounce shadow-lg"
            style={{ animationDelay: '1s', animationDuration: '2.5s' }}
          />
        </div>
        
        {/* Enhanced Progress Section */}
        <div className="w-80 space-y-6">
          {/* Multi-layer Progress Bar */}
          <div className="relative">
            <div className="w-full h-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full shadow-inner border border-orange-200">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 rounded-full transition-all duration-200 ease-out shadow-sm relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
              </div>
            </div>
            {/* Progress Glow */}
            <div 
              className="absolute top-0 h-3 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full blur-sm opacity-50 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Loading Text with Animation */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent animate-pulse">
              Loading Your Experience
            </h2>
            <p className="text-orange-600 font-medium">
              Preparing something amazing...
            </p>
            <div className="text-2xl font-bold text-orange-500 tabular-nums">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Enhanced Animated Elements */}
        <div className="flex items-center space-x-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-md"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-orange-200 rounded-full animate-pulse opacity-30" />
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-yellow-200 rounded-lg rotate-45 animate-pulse opacity-20" />
        <div className="absolute bottom-32 left-32 w-20 h-20 border-2 border-orange-200 rounded-full animate-pulse opacity-25" />
        <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-yellow-200 rounded-lg rotate-12 animate-pulse opacity-30" />
        
        {/* Floating Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-300 rounded-full animate-ping opacity-40"
            style={{
              top: `${20 + (i * 10)}%`,
              left: `${10 + (i * 12)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}