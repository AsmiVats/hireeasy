"use client"
import { useEffect } from "react";
import Hero from "@/components/Hero";
import HeroBanner from "@/components/HomeBanner";



const onBack = () => {
  console.log("Back");
}

export default function Home() {

  useEffect(() => {
    sessionStorage.setItem('currentPage', 'home');
  }, []);
  return (
    <main>
      <HeroBanner />
      {/* <Hero /> */}
    </main>
  );
}
