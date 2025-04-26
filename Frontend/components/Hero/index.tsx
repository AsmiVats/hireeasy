"use client";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="flex h-screen items-center justify-center">
        <main className="px-4 text-center">
          <h1 className="mb-6 font-extrabold" style={{fontSize:'45px', fontWeight:800}}>
            <span>Find </span>
            <span className="text-[#13B5CF]">Top Talent</span>
            <span> Faster Than Ever!</span>
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-gray-500">
            Join thousands of companies hiring smarter with Hireeasy
          </p>
          <button
            type="button"
            className="rounded-sm bg-[#13B5CF] px-8 py-3 text-white transition-colors hover:bg-[#009951]"
          >
            Search Talent
          </button>
        </main>
      </section>
    </>
  );
};

export default Hero;
