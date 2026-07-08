"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import CategoriesSection from "@/components/sections/CategoriesSection";
import NewTrends from "@/components/sections/NewTrends";
import NewArrivals from "@/components/sections/NewArrivals";
import SeoSection from "@/components/sections/SeoSection";
import NotificationBanner from "./sections/NotificationBanner";

export default function HomeClient() {
  return (
    <>
      <Header />

      <main className="home-main">
        <HeroBanner />
        <CategoriesSection />
        <NewArrivals />
        <NewTrends />
        <NotificationBanner />
        <SeoSection />
      </main>

      <Footer />
    </>
  );
}
