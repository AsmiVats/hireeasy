'use client';
import Header from '@/app/component/layout/Header'
import HeroSection from '@/app/component/layout/Herosection';
import Bento from './component/layout/Bento';
import Features from './component/layout/Features';
import Team from './component/layout/Team';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Header />
      <HeroSection />
      <Bento />
      <Features />
      <Team />
    </div>
  );
}
