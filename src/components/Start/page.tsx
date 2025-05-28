'use client';

import React from 'react';
import Footer from 'wxqryy/components/common/Footer';
import HomeHeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import MissionSection from './components/MissionSection';
import OfferingsSection from './components/OfferingsSection';
import RegistrationSection from './components/RegistrationSection';
import RecommendationSection from './components/RecommendationSection';
import FaqSection from './components/FaqSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0eded]">
      
      <main className="space-y-8 md:space-y-32">
        <HomeHeroSection />
        <HowItWorks />
        <MissionSection />
        <OfferingsSection />
        <RegistrationSection />
        <RecommendationSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}