export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <span className="logo-text">
              <span style={{ color: "var(--primary)" }}>Eco</span>Mart
            </span>
            <p className="footer-desc">
              Bangladesh&apos;s trusted tech e-commerce store for phones, gadgets &amp; accessories. Authentic products, fast delivery.
            </p>
            <div className="footer-contact">
              <p>📞 <a href="tel:09678148148">01607005806</a></p>
              <p>✉️ <a href="mailto:contact@applegadgetsbd.com">contact@ecomartbd.com</a></p>
            </div>
          </div>

          {/* Mobile Phones */}
          <div className="footer-col">
            <h4>Mobile Phones</h4>
            <ul className="footer-links">
              {["iPhone", "Samsung", "Google", "Motorola", "Xiaomi", "iQOO", "OnePlus", "Vivo", "Infinix", "Tablet"].map((item) => (
                <li key={item}><a href={`/category/phones-tablets/${item.toLowerCase()}`}>{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Accessories */}
          <div className="footer-col">
            <h4>Mobile Accessories</h4>
            <ul className="footer-links">
              {["AirPods", "Earphone", "Neckband", "Headphone", "Phone Cooler", "Mobile Charger", "Smart Watch", "iPhone Cover", "Power Bank", "Wireless Charger"].map((item) => (
                <li key={item}><a href={`/category/${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a></li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="footer-col">
            <h4>About Us</h4>
            <ul className="footer-links">
              {["About Us", "Corporate", "Order Tracking", "Blog", "Press Coverage", "Careers", "Complain / Advice", "Contact Us", "FAQs"].map((item) => (
                <li key={item}><a href={`/${item.toLowerCase().replace(/ \/ /g, "-").replace(/ /g, "-")}`}>{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div className="footer-col">
            <h4>Policy</h4>
            <ul className="footer-links">
              {["Privacy Policy", "EMI and Payment Policy", "Warranty Policy", "Exchange Policy", "Delivery Policy", "Pre-Order Policy", "Refund Policy", "Return Policy"].map((item) => (
                <li key={item}><a href={`/page/${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2026 EcoMart Bangladesh | All rights reserved</p>
          <div className="social-links">
            <a href="https://wa.me/+8801607005806" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
            <a href="https://facebook.com/eco_mart" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
            <a href="https://instagram.com/eco_mart" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      {/* WhatsApp Float */}
      <a href="https://wa.me/+8801607005806" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        💬
      </a>
    </footer>
  );
}
