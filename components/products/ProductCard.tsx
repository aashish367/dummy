'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MessageCircle, Eye, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { normalizeCoverImage } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  moq: number;
  rating: number;
  reviews: number;
  tags: string[];
  inStock: boolean;
  description?: string;
  cover_img: string | string[];
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  href: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hi! I'm interested in wholesale inquiry for ${product.name}. MOQ: ${product.moq} pieces. Price: ₹${product.price}. Please share more details.`;
    const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'bestseller': return 'bg-red-500 text-white';
      case 'trending': return 'bg-green-500 text-white';
      case 'new': return 'bg-amber-500 text-white';
      case 'premium': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const coverImage = normalizeCoverImage(product.cover_img);

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <Link href={`/products/${product.category}/${product.id}`} className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48">
            <img
              src={coverImage}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {product.tags.length > 0 && (
              <div className="absolute top-2 left-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(product.tags[0])}`}>
                  {product.tags[0]}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-2 sm:mb-0">
                {product.name}
              </h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm md:text-base">
              {product.description}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                    ₹{product.price}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <Package className="inline h-4 w-4 mr-1" />
                    MOQ: {product.moq} pieces
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors text-sm md:text-base transform hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Quick Inquiry
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <Link href={`/products/${product.category}/${product.id}`}>
        <div className="relative">
          <img
            src={coverImage}
            alt={product.name}
            className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.tags.length > 0 && (
            <div className="absolute top-3 md:top-4 left-3 md:left-4">
              <span className={`px-3 md:px-4 py-1 rounded-full text-xs font-medium ${getTagColor(product.tags[0])}`}>
                {product.tags[0]}
              </span>
            </div>
          )}
          <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 flex-1">
              {product.name}
            </h3>
            <div className="flex items-center ml-2">
              <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-1">
                {product.rating}
              </span>
            </div>
          </div>
          
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg md:text-xl font-bold text-amber-600 dark:text-amber-400">
                ₹{product.price}
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                MOQ: {product.moq} pieces
              </p>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-4 md:px-6 pb-4 md:pb-6">
        <button
          onClick={handleWhatsAppInquiry}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-full font-medium transition-colors flex items-center justify-center text-sm md:text-base transform hover:scale-105"
        >
          <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
          Quick Inquiry
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;