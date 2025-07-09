'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { QuoteProvider } from '../../contexts/QuoteContext';

const Contact: React.FC = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading('Submitting your message...');

    try {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{ ...formData }]);

      if (dbError) throw dbError;

      const emailPayload = {
        type: 'contact',
        data: {
          ...formData,
          submitted_at: new Date().toISOString(),
        },
      };

      const { error: emailError } = await supabase.functions.invoke(
        'send-email-notification',
        { body: emailPayload }
      );

      if (emailError) {
        console.error('Error sending email notification:', emailError);
        toast.error('Form saved, but email failed to send.', { id: toastId });
      } else {
        toast.success('Your message was sent successfully!', { id: toastId });
      }

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Something went wrong. Try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in your wholesale products. Please provide more information.`;
    const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const faqs = [
    {
      question: "What is your minimum order quantity (MOQ)?",
      answer: "Our MOQ varies by product category. Typically, it ranges from 20-50 pieces for watches and 10-25 pieces for clocks. Please check individual product pages for specific MOQ requirements."
    },
    {
      question: "Do you provide samples before bulk orders?",
      answer: "Yes, we provide samples for quality evaluation. Sample costs are adjustable against your first bulk order. Contact us for sample pricing and availability."
    },
    {
      question: "What are your payment terms?",
      answer: "We accept various payment methods including bank transfers, UPI for verified customers. For new customers, we typically require 50% advance payment."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery time depends on your location and order quantity. Typically, we deliver within 3-7 business days for in-stock items. Custom orders may take 10-15 days."
    },
    {
      question: "Do you offer warranty on wholesale products?",
      answer: "Yes, all our products come with manufacturer warranty. Warranty period varies by product type - typically 1-2 years for watches and 6 months to 1 year for clocks."
    },
    {
      question: "Can you customize packaging for our brand?",
      answer: "Yes, we offer custom packaging solutions for bulk orders. Minimum quantity and additional costs apply. Contact us to discuss your branding requirements."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <ThemeProvider>
      <AuthProvider>
        <QuoteProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Ready to start your wholesale journey? Get in touch with our team for personalized assistance and competitive pricing.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Get in Touch
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                          <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Visit Our Showroom
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                          wz-24, Chaukhandi, Vishnu Garden,
                            <br />
                          New Delhi, Delhi, 110018
                            <br />
                            India
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                          <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Call Us
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            +91 98219 64539<br />
                            +91 99113 51462
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                          <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Email Us
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            contact@shivwatches.com
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Business Hours
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Monday - Saturday: 9:00 AM - 7:00 PM<br />
                            Sunday: 10:00 AM - 5:00 PM
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Quick WhatsApp Contact
                      </button>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Find Us on Map
                    </h3>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.468966857147!2d77.0969113!3d28.645673600000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05999c846e7d%3A0xb793ffdf68bce36b!2sshiv%20watches!5e0!3m2!1sen!2sin!4v1750246878381!5m2!1sen!2sin"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Send us a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="wholesale-inquiry">Wholesale Inquiry</option>
                          <option value="bulk-order">Bulk Order</option>
                          <option value="partnership">Business Partnership</option>
                          <option value="product-info">Product Information</option>
                          <option value="support">Customer Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about your requirements, quantity needed, or any questions you have..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                          isSubmitted
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : isSubmitted ? (
                          <>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mr-2"
                            >
                              ✓
                            </motion.div>
                            Message Sent!
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-16"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Frequently Asked Questions
                  </h2>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {faq.question}
                          </span>
                          <span className={`transform transition-transform ${
                            openFaq === index ? 'rotate-180' : ''
                          }`}>
                            ▼
                          </span>
                        </button>
                        
                        {openFaq === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-4"
                          >
                            <p className="text-gray-600 dark:text-gray-400">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </QuoteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Contact;