"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShoppingCart, Zap, Percent, Clock, Truck, ShieldCheck } from "lucide-react";

const offers = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    originalPrice: 2990,
    discountedPrice: 1790,
    discount: 40,
    color: "#4f46e5",
    emoji: "🎧",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    category: "Wearables",
    originalPrice: 4990,
    discountedPrice: 2990,
    discount: 40,
    color: "#0891b2",
    emoji: "⌚",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    category: "Electronics",
    originalPrice: 1990,
    discountedPrice: 990,
    discount: 50,
    color: "#7c3aed",
    emoji: "🔊",
  },
  {
    id: 4,
    name: "Portable Power Bank",
    category: "Accessories",
    originalPrice: 1490,
    discountedPrice: 890,
    discount: 40,
    color: "#059669",
    emoji: "🔋",
  },
  {
    id: 5,
    name: "Leather Wallet",
    category: "Fashion",
    originalPrice: 1290,
    discountedPrice: 690,
    discount: 46,
    color: "#d97706",
    emoji: "👛",
  },
  {
    id: 6,
    name: "Sunglasses",
    category: "Fashion",
    originalPrice: 990,
    discountedPrice: 490,
    discount: 50,
    color: "#1e293b",
    emoji: "🕶️",
  },
  {
    id: 7,
    name: "Fitness Tracker",
    category: "Wearables",
    originalPrice: 2490,
    discountedPrice: 1490,
    discount: 40,
    color: "#dc2626",
    emoji: "🏃",
  },
  {
    id: 8,
    name: "USB-C Hub 7-in-1",
    category: "Accessories",
    originalPrice: 1790,
    discountedPrice: 990,
    discount: 44,
    color: "#2563eb",
    emoji: "🔌",
  },
];

const benefits = [
  { icon: <Truck size={22} />, label: "Free Shipping", desc: "On orders over ৳999" },
  { icon: <ShieldCheck size={22} />, label: "100% Authentic", desc: "Genuine products guaranteed" },
  { icon: <Clock size={22} />, label: "Limited Time", desc: "Offers end soon" },
  { icon: <Percent size={22} />, label: "Best Prices", desc: "Price match promise" },
];

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

export default function OfferPage() {
  const hasOffers = offers.length > 0;

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <section className="offer-hero">
        <div className="offer-hero-bg-pattern" />
        <div className="offer-hero-content">
          <span className="offer-hero-badge">Limited Time Deals</span>
          <h1 className="offer-hero-title">Special Offers Just For You</h1>
          <p className="offer-hero-subtitle">
            Grab the hottest deals on top brands before they are gone. Unbeatable prices, premium quality.
          </p>
          <div className="offer-hero-actions">
            <a href="#offers-grid" className="offer-hero-btn-primary">
              <Zap size={16} />
              Shop Deals Now
            </a>
            <a href="#benefits" className="offer-hero-btn-outline">
              Learn More
            </a>
          </div>
        </div>
        <div className="offer-hero-stats">
          <div className="offer-hero-stat">
            <span className="offer-hero-stat-value">Up to 50%</span>
            <span className="offer-hero-stat-label">Discount</span>
          </div>
          <div className="offer-hero-stat">
            <span className="offer-hero-stat-value">500+</span>
            <span className="offer-hero-stat-label">Products</span>
          </div>
          <div className="offer-hero-stat">
            <span className="offer-hero-stat-value">10K+</span>
            <span className="offer-hero-stat-label">Happy Customers</span>
          </div>
        </div>
      </section>

      <div className="offer-page" id="offers-grid">
        <div className="offer-section-header">
          <h2 className="offer-section-title">Flash Deals</h2>
          <p className="offer-section-desc">Handpicked products at the best prices — limited stock available</p>
        </div>

        {hasOffers ? (
          <div className="offer-grid">
            {offers.map((product) => (
              <div className="offer-card" key={product.id}>
                <div className="offer-card-badge">-{product.discount}%</div>
                <div className="offer-card-img" style={{ background: `linear-gradient(135deg, ${product.color}15, ${product.color}08)` }}>
                  <span className="offer-card-img-emoji">{product.emoji}</span>
                  <span className="offer-card-img-label">{product.category}</span>
                </div>
                <div className="offer-card-body">
                  <h3 className="offer-card-name">{product.name}</h3>
                  <div className="offer-card-prices">
                    <span className="offer-card-original">{formatPrice(product.originalPrice)}</span>
                    <span className="offer-card-discounted">{formatPrice(product.discountedPrice)}</span>
                  </div>
                  <div className="offer-card-save">
                    <Percent size={12} />
                    Save {formatPrice(product.originalPrice - product.discountedPrice)}
                  </div>
                  <button type="button" className="offer-card-btn">
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="offer-empty">
            <div className="offer-empty-icon">🎉</div>
            <h3 className="offer-empty-title">No Offers Available Right Now</h3>
            <p className="offer-empty-desc">
              We don&apos;t have any active offers at the moment. Please check back later or browse our latest products.
            </p>
            <a href="/" className="offer-empty-btn">Browse Products</a>
          </div>
        )}
      </div>

      {/* Benefits Strip */}
      <section className="offer-benefits" id="benefits">
        <div className="offer-benefits-inner">
          {benefits.map((benefit, i) => (
            <div className="offer-benefit-item" key={i}>
              <div className="offer-benefit-icon">{benefit.icon}</div>
              <div>
                <strong>{benefit.label}</strong>
                <span>{benefit.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="offer-cta">
        <div className="offer-cta-content">
          <h2 className="offer-cta-title">Don&apos;t Miss Out on These Deals!</h2>
          <p className="offer-cta-desc">
            Subscribe to our newsletter and be the first to know about exclusive offers and new arrivals.
          </p>
          <form className="offer-cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="offer-cta-input" required />
            <button type="submit" className="offer-cta-btn">Subscribe</button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
