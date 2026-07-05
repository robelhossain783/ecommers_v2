"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Truck, Headphones, Heart, Users, Award, Sparkles } from "lucide-react";

export default function AboutUsPage() {
  return (
    <>
      <Header />

      <main style={{ minHeight: "80vh", background: "#fafafa" }}>
        <div className="about-container">
          {/* Hero Section */}
          <section className="about-hero">
            <span className="about-hero-badge">Who We Are</span>
            <h1>Bangladesh&apos;s Trusted Gadget Partner</h1>
            <p>
              Welcome to BuyFest, your ultimate destination for authentic smartphones, premium gadgets, and mobile accessories. 
              We aim to redefine your tech shopping experience with high-quality products, rapid delivery, and outstanding customer service.
            </p>
          </section>

          {/* Stats Section */}
          <section className="about-stats">
            <div className="about-stat-card">
              <span className="about-stat-number">50K+</span>
              <span className="about-stat-label">Happy Customers</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-number">100%</span>
              <span className="about-stat-label">Authentic Products</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-number">3+ Years</span>
              <span className="about-stat-label">Industry Presence</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-number">24/7</span>
              <span className="about-stat-label">Customer Support</span>
            </div>
          </section>

          {/* Story Section */}
          <section className="about-story-section">
            <div className="about-story-content">
              <h2>Our Journey</h2>
              <p>
                Founded in Dhaka, BuyFest started with a simple vision: to bridge the gap between global technology innovations and Bangladeshi tech enthusiasts. 
                We observed how difficult it was for consumers to find genuine, authorized accessories and devices at reasonable prices.
              </p>
              <p>
                Today, we have grown into one of the country&apos;s most trusted e-commerce brands for gadgets. 
                Whether you are searching for high-end ear buds, rugged phone cases, fast-chargers, or smart wearable devices, we curate our catalogue with care to ensure you get nothing but the best.
              </p>
            </div>
            <div className="about-story-img-container" style={{ background: "linear-gradient(135deg, #2f64cf 0%, #e8320a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "#fff", textAlign: "center", padding: "40px" }}>
                <Sparkles size={64} style={{ marginBottom: "16px", animation: "bounce 3s infinite" }} />
                <h3 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px 0" }}>BuyFest BD</h3>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Empowering Tech Lifestyles</p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="about-section-title">Our Core Values</h2>
            <div className="about-values-grid">
              <div className="about-value-card">
                <div className="about-value-icon">
                  <ShieldCheck size={26} />
                </div>
                <h3>100% Originality</h3>
                <p>We source products directly from manufacturers and official distributors to guarantee authentic quality without compromise.</p>
              </div>

              <div className="about-value-card">
                <div className="about-value-icon" style={{ background: "#e8f2fc", color: "#2f64cf" }}>
                  <Truck size={26} />
                </div>
                <h3>Express Delivery</h3>
                <p>We value your time. We offer rapid nationwide shipping with special same-day or next-day delivery options within Dhaka city.</p>
              </div>

              <div className="about-value-card">
                <div className="about-value-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
                  <Headphones size={26} />
                </div>
                <h3>Customer Loyalty First</h3>
                <p>Our relations do not end at the checkout counter. We offer comprehensive warranty coverage and highly responsive post-sales support.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
