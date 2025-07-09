'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

interface CategoryInfo {
  name: string;
  description: string;
}

interface CategoryInfoMap {
  [key: string]: CategoryInfo;
  'speakers': CategoryInfo;
  'wrist-watches': CategoryInfo;
  'wall-clocks': CategoryInfo;
  'table-clocks': CategoryInfo;
  'home-appliances': CategoryInfo;
  'accessories': CategoryInfo;
}

const ProductCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('category, cover_img')
        .order('category');

      if (error) throw error;

      if (!data || data.length === 0) {
        setCategories([]);
        setLoading(false);
        return;
      }

      const categoryMap = new Map<string, { count: number; image: string }>();
      data.forEach(product => {
        const category = product.category;
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            count: 0,
            image: product.cover_img?.[0] || '/default-product.jpg'
          });
        }
        const categoryData = categoryMap.get(category);
        if (categoryData) categoryData.count++;
      });

      const categoryInfo: CategoryInfoMap = {
        'speakers': { name: 'Speakers', description: 'Premium Bluetooth speakers' },
        'wrist-watches': { name: 'Wrist Watches', description: 'Premium wrist watches' },
        'wall-clocks': { name: 'Wall Clocks', description: 'Stylish wall clocks' },
        'table-clocks': { name: 'Table Clocks', description: 'Elegant desk clocks' },
        'home-appliances': { name: 'Home Appliances', description: 'Quality home appliances' },
        'accessories': { name: 'Accessories', description: 'Watch accessories' }
      };

      const getCategoryInfo = (category: string): CategoryInfo => {
        const info = categoryInfo[category as keyof CategoryInfoMap];
        if (info) return info;
        return {
          name: formatCategoryName(category),
          description: `${formatCategoryName(category)} collection`
        };
      };

      const categoriesData = Array.from(categoryMap.entries()).map(([category, data]) => ({
        id: category,
        ...getCategoryInfo(category),
        image: data.image,
        count: data.count
      }));

      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchCategories} />;
  if (categories.length === 0) return <EmptyState />;

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Product Categories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Explore our comprehensive range of wholesale products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ category, index }: { category: CategoryData; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="h-full"
  >
    <Link
      href={`/products/${category.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full"
    >
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-product.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-xl md:text-2xl font-bold text-white text-center px-4">
            {category.name}
          </h3>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">
              {category.description}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors transform group-hover:translate-x-1 ml-2 flex-shrink-0" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            {category.count} Products
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            View All →
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const LoadingSkeleton = () => (
  <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 animate-pulse" />
        ))}
      </div>
    </div>
  </section>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </section>
);

const EmptyState = () => (
  <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Product Categories
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No categories available at the moment.
        </p>
      </div>
    </div>
  </section>
);

export default ProductCategories;