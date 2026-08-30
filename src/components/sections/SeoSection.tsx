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
    </div >
  );
}