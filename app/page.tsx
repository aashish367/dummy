'use client';

import React from 'react';
import Hero from '../components/home/Hero';
import ProductCategories from '../components/home/ProductCategories';
import TopProducts from '../components/home/TopProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import InquiryCTA from '../components/home/InquiryCTA';
import ClockRepairScheduling from '../components/home/clockrepairCTA';
import DealPopup from '@/components/home/popUp';
export default function Home() {
  return (
    <div>
      <Hero />
      <ProductCategories />
      <TopProducts />
      <ClockRepairScheduling/>
      <WhyChooseUs />
      <Testimonials />
      <InquiryCTA />
        <DealPopup />
    </div>
  );
}