import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Slideshow from '@/components/Slideshow';
import SearchBar from '@/components/SearchBar';
import SchemeStats from '@/components/SchemeStats';
import EligibilityBanner from '@/components/EligibilityBanner';
import CategoryGrid from '@/components/CategoryGrid';
import NewsSection from '@/components/NewsSection';
import SpotlightSchemes from '@/components/SpotlightSchemes';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Slideshow />
        <SearchBar />
        <SchemeStats />
        <EligibilityBanner />
        <CategoryGrid />
        <SpotlightSchemes />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
