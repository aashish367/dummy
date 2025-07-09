"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Clock,
  Users,
  Award,
  Target,
  Heart,
  Truck,
  Shield,
  Star,
} from "lucide-react";

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const milestones = [
    {
      year: "2009",
      title: "Company Founded",
      description:
        "Started as a small watch retail and repair business in Delhi",
    },
    {
      year: "2022",
      title: "Wholesale Expansion",
      description: "Expanded into wholesale market of wall clocks",
    },
    {
      year: "2023",
      title: "Digital Transformation",
      description: "Launched online platform for seamless wholesale experience",
    },
    {
      year: "2024",
      title: "Product Diversification",
      description: "Added table clocks and home appliances to our portfolio",
    },
    {
      year: "2025",
      title: "1000+ Partners",
      description: "Reached milestone of 1000+ business partners across India",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Every decision we make is centered around our customers' success and satisfaction.",
      color: "text-red-500",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "We maintain the highest standards of quality in every product we offer.",
      color: "text-orange-500",
    },
    {
      icon: Users,
      title: "Partnership",
      description:
        "We believe in building long-term partnerships based on trust and mutual growth.",
      color: "text-green-500",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "Continuously evolving to meet changing market demands and customer needs.",
      color: "text-purple-500",
    },
  ];


  const stats = [
    { number: "15+", label: "Years Experience", icon: Clock },
    { number: "5000+", label: "Happy Customers", icon: Users },
    { number: "1M+", label: "Products Delivered", icon: Truck },
    { number: "99%", label: "Satisfaction Rate", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-800 dark:to-yellow-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our Story of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Excellence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              From humble beginnings to becoming India's trusted wholesale
              partner - discover the journey that built Shiv Watches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Driving our commitment to excellence and customer success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg mr-4">
                  <Target className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To empower businesses across India by providing high-quality
                wholesale products at competitive prices, backed by exceptional
                service and reliable partnerships. We strive to be the bridge
                between manufacturers and retailers, creating value for all
                stakeholders in the supply chain.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg mr-4">
                  <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To become India's most trusted and preferred wholesale partner,
                known for innovation, reliability, and customer-centric
                approach. We envision a future where every business, regardless
                of size, has access to quality products and growth opportunities
                through our platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Milestones that shaped our growth and success over the years
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200 dark:bg-orange-800"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8"
                    }`}
                  >
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-orange-600 dark:bg-orange-400 rounded-full border-4 border-white dark:border-gray-800"></div>

                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
                    <value.icon className={`h-8 w-8 ${value.color}`} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-800 dark:to-yellow-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Businesses Trust Us
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Building lasting partnerships through reliability and excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center text-white"
            >
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Quality</h3>
              <p className="text-orange-100">
                Every product undergoes strict quality checks before reaching
                our customers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center text-white"
            >
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reliable Delivery</h3>
              <p className="text-orange-100">
                On-time delivery with real-time tracking across all major cities
                in India
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center text-white"
            >
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dedicated Support</h3>
              <p className="text-orange-100">
                24/7 customer support to help you grow your business
                successfully
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
