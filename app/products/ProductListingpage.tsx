"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List } from "lucide-react";
import ProductCard from "../../components/products/ProductCard";
import ProductFilters from "../../components/products/ProductFilters";
import { supabase, type Product } from "../../lib/supabase";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { QuoteProvider } from "../../contexts/QuoteContext";
import { AuthProvider } from "../../contexts/AuthContext";

const ProductListing = () => {
  const params = useParams();
  const category = params?.category as string | undefined;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [filters, setFilters] = useState({
    subcategory: "",
    priceRange: [0, 2000],
    moqRange: [0, 100],
    tags: [] as string[],
    inStock: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setVisibleProducts([]);
        setLoading(false);
        return;
      }

      const products = data || [];
      setAllProducts(products);
      setVisibleProducts(products.slice(0, productsPerPage));
      setPage(1);
      setHasMore(products.length > productsPerPage);

      if (products.length > 0) {
        const maxPrice = Math.max(...products.map((p) => p.price));
        const maxMoq = Math.max(...products.map((p) => p.moq));
        setFilters((prev) => ({
          ...prev,
          priceRange: [0, maxPrice],
          moqRange: [0, maxMoq],
        }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProducts([]);
      setVisibleProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.subcategory.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.subcategory) {
      result = result.filter(
        (product) => product.subcategory === filters.subcategory
      );
    }

    if (filters.inStock) {
      result = result.filter((product) => product.inStock);
    }

    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1] &&
        product.moq >= filters.moqRange[0] &&
        product.moq <= filters.moqRange[1]
    );

    if (filters.tags.length > 0) {
      result = result.filter((product) =>
        filters.tags.some((tag) => product.tags.includes(tag))
      );
    }

    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => a.price - b.price);
      case "price-high":
        return result.sort((a, b) => b.price - a.price);
      case "rating":
        return result.sort((a, b) => b.rating - a.rating);
      case "moq":
        return result.sort((a, b) => a.moq - b.moq);
      case "newest":
        return result.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      default:
        return result.sort((a, b) => b.reviews - a.reviews);
    }
  }, [allProducts, searchTerm, filters, sortBy]);

  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const newProducts = filteredProducts.slice(startIndex, endIndex);

    if (newProducts.length === 0) {
      setHasMore(false);
    } else {
      setVisibleProducts((prev) => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(endIndex < filteredProducts.length);
    }
    setLoadingMore(false);
  }, [page, hasMore, loadingMore, filteredProducts]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadMoreProducts, hasMore]);

  useEffect(() => {
    // Reset visible products when filters/sorting changes
    setVisibleProducts(filteredProducts.slice(0, productsPerPage));
    setPage(1);
    setHasMore(filteredProducts.length > productsPerPage);
  }, [filteredProducts]);

  const getCategoryTitle = () => {
    if (!category) return "All Products";

    const categoryNames: Record<string, string> = {
      speakers: "Speakers",
      "wrist-watches": "Wrist Watches",
      "wall-clocks": "Wall Clocks",
      "table-clocks": "Table Clocks",
      "home-appliances": "Home Appliances",
      accessories: "Watch Accessories",
    };

    return (
      categoryNames[category] ||
      category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  if (loading)
    return (
      <ThemeProvider>
        <AuthProvider>
          <QuoteProvider>
            <LoadingState />
          </QuoteProvider>
        </AuthProvider>
      </ThemeProvider>
    );

  return (
    <ThemeProvider>
      <AuthProvider>
        <QuoteProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
                  {getCategoryTitle()}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredProducts.length} products found
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-4 lg:items-center lg:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-sm md:text-base"
                    >
                      <option value="popularity">Most Popular</option>
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="moq">Lowest MOQ</option>
                    </select>

                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 md:p-3 ${
                          viewMode === "grid"
                            ? "bg-amber-500 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <Grid className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 md:p-3 ${
                          viewMode === "list"
                            ? "bg-amber-500 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <List className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center justify-center px-3 md:px-4 py-2 md:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm md:text-base"
                    >
                      <Filter className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 md:gap-8">
                <ProductFilters
                  filters={filters}
                  setFilters={setFilters}
                  showFilters={showFilters}
                  products={allProducts}
                />

                <div className="flex-1">
                  {visibleProducts.length > 0 ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`grid gap-4 md:gap-6 ${
                          viewMode === "grid"
                            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1"
                        }`}
                      >
                        {visibleProducts.map((product, index) => (
                          <motion.div
                            key={`${product.id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ProductCard 
                              product={product} 
                              viewMode={viewMode} 
                              href={`/products/${product.category}/${product.id}`}
                            />
                          </motion.div>
                        ))}
                      </motion.div>

                      <div ref={loadMoreRef} className="mt-6">
                        {loadingMore && (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                          </div>
                        )}
                        {!hasMore && visibleProducts.length > 0 && (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                            No more products to load
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <EmptyProductsState />
                  )}
                </div>
              </div>
            </div>
          </div>
        </QuoteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EmptyProductsState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <Search className="h-12 w-12 md:h-16 md:w-16 mx-auto" />
    </div>
    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No products found
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      Try adjusting your search or filters, or check back later for new products
    </p>
  </div>
);

export default ProductListing;