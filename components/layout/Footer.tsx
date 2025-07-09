'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === '23505') {
          setSubscriptionStatus('error');
          alert('This email is already subscribed to our newsletter.');
        } else {
          throw error;
        }
      } else {
        setSubscriptionStatus('success');
        setEmail('');
        
        try {
          await supabase.functions.invoke('send-email-notification', {
            body: {
              type: 'newsletter',
              data: { email: email.trim(), subscribed_at: new Date().toISOString() }
            }
          });
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
        }
        
        alert('Thank you for subscribing to our newsletter!');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubscriptionStatus('error');
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/" className="flex items-center space-x-2">
                <img 
                  src="/images/logo1.png" 
                  alt="Shiv Watches Logo" 
                  className="h-14 w-auto"
                />
              </Link>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted wholesale partner for timeless essentials. Quality watches, clocks, and home appliances at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100084722994478" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/shivwatches_wholesale/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@ShivWatches" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/bulk-inquiry" className="text-gray-400 hover:text-white transition-colors">Bulk Inquiry</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/products/wrist-watches" className="text-gray-400 hover:text-white transition-colors">Wrist Watches</Link></li>
              <li><Link href="/products/wall-clocks" className="text-gray-400 hover:text-white transition-colors">Wall Clocks</Link></li>
              <li><Link href="/products/table-clocks" className="text-gray-400 hover:text-white transition-colors">Table Clocks</Link></li>
              <li><Link href="/products/accessories" className="text-gray-400 hover:text-white transition-colors">Watch Accessories</Link></li>
              <li><Link href="/products/home-appliances" className="text-gray-400 hover:text-white transition-colors">Home Appliances</Link></li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to our newsletter for latest products and wholesale deals.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-r-lg transition-colors flex items-center"
                >
                  {isSubscribing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-400" />
                <p className="text-gray-400 text-sm">+91 9821964539</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-400" />
                <p className="text-gray-400 text-sm">+91 9911351462</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-400" />
                <p className="text-gray-400 text-sm">contact@shivwatches.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-orange-400 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  wz-24, Chaukhandi, Vishnu Garden,
                  <br />
                  New Delhi, Delhi, 110018
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Shiv Watches. All rights reserved. | 
            <Link href="/privacy" className="hover:text-white transition-colors ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-white transition-colors ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;