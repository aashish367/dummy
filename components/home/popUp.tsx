'use client';

import { useState, useEffect } from 'react';
import { X, Watch, Wrench, Sparkles, Star, Zap, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DealPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if popup was already shown today
    const checkPopupStatus = () => {
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem('dealPopupLastShown');
      
      // If popup was not shown today, show it after 10 seconds
      if (lastShown !== today) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          setTimeout(() => setIsAnimating(true), 50);
          // Mark popup as shown today
          localStorage.setItem('dealPopupLastShown', today);
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
      }
    };

    checkPopupStatus();
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 400);
  };

const handleClaim = () => {
  setIsAnimating(false);
  setTimeout(() => {
    setIsVisible(false);
    window.location.href = '/clock-repair';
  }, 400);
};


  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-500 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      <div 
        className={`relative w-full max-w-5xl bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          isAnimating 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-yellow-300/20 rounded-full animate-pulse"></div>
          <div className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-orange-300/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-4 left-1/4 w-8 h-8 md:w-12 md:h-12 bg-yellow-400/30 rounded-full animate-ping delay-700"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 group hover:scale-110"
          aria-label="Close popup"
        >
          <X className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:text-gray-100 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row items-center p-4 md:p-6 lg:p-8 relative z-10 min-h-[400px] lg:min-h-[300px]">
          
          {/* Left Side - Content */}
          <div className="flex-1 text-white lg:pr-8 mb-6 lg:mb-0 text-center lg:text-left">
            
            {/* Header with Animation */}
            <div className={`flex items-center justify-center lg:justify-start mb-4 transition-all duration-700 delay-200 ${
              isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full mr-3 animate-spin-slow">
                <Wrench className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  🔧 Special Service!
                </h2>
                <div className="flex items-center justify-center lg:justify-start mt-1">
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-300 animate-pulse" />
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-300 animate-pulse delay-100" />
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-300 animate-pulse delay-200" />
                </div>
              </div>
            </div>

            {/* Main Offer Text */}
            <div className={`mb-6 transition-all duration-700 delay-400 ${
              isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <p className="text-base md:text-lg lg:text-xl font-semibold mb-2">
                Shop for <span className="text-yellow-200 font-bold text-xl md:text-2xl">₹1000+</span>
              </p>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-yellow-100 mb-2">
                Get FREE Watch Repair Pickup
              </p>
              <div className="flex items-center justify-center lg:justify-start">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-300 mr-2 animate-pulse" />
                <p className="text-base md:text-lg font-medium">
                  <span className="line-through text-orange-200">₹500</span>
                  <span className="ml-2 text-yellow-200 font-bold">FREE!</span>
                </p>
              </div>
            </div>

            {/* Features */}
            <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-6 transition-all duration-700 delay-600 ${
              isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <span>Free doorstep pickup</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-100"></div>
                  <span>Expert watch repair</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-200"></div>
                  <span>Quick turnaround time</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
                  <span>6 months warranty</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className={`transition-all duration-700 delay-800 ${
              isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <Button
                onClick={handleClaim}
                className="w-full lg:w-auto bg-white text-orange-600 hover:bg-gray-50 font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg text-sm md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              >
                <span className="mr-2">Book Free Pickup Now!</span>
                <Truck className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              {/* Timer */}
              <div className="flex items-center justify-center lg:justify-start mt-3">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-200 mr-2 animate-spin" />
                <p className="text-xs md:text-sm text-orange-100">
                  ⏰ Limited time offer - Available in your city!
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className={`flex-shrink-0 transition-all duration-700 delay-300 ${
            isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <div className="relative group">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/30">
                <img
                  src="/images/repair-popup.jpg"
                  alt="Professional Watch Repair Service"
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Floating Icons */}
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1.5 md:p-2 animate-bounce">
                  <Watch className="h-3 w-3 md:h-5 md:w-5 text-orange-600" />
                </div>
                
                <div className="absolute -bottom-2 -left-2 bg-white rounded-full p-1.5 md:p-2 animate-pulse">
                  <Wrench className="h-3 w-3 md:h-5 md:w-5 text-orange-500" />
                </div>

                {/* Sparkle Effects */}
                <div className="absolute top-2 md:top-4 left-2 md:left-4">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-200 animate-ping" />
                </div>
                <div className="absolute bottom-6 md:bottom-8 right-2 md:right-4">
                  <Star className="h-2 w-2 md:h-3 md:w-3 text-yellow-300 animate-pulse delay-500" />
                </div>
              </div>

              {/* Service Badge */}
              <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full animate-pulse">
                FREE SERVICE
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}