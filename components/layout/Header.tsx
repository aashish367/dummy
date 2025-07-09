'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Sun, Moon, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useQuote } from '../../contexts/QuoteContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, type Product, normalizeCoverImage } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { getTotalItems } = useQuote();
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Clock Repair', href: '/clock-repair' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;
  const totalQuoteItems = getTotalItems();

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(
            `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
          )
          .limit(10);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const filteredResults = useMemo(() => {
    return searchResults.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchResults, searchTerm]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Image */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/images/logo1.png"
              alt="Shiv Watches Logo" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Button */}
            <button
              onClick={handleSearchToggle}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </button>

            {/* Bulk Inquiry Button */}
            <Link
              href="/bulk-inquiry"
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-4 md:px-6 py-3 rounded-full hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 relative shadow-lg text-sm transform hover:scale-105"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden lg:inline">Bulk Inquiry</span>
              {totalQuoteItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {totalQuoteItems > 99 ? '99+' : totalQuoteItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 py-4 relative"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 md:pl-14 pr-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchTerm.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
                >
                  {isSearching ? (
                    <div className="p-4 flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredResults.map((product) => {
                        const coverImage = normalizeCoverImage(product.cover_img);
                        return (
                          <Link
                            key={product.id}
                            href={`/products/${product.category}/${product.id}`}
                            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            <div className="flex items-center space-x-4">
                              {coverImage && (
                                <img
                                  src={coverImage}
                                  alt={product.name}
                                  className="h-12 w-12 object-contain rounded-xl"
                                />
                              )}
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {product.category}
                                </p>
                                <p className="text-amber-600 dark:text-amber-400 font-medium">
                                  ₹{product.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No products found
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-2 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-full text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/bulk-inquiry"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between w-full text-center bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 mt-4"
              >
                <span>Bulk Inquiry</span>
                {totalQuoteItems > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {totalQuoteItems > 99 ? '99+' : totalQuoteItems}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;