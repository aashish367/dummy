'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, DollarSign, Filter } from 'lucide-react';

interface Product {
  id: string;
  category: string;
  subcategory: string;
  price: number;
  moq: number;
  tags: string[];
  inStock: boolean;
}

interface Filters {
  subcategory: string;
  priceRange: number[];  
  moqRange: number[];    
  tags: string[];
  inStock: boolean;
}

interface ProductFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showFilters: boolean;
  products: Product[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  showFilters,
  products
}) => {
  const subcategories = Array.from(new Set(products.map(p => p.subcategory)));
  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));
  const maxPrice = Math.max(...products.map(p => p.price));
  const maxMoq = Math.max(...products.map(p => p.moq));

  const clearFilters = () => {
    setFilters({
      subcategory: '',
      priceRange: [0, maxPrice],
      moqRange: [0, maxMoq],
      tags: [],
      inStock: false
    });
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="w-72 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 h-fit sticky top-24"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Filter className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-6">
            {/* Subcategory Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Subcategory
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="subcategory"
                    value=""
                    checked={filters.subcategory === ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All</span>
                </label>
                {subcategories.map(subcategory => (
                  <label key={subcategory} className="flex items-center">
                    <input
                      type="radio"
                      name="subcategory"
                      value={subcategory}
                      checked={filters.subcategory === subcategory}
                      onChange={(e) => setFilters(prev => ({ ...prev, subcategory: e.target.value }))}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {subcategory}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Price Range
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* MOQ Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Package className="h-4 w-4 mr-1" />
                MOQ Range
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={maxMoq}
                  value={filters.moqRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    moqRange: [prev.moqRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{filters.moqRange[0]} pcs</span>
                  <span>{filters.moqRange[1]} pcs</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFilters;