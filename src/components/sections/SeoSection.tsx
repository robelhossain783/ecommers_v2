import { ShieldCheck, Truck, RotateCcw, CreditCard, Sparkles, PhoneCall, ShoppingBag } from "lucide-react";

export default function SeoSection() {
  return (
    <div className="container section-gap">
      <div className="seo-section">

        <div className="seo-header-banner">
          <div className="seo-brand-icon">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1>Ryor BD — Your Trusted Online Shop in Bangladesh</h1>
            <p className="seo-subtitle">
              Ryor BD is your go-to online store in Bangladesh for fashion, cosmetics, and everyday essentials.
              We offer a handpicked selection of hoodies, jerseys, T-shirts, jeans, cosmetics, and food items —
              all 100% authentic and sourced from trusted brands. Whether you&apos;re upgrading your wardrobe,
              refreshing your beauty routine, or stocking up on groceries, we deliver quality and convenience to your door.
            </p>
          </div>
        </div>

        <div className="seo-grid">
          <div className="seo-card">
            <div className="seo-card-header">
              <ShoppingBag className="seo-icon" size={20} />
              <h2>What We Sell</h2>
            </div>
            <p>
              <strong>Fashion & Apparel</strong> — Hoodies, jerseys, T-shirts, and jeans for men and women. Trendy styles,
              premium fabrics, and perfect fits for any season.<br />
              <strong>Cosmetics & Beauty</strong> — Skincare essentials, makeup, and personal care products from genuine brands.<br />
              <strong>Food & Grocery</strong> — Snacks, pantry staples, and specialty food items delivered fresh.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-header">
              <ShieldCheck className="seo-icon" size={20} />
              <h2>Why Choose Ryor BD</h2>
            </div>
            <p>
              We offer fast, trackable shipping to all 64 districts in Bangladesh. Orders are processed within 24 hours
              and delivered through reliable courier partners.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-header">
              <RotateCcw className="seo-icon" size={20} />
              <h2>Return & Exchange</h2>
            </div>
            <p>
              Damaged, defective, or incorrect items can be returned or exchanged within 7 days of delivery.
              Hassle-free support guaranteed.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-header">
              <CreditCard className="seo-icon" size={20} />
              <h2>Payment Methods</h2>
            </div>
            <p>
              Cash on Delivery (COD), bKash, Nagad, and secure online card payments. Safe and encrypted transactions.
            </p>
          </div>
        </div>

        <div className="seo-highlights-box">
          <div className="seo-card-header">
            <Sparkles className="seo-icon" size={20} />
            <h2>Why Choose Ryor BD</h2>
          </div>
          <div className="seo-pills-wrap">
            <span className="seo-pill">✓ 100% Authentic Products</span>
            <span className="seo-pill">✓ Affordable Prices & Deals</span>
            <span className="seo-pill">✓ Fast Nationwide Shipping</span>
            <span className="seo-pill">✓ Easy 7-Day Returns</span>
            <span className="seo-pill">✓ 24/7 Dedicated Support</span>
          </div>
        </div>

        <div className="seo-contact-footer">
          <PhoneCall size={18} className="seo-icon-phone" />
          <span>Need help? Call / WhatsApp: <strong>01635275630</strong> &nbsp;|&nbsp; Email: <strong>buyfestbd@gmail.com</strong></span>
        </div>

      </div>
    </div>
  );
}