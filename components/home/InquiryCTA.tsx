'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';

const InquiryCTA: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleWhatsAppClick = () => {
    const message = 'Hi! I am interested in wholesale products from Shiv Watches. Please provide more information about bulk pricing and product catalog.';
    const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+919821964539';
  };

  return (
    <section className="py-20 bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-800 dark:to-yellow-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Wholesale Journey?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful retailers who trust Shiv Watches for their wholesale needs. 
            Get instant quotes and personalized support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Inquiry
            </button>

            <button
              onClick={handleCallClick}
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-amber-600 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </button>

            <Link
              href="/bulk-inquiry"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-amber-600 font-semibold rounded-full transition-all duration-300 shadow-lg"
            >
              Bulk Quote Form
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Instant Response</h3>
              <p className="text-amber-100">Get quotes within 2 hours</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Best Prices</h3>
              <p className="text-amber-100">Guaranteed competitive rates</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Quality Products</h3>
              <p className="text-amber-100">100% quality assurance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InquiryCTA;