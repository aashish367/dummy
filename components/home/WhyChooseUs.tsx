import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Truck, Award, Users, Clock, HeadphonesIcon as HeadphoneIcon } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'All products undergo rigorous quality checks before dispatch',
    color: 'text-amber-500'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across India with tracking',
    color: 'text-green-500'
  },
  {
    icon: Award,
    title: 'Best Prices',
    description: 'Competitive wholesale rates with transparent pricing',
    color: 'text-yellow-500'
  },
  {
    icon: Users,
    title: 'Bulk Orders',
    description: 'Flexible MOQ and custom packaging solutions',
    color: 'text-purple-500'
  },
  {
    icon: Clock,
    title: '15+ Years Experience',
    description: 'Industry expertise and trusted relationships',
    color: 'text-red-500'
  },
  {
    icon: HeadphoneIcon,
    title: '24/7 Support',
    description: 'Dedicated customer service for all your queries',
    color: 'text-teal-500'
  }
];

const WhyChooseUs: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Shiv Watches?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your success is our priority. Here's what makes us the preferred wholesale partner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-lg">
                <div className={`inline-flex p-3 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors mb-4`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-3xl font-bold text-amber-600 dark:text-amber-400">500+</h4>
              <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-green-600 dark:text-green-400">5000+</h4>
              <p className="text-gray-600 dark:text-gray-400">Products Delivered</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-purple-600 dark:text-purple-400">20+</h4>
              <p className="text-gray-600 dark:text-gray-400">Cities Served</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">99%</h4>
              <p className="text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;