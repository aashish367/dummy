'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Calendar, Wrench, CheckCircle, MessageCircle, Upload, Image, X } from 'lucide-react';
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import AuthModal from '../../components/auth/AuthModal';
import { ThemeProvider } from "../../contexts/ThemeContext";
import { QuoteProvider } from "../../contexts/QuoteContext";

interface FormData {
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  clockType: string;
  brand: string;
  model: string;
  issueDescription: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
}

interface UploadedImage {
  file: File;
  previewUrl: string;
}

const ClockRepair = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuoteProvider>
          <ClockRepairContent />
        </QuoteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const ClockRepairContent = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contactNumber: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    clockType: '',
    brand: '',
    model: '',
    issueDescription: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        contactNumber: profile.phone || '',
        email: user.email || '',
        address: profile.address || '',
        city: profile.city || '',
        pincode: profile.pincode || ''
      }));
    }
  }, [user, profile]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach(image => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [uploadedImages]);

  const checkAuthAndExecute = (action: () => void, mode: 'login' | 'signup' = 'login') => {
    if (!user) {
      setAuthModalMode(mode);
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      setUploadedImages(prev => [...prev, ...newImages]);
      
      // Upload images to Supabase storage and get URLs
      uploadImagesToSupabase(Array.from(e.target.files));
    }
  };

  const uploadImagesToSupabase = async (files: File[]) => {
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `clock-repairs/${fileName}`;

          const { data, error } = await supabase.storage
            .from('repair-watches')
            .upload(filePath, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('repair-watches')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );

      setImageUrls(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    URL.revokeObjectURL(newImages[index].previewUrl);
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    
    // Also remove the corresponding URL
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    checkAuthAndExecute(async () => {
      setSubmitting(true);
      try {
        const { data, error } = await supabase
          .from('clock_repairs')
          .insert({
            user_id: user!.id,
            full_name: formData.fullName,
            contact_number: formData.contactNumber,
            email: formData.email,
            address: formData.address,
            landmark: formData.landmark,
            city: formData.city,
            pincode: formData.pincode,
            clock_type: formData.clockType,
            brand: formData.brand,
            model: formData.model,
            issue_description: formData.issueDescription,
            preferred_date: formData.preferredDate,
            preferred_time: formData.preferredTime,
            additional_notes: formData.additionalNotes,
            status: 'pending',
            image_urls: imageUrls
          })
          .select();

        if (error) {
          console.error('Error submitting clock repair request:', error);
          alert(`Error submitting request: ${error.message}`);
          return;
        }

        if (data) {
          console.log('Repair request submitted successfully:', data);
          setIsSubmitted(true);
        }
      } catch (error: any) {
        console.error('Error in clock repair submission:', {
          message: error.message,
          stack: error.stack,
          details: error
        });
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setSubmitting(false);
      }
    });
  };

  const handleWhatsAppContact = () => {
    checkAuthAndExecute(() => {
      let message = `Hi! I need clock repair service. Here are my details:

Name: ${formData.fullName}
Contact: ${formData.contactNumber}
Address: ${formData.address}, ${formData.landmark}, ${formData.city} - ${formData.pincode}
Clock Type: ${formData.clockType}
Brand/Model: ${formData.brand} ${formData.model}
Issue: ${formData.issueDescription}
Preferred Date/Time: ${formData.preferredDate} at ${formData.preferredTime}
Additional Notes: ${formData.additionalNotes}`;

      // Add image URLs if available
      if (imageUrls.length > 0) {
        message += `\n\nUploaded Images:`;
        imageUrls.forEach((url, index) => {
          message += `\nImage ${index + 1}: ${url}`;
        });
      }

      message += `\n\nPlease Quote the best.`;

      const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Booking Confirmed!
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Thank you for choosing Shiv Watches for your clock repair needs. 
              We have received your booking request and will contact you within 2 hours to confirm the pickup details.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What happens next?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Our technician will call you to confirm pickup time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Free pickup from your location <small>(If order is above 1000rs)</small></span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Professional diagnosis and repair estimate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Quality repair with warranty</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppContact}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact via WhatsApp
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Book Another Repair
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full">
              <Wrench className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book a Clock Repair Pickup
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional clock repair service with free pickup and delivery. 
            Our expert technicians handle all types of clocks with care and precision.
          </p>

          {/* Show login prompt for non-authenticated users */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center mb-3">
                <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <span className="text-amber-800 dark:text-amber-200 font-medium">
                  Authentication Required
                </span>
              </div>
              <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
                Please log in or create an account to book repair services and track your repair status.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
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

        {/* Service Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Free Pickup</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">We collect your clock from your doorstep</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
            <Wrench className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Repair</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">15+ years of clock repair experience</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
            <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Warranty</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">6 months warranty on all repairs</p>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Repair Booking Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Address Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Complete Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="House/Flat number, Street, Area"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Near landmark"
                />
              </div>
              
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City name"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="400001"
                />
              </div>
            </div>

            {/* Clock Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Clock Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Clock Type *
                  </label>
                  <select
                    name="clockType"
                    value={formData.clockType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select clock type</option>
                    <option value="wall">Wrist Watches</option>
                    <option value="wall">Wall Clock</option>
                    <option value="table">Table Clock</option>
                    <option value="grandfather">Grandfather Clock</option>
                    <option value="antique">Antique Clock</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand & Model
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Seiko, Citizen, etc."
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue Description *
                </label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the problem with your clock (e.g., not working, slow time, broken hands, etc.)"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upload Images of Your Clock/Watch
              </h3>
              
              <div className="space-y-4">
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload clear images of your clock/watch from multiple angles (Max 5 images)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                    max={5}
                  />
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.previewUrl}
                          alt={`Uploaded clock ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scheduling */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preferred Pickup Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select time slot</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special instructions or additional information"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Repair Pickup
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Quick WhatsApp Booking
              </button>
            </div>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-2xl p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Need Immediate Assistance?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Phone className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Call Us</h4>
              <p className="text-gray-600 dark:text-gray-400">+91 9821964539</p>
              <p className="text-gray-600 dark:text-gray-400">+91 9911351462</p>
            </div>
            
            <div>
              <MapPin className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Visit Us</h4>
              <p className="text-gray-600 dark:text-gray-400">wz-24, Chaukhandi, Vishnu Garden,
New Delhi, Delhi, 110018
India</p>
            </div>
            
            <div>
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Service Hours</h4>
              <p className="text-gray-600 dark:text-gray-400">Mon-Sat: 9 AM - 7 PM</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClockRepair;