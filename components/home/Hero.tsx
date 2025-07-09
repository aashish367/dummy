'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Award } from 'lucide-react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images - Different for desktop and mobile */}
      <div className="absolute inset-0">
        {/* Desktop Image - hidden on mobile */}
        <img
          src="/images/hero-bg-1.jpg"
          alt="Luxury watches background"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* Mobile Image - hidden on desktop */}
        <img
          src="/images/hero-bg-2.jpg"
          alt="Luxury watches mobile background"
          className="md:hidden w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-40 md:w-80 h-40 md:h-80 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Your Trusted{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              Wholesale Partner
            </span>
            <br />
            for Timeless Essentials
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-amber-100 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Premium quality watches, clocks, and home appliances at unbeatable wholesale prices. 
            Serving businesses across India with reliability and excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
            <Link
              href="/bulk-inquiry"
              className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 font-semibold rounded-full transition-all duration-300 shadow-lg text-sm md:text-base"
            >
              Get Bulk Quote
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">15+ Years</h3>
              <p className="text-amber-200 text-sm md:text-base">Industry Experience</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">5000+</h3>
              <p className="text-amber-200 text-sm md:text-base">Happy Customers</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center sm:col-span-1 col-span-1"
            >
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Award className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">99%</h3>
              <p className="text-amber-200 text-sm md:text-base">Customer Satisfaction</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-yellow-400/50 rounded-full flex justify-center">
          <div className="w-1 h-2 md:h-3 bg-yellow-400/50 rounded-full mt-1 md:mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;