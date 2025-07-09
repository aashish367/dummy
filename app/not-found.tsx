'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Star, Sparkles } from 'lucide-react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/15 rounded-lg rotate-45 animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-40 w-12 h-12 bg-white/20 rounded-lg animate-spin delay-700" style={{ animationDuration: '3s' }}></div>
        
        {/* Floating icons */}
        <div className="absolute top-60 left-1/4 animate-float delay-200">
          <Star className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-32 right-1/3 animate-float delay-1000">
          <Sparkles className="w-6 h-6 text-white/40" />
        </div>
        <div className="absolute bottom-60 right-1/4 animate-float delay-600">
          <Star className="w-10 h-10 text-white/25" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black text-white drop-shadow-2xl animate-pulse select-none">
              4
              <span className="inline-block animate-bounce delay-200">0</span>
              <span className="inline-block animate-bounce delay-400">4</span>
            </h1>
          </div>

          {/* Error message */}
          <div className={`mb-12 transform transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Oops! Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-md mx-auto leading-relaxed drop-shadow-md">
              The page you're looking for seems to have wandered off into the digital sunset. 
              Don't worry, we'll help you find your way back!
            </p>
          </div>

          {/* Action buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Link href="/">
              <button className="group bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 hover:bg-orange-50">
                <Home className="w-5 h-5 group-hover:animate-bounce" />
                Go Home
              </button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="group bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-bounce" />
              Go Back
            </button>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-700 ${mounted ? 'opacity-60' : 'opacity-0'}`}>
          <p className="text-white/70 text-sm font-medium">
            Error 404 • Page Not Found
          </p>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}