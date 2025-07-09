"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {Package,  Calculator,MessageCircle,CheckCircle,Plus,Minus,Trash2,X,Mail,Phone,MapPin,AlertCircle,} from "lucide-react";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { QuoteProvider, useQuote } from "../../contexts/QuoteContext";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import AuthModal from "../../components/auth/AuthModal";

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  requirements: string;
}

// Main component that wraps with providers
const BulkInquiry = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuoteProvider>
          <BulkInquiryContent />
        </QuoteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Inner component that uses the hooks
const BulkInquiryContent = () => {
  const {
    quoteItems,
    updateQuantity,
    removeFromQuote,
    clearQuote,
    getTotalValue,
    loading: quoteLoading,
  } = useQuote();
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    requirements: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (user && profile) {
      setFormData((prev) => ({
        ...prev,
        companyName: profile.company_name || "",
        contactPerson: profile.full_name || "",
        email: user.email || "",
        phone: profile.phone || "",
        businessType: profile.business_type || "",
      }));
    }
  }, [user, profile]);

  const businessTypes = [
    "Retailer",
    "Distributor",
    "Online Seller",
    "Export Business",
    "Corporate Gifting",
    "Other",
  ];

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const item = quoteItems.find((item) => item.id === productId);
    if (item && newQuantity >= item.moq) {
      updateQuantity(productId, newQuantity);
    }
  };

  const calculateTotal = () => {
    return getTotalValue();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    checkAuthAndExecute(async () => {
      if (quoteItems.length === 0) {
        alert("Please add some products to your quote before submitting.");
        return;
      }

      setSubmitting(true);
      try {
        const totalValue = calculateTotal();

        const { error } = await supabase.from("bulk_inquiries").insert({
          user_id: user!.id,
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          business_type: formData.businessType,
          gst_number: formData.gstNumber || null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          requirements: formData.requirements || null,
          total_value: totalValue,
          status: "pending",
        });

        if (error) throw error;
        setIsSubmitted(true);
      } catch (error) {
        console.error("Error submitting bulk inquiry:", error);
        alert("Error submitting inquiry. Please try again.");
      } finally {
        setSubmitting(false);
      }
    });
  };

  const handleWhatsAppInquiry = () => {
    checkAuthAndExecute(() => {
      const itemsList = quoteItems
        .map(
          (item) =>
            `• ${item.name} (${item.category}) - Qty: ${item.quantity} - ₹${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join("\n");

      const message = `Bulk Inquiry from ${formData.companyName}

Contact Person: ${formData.contactPerson}
Business Type: ${formData.businessType}
Phone: ${formData.phone}
Email: ${formData.email}

Products Required:
${itemsList}

Total Value: ₹${calculateTotal().toLocaleString()}

Additional Requirements:
${formData.requirements}`;

      const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    });
  };

  if (authLoading || quoteLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 lg:pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto" />
            </motion.div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Inquiry Submitted Successfully!
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Thank you for your bulk inquiry. Our team will review your
              requirements and send you a detailed quotation within 2 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleWhatsAppInquiry}
                className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Follow up on WhatsApp
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  clearQuote();
                }}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                Submit Another Inquiry
              </button>
            </div>
          </motion.div>
        </div>
       
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authModalMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 lg:mb-12"
        >
          <div className="flex items-center justify-center mb-4 lg:mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 lg:p-4 rounded-full">
              <Package className="h-8 w-8 lg:h-12 lg:w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
            Bulk Inquiry & Quote Request
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Get competitive wholesale pricing for your business. Fill out the
            form below and receive a detailed quotation within 2 hours.
          </p>

          {/* Show login prompt for non-authenticated users */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 lg:mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center mb-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <span className="text-amber-800 dark:text-amber-200 font-medium">
                  Authentication Required
                </span>
              </div>
              <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
                Please log in or create an account to submit bulk inquiries and
                save your quotes for future reference.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => {
                    setAuthModalMode("login");
                    setShowAuthModal(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode("signup");
                    setShowAuthModal(true);
                  }}
                  className="bg-transparent border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Form Content */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-8">
              {/* Company Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8"
              >
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
                  Company Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="GST registration number"
                    />
                  </div>
                </div>

                <div className="mt-4 lg:mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Business Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Complete business address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Quote Items */}
              {quoteItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                      Selected Products ({quoteItems.length})
                    </h2>
                    <button
                      type="button"
                      onClick={clearQuote}
                      className="text-red-500 hover:text-red-700 transition-colors flex items-center text-sm sm:text-base"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {quoteItems.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full sm:w-16 h-40 sm:h-16 object-cover rounded-lg"
                          />

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                              {item.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {item.category} • MOQ: {item.moq} pieces
                            </p>
                            <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                              ₹{item.price} per unit
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 10
                                  )
                                }
                                disabled={item.quantity <= item.moq}
                                className="p-1 sm:p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>

                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    parseInt(e.target.value) || item.moq
                                  )
                                }
                                min={item.moq}
                                className="w-16 sm:w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 10
                                  )
                                }
                                className="p-1 sm:p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                              <button
                                type="button"
                                onClick={() => removeFromQuote(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors mt-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Additional Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8"
              >
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
                  Additional Requirements
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Requirements & Notes
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Specify any additional requirements, customization needs, delivery timeline, payment terms, etc."
                  />
                </div>
              </motion.div>
            </div>

            {/* Quote Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 ${
                  isMobile ? "" : "sticky top-24"
                }`}
              >
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center">
                  <Calculator className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Quote Summary
                </h3>

                {quoteItems.length > 0 ? (
                  <>
                    <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6 max-h-64 lg:max-h-80 overflow-y-auto">
                      {quoteItems.map((item) => (
                        <div
                          key={item.id}
                          className="border-b border-gray-200 dark:border-gray-700 pb-3"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-2">
                              <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {item.category} • Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                ₹{(item.quantity * item.price).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                @₹{item.price}/unit
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 lg:mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                          Total Value:
                        </span>
                        <span className="text-lg lg:text-xl font-bold text-blue-600 dark:text-blue-400">
                          ₹{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                        *Final pricing may vary based on actual requirements and
                        current market rates
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 lg:py-8">
                    <Package className="h-10 w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No products selected yet. Browse our products and add them
                      to your quote.
                    </p>
                  </div>
                )}

                <div className="space-y-3 lg:space-y-4">
                  <button
                    type="submit"
                    disabled={quoteItems.length === 0 || submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Submit Inquiry
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    disabled={quoteItems.length === 0}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Quick WhatsApp Inquiry
                  </button>
                </div>

                <div className="mt-4 lg:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                    What you'll get:
                  </h4>
                  <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Detailed quotation within 2 hours</li>
                    <li>• Competitive wholesale pricing</li>
                    <li>• Product samples (if required)</li>
                    <li>• Flexible payment terms</li>
                    <li>• Dedicated account manager</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
  
    </div>
  );
};

export default BulkInquiry;