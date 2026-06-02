"use client";

// import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
// import TrustBadges from "@/components/sections/TrustBadges";
import CategoriesSection from "@/components/sections/CategoriesSection";
import NewTrends from "@/components/sections/NewTrends";
// import FeaturedProducts from "@/components/sections/FeaturedProducts";
// import PromoBanners from "@/components/sections/PromoBanners";
import NewArrivals from "@/components/sections/NewArrivals";
// import AcSection from "@/components/sections/AcSection";
// import TopBrandProducts from "@/components/sections/TopBrandProducts";
import SeoSection from "@/components/sections/SeoSection";

export default function HomeClient() {
  return (
    <>
      {/* <TopBar /> */}
      <Header />

      <main style={{ paddingTop: "24px", paddingBottom: "24px" }}>
        <HeroBanner />
        {/* <TrustBadges /> */}
        <CategoriesSection />
        <NewTrends />
        {/* <FeaturedProducts /> */}
        {/* <PromoBanners /> */}
        <NewArrivals />
        {/* <AcSection /> */}
        {/* <TopBrandProducts /> */}
        <SeoSection />
      </main>

      <Footer />
    </>
  );
}
