'use client';
import Header from '@/app/component/layout/Header'
import HeroSection from '@/app/component/layout/Herosection';
import Bento from './component/layout/Bento';
import Footer from './component/Footer';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Header />
      <HeroSection />
      <Bento />
      <Footer/>
    </div>
  );
}
