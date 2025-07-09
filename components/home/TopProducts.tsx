'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, MessageCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, type Product } from '../../lib/supabase';

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px 0px',
  });

  const handleWhatsAppInquiry = (product: Product) => {
    const message = `Hi! I'm interested in wholesale inquiry for ${product.name}. MOQ: ${product.moq} pieces. Please share more details.`;
    const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.6,
          delay: (index % 6) * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      } : { 
        opacity: 0, 
        y: 50, 
        scale: 0.9 
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        transition: { duration: 0.3 }
      }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full"
    >
      <Link href={`/products/${product.category}/${product.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <Image
            src={product.cover_img[0] || 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          
          <motion.div 
            className="absolute top-2 left-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { 
              scale: 1, 
              rotate: 0,
              transition: {
                delay: (index % 6) * 0.1 + 0.3,
                duration: 0.5,
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            } : { scale: 0, rotate: -180 }}
          >
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
              🔥 Trending
            </span>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <motion.h3 
              className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { 
                opacity: 1, 
                x: 0,
                transition: {
                  delay: (index % 6) * 0.1 + 0.4,
                  duration: 0.4
                }
              } : { opacity: 0, x: -20 }}
            >
              {product.name}
            </motion.h3>
            <motion.div 
              className="flex items-center ml-1 flex-shrink-0"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { 
                opacity: 1, 
                scale: 1,
                transition: {
                  delay: (index % 6) * 0.1 + 0.5,
                  duration: 0.3,
                  type: "spring"
                }
              } : { opacity: 0, scale: 0 }}
            >
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5">
                {product.rating}
              </span>
            </motion.div>
          </div>
          
          <motion.p 
            className="text-xs text-gray-500 dark:text-gray-400 mb-2 capitalize"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: {
                delay: (index % 6) * 0.1 + 0.6,
                duration: 0.3
              }
            } : { opacity: 0 }}
          >
            {product.category.replace('-', ' ')}
          </motion.p>
          
          <motion.div 
            className="flex justify-between items-center mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { 
              opacity: 1, 
              y: 0,
              transition: {
                delay: (index % 6) * 0.1 + 0.7,
                duration: 0.4
              }
            } : { opacity: 0, y: 20 }}
          >
            <div>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                ₹{product.price}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                MOQ: {product.moq} pcs
              </p>
            </div>
          </motion.div>
        </div>
      </Link>
      
      <div className="px-3 pb-3">
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            handleWhatsAppInquiry(product);
          }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center text-xs shadow-sm hover:shadow-md transform hover:scale-[1.02]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { 
            opacity: 1, 
            y: 0,
            transition: {
              delay: (index % 6) * 0.1 + 0.8,
              duration: 0.4
            }
          } : { opacity: 0, y: 20 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          Quick Inquiry
        </motion.button>
      </div>
    </motion.div>
  );
};

const TopProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [viewAllRef, viewAllInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('tags', ['trending'])
        .order('rating', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching trending products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-56 mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-3">
                <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded-md mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10"
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🔥 Trending Products
          </motion.h2>
          <motion.p 
            className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover the hottest wholesale items that businesses are buying right now
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {!loading && products.length > 0 && (
          <motion.div 
            ref={viewAllRef}
            className="text-center"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={viewAllInView ? { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            } : { 
              opacity: 0, 
              y: 30, 
              scale: 0.9 
            }}
          >
            <Link href="/products">
              <motion.button
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(245, 158, 11, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">View All Products</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-sm mt-3"
              initial={{ opacity: 0 }}
              animate={viewAllInView ? { 
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 0.4
                }
              } : { opacity: 0 }}
            >
              Explore our complete catalog of wholesale products
            </motion.p>
          </motion.div>
        )}

        {!loading && products.length === 0 && (
          <motion.div 
            className="text-center py-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl mb-3">📊</div>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-1">
              No trending products found at the moment.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Check back soon for the latest trending items!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopProducts;