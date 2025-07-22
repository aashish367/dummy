'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import {
  Star,
  MessageCircle,
  Share2,
  Heart,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  ShoppingCart,
} from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useQuoteItems } from "@/hooks/useQuoteItems";
import ProductReviews from "@/components/products/ProductReviews";
import { supabase, type Product, normalizeCoverImage } from "@/lib/supabase";

// Add this interface for your props
interface ProductDetailProps {
  initialProduct?: Product;
  initialSimilarProducts?: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  initialProduct = null, 
  initialSimilarProducts = [] 
}) => {
  const params = useParams();
  const id = params.id as string;
  const category = params.category as string;
  const router = useRouter();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToQuote } = useQuoteItems();
  const [refreshReviews, setRefreshReviews] = useState(false);
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [similarProducts, setSimilarProducts] = useState<Product[]>(initialSimilarProducts);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(initialProduct?.moq || 50);
  const [showAddedToQuote, setShowAddedToQuote] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (id && !initialProduct) {
      fetchProduct();
    }
  }, [id, initialProduct]);

  useEffect(() => {
    if (!showAuthModal && refreshReviews) {
      setRefreshReviews(false);
    }
  }, [showAuthModal, refreshReviews]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setProduct(data);
      setQuantity(data.moq);

      // Update document title
      document.title = `${data.name} - Wholesale ${data.category.replace("-", " ")} | Shiv Watches`;

      // Fetch similar products
      const { data: similarData } = await supabase
        .from("products")
        .select("*")
        .eq("category", data.category)
        .neq("id", id)
        .limit(4);

      setSimilarProducts(similarData || []);
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push('/404'); // Redirect to 404 if product not found
    } finally {
      setLoading(false);
    }
  };

  const checkAuthAndExecute = (
    action: () => void,
    mode: "login" | "signup" = "login"
  ) => {
    if (!user) {
      setAuthModalMode(mode);
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    checkAuthAndExecute(async () => {
      setWishlistLoading(true);
      try {
        if (isInWishlist(product.id)) {
          const { error } = await removeFromWishlist(product.id);
          if (error) {
            console.error("Error removing from wishlist:", error);
          }
        } else {
          const { error } = await addToWishlist(product);
          if (error) {
            console.error("Error adding to wishlist:", error);
          }
        }
      } finally {
        setWishlistLoading(false);
      }
    });
  };

  const handleAddToQuote = () => {
    if (!product) return;

    checkAuthAndExecute(async () => {
      setQuoteLoading(true);
      try {
        const currentPricing = getCurrentPricing();
        const { error } = await addToQuote(
          product,
          quantity,
          currentPricing.price
        );

        if (error) {
          console.error("Error adding to quote:", error);
        } else {
          setShowAddedToQuote(true);
          setTimeout(() => setShowAddedToQuote(false), 3000);
        }
      } finally {
        setQuoteLoading(false);
      }
    });
  };

  const handleReviewAuthRequired = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setRefreshReviews(true);
  };

  const handleGoToQuote = () => {
    if (!product) return;

    checkAuthAndExecute(async () => {
      const currentPricing = getCurrentPricing();
      const { error } = await addToQuote(
        product,
        quantity,
        currentPricing.price
      );

      if (!error) {
        router.push("/bulk-inquiry");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"
                  ></div>
                ))}
              </div>
            </div>
            <div className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product not found
          </h1>
          <Link
            href="/products"
            className="text-amber-600 hover:text-amber-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Function to get filtered pricing tiers based on product category and brand
  const getFilteredPricingTiers = () => {
    const basePricingTiers = [
      { quantity: product.moq, price: product.price, discount: 0 },
      {
        quantity: product.moq * 2,
        price: parseFloat((product.price * 0.93).toFixed(2)),
        discount: 7,
      },
      {
        quantity: product.moq * 5,
        price: parseFloat((product.price * 0.87).toFixed(2)),
        discount: 13,
      },
      {
        quantity: product.moq * 10,
        price: parseFloat((product.price * 0.8).toFixed(2)),
        discount: 20,
      },
      {
        quantity: product.moq * 20,
        price: parseFloat((product.price * 0.73).toFixed(2)),
        discount: 27,
      },
    ];

    // Check if this is a wall-clock with designer subcategory
    const isWallClockDesigner = product.category === 'wall-clocks' && 
      (product.subcategory === 'designer');

    // Check if this is a table-clock with orpat brand
    const isTableClockOrpat = product.category === 'table-clocks' && 
      product.brand?.toLowerCase() === 'orpat';

    console.log('Product category:', product.category);
    console.log('Product brand:', product.brand);
    console.log('Is table-clock + orpat:', isTableClockOrpat);

    // For wall-clock + designer: show all discounts (no filtering needed)
    if (isWallClockDesigner) {
      return basePricingTiers.filter(tier => tier.discount <= 20);
    }

    // For table-clock + orpat: limit discounts to maximum 20%
    if (isTableClockOrpat) {
      console.log('Filtering for table-clocks + orpat');
      return basePricingTiers.filter(tier => tier.discount <= 20);
    }

    // For all other products: show all discounts
    return basePricingTiers;
  };

  const pricingTiers = getFilteredPricingTiers();

  const getCurrentPricing = () => {
    const tier =
      [...pricingTiers].reverse().find((tier) => quantity >= tier.quantity) ||
      pricingTiers[0];
    return tier;
  };

  const currentPricing = getCurrentPricing();
  const totalPrice = currentPricing.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= product.moq) {
      setQuantity(newQuantity);
    }
  };

  const handleWhatsAppInquiry = () => {
    const pricing = getCurrentPricing();
    const message = `Hi! I'm interested in wholesale inquiry for:

Product: ${product.name}
Quantity: ${quantity} pieces
Unit Price: ₹${pricing.price.toFixed(2)} (${pricing.discount}% discount)
Total: ₹${totalPrice.toFixed(2)}

Please provide more details about:
- Availability and delivery time
- Payment terms
- Shipping options
- Bulk customization options

Thank you!`;
    const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this wholesale product: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleSimilarProductInquiry = (similarProduct: Product) => {
    const message = `Hi! I'm interested in wholesale inquiry for ${similarProduct.name}. MOQ: ${similarProduct.moq} pieces. Please share more details.`;
    const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const isProductInWishlist = product ? isInWishlist(product.id) : false;
  const coverImage = normalizeCoverImage(product.cover_img);
  const allImages = [coverImage, ...product.images];

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authModalMode}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6 md:mb-8 overflow-x-auto">
            <Link
              href="/"
              className="hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products/${product.category}`}
              className="hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap"
            >
              {product.category.replace("-", " ")}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white truncate">
              {product.name}
            </span>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Back to Products
          </button>

          {/* Success Message */}
          {showAddedToQuote && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 md:px-6 py-3 rounded-lg shadow-lg flex items-center"
            >
              <Check className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Added to quote request!
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Product Images */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`border-2 rounded-lg overflow-hidden ${
                        selectedImage === index
                          ? "border-amber-500"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-16 md:h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                {/* Product Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h1>
                    {product.brand && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {product.brand}{" "}
                        {product.model && `• Model: ${product.model}`}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      className={`p-2 rounded-full transition-colors ${
                        isProductInWishlist
                          ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      } ${
                        wishlistLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-50 dark:hover:bg-red-900/10"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 md:h-5 md:w-5 ${
                          isProductInWishlist ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Share2 className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 md:h-5 md:w-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-base md:text-lg font-semibold">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    ({product.reviews} reviews)
                  </span>
                  {product.inStock && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                          tag === "bestseller"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : tag === "trending"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pricing Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Dynamic Wholesale Pricing
                  </h3>

                  {/* Current Pricing Display */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Current Unit Price
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
                            ₹{currentPricing.price.toFixed(2)}
                          </span>
                          {currentPricing.discount > 0 && (
                            <>
                              <span className="text-base md:text-lg text-gray-500 line-through">
                                ₹{product.price}
                              </span>
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs md:text-sm font-medium">
                                {currentPricing.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Amount
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity (Min: {product.moq} pieces)
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(quantity - 10)}
                        disabled={quantity <= product.moq}
                        className="p-2 border text-black dark:text-white border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            parseInt(e.target.value) || product.moq
                          )
                        }
                        min={product.moq}
                        className="w-24 md:w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 10)}
                        className="p-2 border text-black border-gray-300 dark:text-white dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Volume Discounts Available
                      {product.category === 'table-clock' && product.brand?.toLowerCase() === 'orpat' && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">
                          (Special pricing for Orpat table clocks)
                        </span>
                      )}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pricingTiers.map((tier) => (
                        <div
                          key={tier.quantity}
                          className={`border rounded-lg p-3 ${
                            quantity >= tier.quantity
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                              : "border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-black dark:text-white">
                              {tier.quantity}+ pcs
                            </span>
                            <div className="text-right">
                              <span className="font-bold text-black dark:text-white">
                                ₹{tier.price.toFixed(2)}
                              </span>
                              {tier.discount > 0 && (
                                <span className="text-xs text-green-600 ml-1">
                                  ({tier.discount}% off)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm md:text-base"
                  >
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Send WhatsApp Inquiry
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToQuote}
                      disabled={quoteLoading}
                      className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm md:text-base"
                    >
                      {quoteLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      )}
                      Add to Quote
                    </button>

                    <button
                      onClick={handleGoToQuote}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm md:text-base"
                    >
                      <Package className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Quote Now
                    </button>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <Shield className="h-6 w-6 md:h-8 md:w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Quality Assured
                    </p>
                  </div>
                  <div className="text-center">
                    <Truck className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Fast Shipping
                    </p>
                  </div>
                  <div className="text-center">
                    <Package className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Bulk Friendly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-8 md:mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4 md:space-x-8 px-6 md:px-8 overflow-x-auto">
                  <button className="py-4 px-1 border-b-2 border-amber-500 text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap text-sm md:text-base">
                    Description
                  </button>
                </nav>
              </div>

              <div className="p-6 md:p-8">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Product Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
                    {product.description}
                  </p>

                  {/* Specifications */}
                  {product.specifications &&
                    Object.keys(product.specifications).length > 0 && (
                      <>
                        <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Specifications
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                              >
                                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base">
                                  {key}:
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}

                  {/* Highlights */}
                  {product.highlights && product.highlights.length > 0 && (
                    <>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Key Highlights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ProductReviews 
            productId={product.id} 
            currentRating={product.rating || 0}
            reviewCount={product.reviews || 0}
            onAuthRequired={handleReviewAuthRequired}
            key={refreshReviews ? 'refresh' : 'normal'}
          />

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-8 md:mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Similar Products
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {similarProducts.map((similarProduct) => {
                    const similarCoverImage = normalizeCoverImage(similarProduct.cover_img);
                    return (
                      <motion.div
                        key={similarProduct.id}
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <Link href={`/products/${similarProduct.category}/${similarProduct.id}`}>
                          <div className="relative">
                            <img
                              src={similarCoverImage}
                              alt={similarProduct.name}
                              className="w-full h-32 md:h-40 object-cover"
                            />
                            {similarProduct.tags.length > 0 && (
                              <div className="absolute top-2 left-2">
                                <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  {similarProduct.tags[0]}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm md:text-base line-clamp-2">
                              {similarProduct.name}
                            </h4>

                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                              {similarProduct.category.replace("-", " ")}
                            </p>

                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <p className="text-base md:text-lg font-bold text-amber-600 dark:text-amber-400">
                                  ₹{similarProduct.price.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  MOQ: {similarProduct.moq} pcs
                                </p>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-1">
                                  {similarProduct.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="px-4 pb-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleSimilarProductInquiry(similarProduct);
                            }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center text-xs md:text-sm"
                          >
                            <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Quick Inquiry
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
