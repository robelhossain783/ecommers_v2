"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import CategoriesSection from "@/components/sections/CategoriesSection";
import NewArrivals from "@/components/sections/NewArrivals";
import CategoryProductsSection from "@/components/sections/CategoryProductsSection";
import NewTrends from "@/components/sections/NewTrends";
import SeoSection from "@/components/sections/SeoSection";

export default function HomeClient() {
  return (
    <>
      <Header />

      <main className="home-main">
        <HeroBanner />
        <CategoriesSection />
        <NewArrivals />
        <CategoryProductsSection />
        <NewTrends />
        <SeoSection />
      </main>

      <Footer />
    </>
  );
}
