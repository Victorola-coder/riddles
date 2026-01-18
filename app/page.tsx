'use client';

import { Navbar } from './components/landing/navbar';
import { Hero } from './components/landing/hero';
import { Footer } from './components/landing/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden flex flex-col">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
