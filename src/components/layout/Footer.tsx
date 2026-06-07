import { FaFacebookF, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <span className="logo-text">
              <span className="logo-buy">BUY</span><span className="logo-fest">FEST</span>
            </span>

            <p className="footer-desc">
              Bangladesh&apos;s trusted e-commerce store for phones, gadgets &amp; accessories. <br />
              Authentic products, fast delivery.
            </p>
            <div className="footer-contact">
              <p><FaWhatsapp /> <a href="tel:01635275630">01635275630</a></p>
              <p>< FaEnvelope /> <a href="mailto:buyfestbd@gmail.com">buyfestbd@gmail.com</a></p>
              {/* <p>< FaEnvelope /> <a href="mailto:buyfestbd@gmail.com">buyfestbd@gmail.com</a></p> */}
            </div>
          </div>

          {/*Category*/}
          {/* <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              {["Gadget", "Waletts", "Speakers", "Phone", "Laptop", "Tablet"].map((item) => (
                <li key={item}><a href={`/category/phones-tablets/${item.toLowerCase()}`}>{item}</a></li>
              ))}
            </ul>
          </div> */}

          {/* Accessories
          <div className="footer-col">
            <h4>Mobile Accessories</h4>
            <ul className="footer-links">
              {["AirPods", "Earphone", "Neckband", "Headphone", "Phone Cooler", "Mobile Charger", "Smart Watch", "iPhone Cover", "Power Bank", "Wireless Charger"].map((item) => (
                <li key={item}><a href={`/category/${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a></li>
              ))}
            </ul>
          </div> */}

          {/* About */}
          <div className="footer-col">
            <h4>About Us</h4>
            <ul className="footer-links">
              {["About Us", "Corporate", "Order Tracking", "Careers", "Contact Us"].map((item) => (
                <li key={item}><a href={`/${item.toLowerCase().replace(/ \/ /g, "-").replace(/ /g, "-")}`}>{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Policy
          <div className="footer-col">
            <h4>Policy</h4>
            <ul className="footer-links">
              {["Privacy Policy", "Warranty Policy", "Exchange Policy", "Delivery Policy", "Pre-Order Policy", "Refund Policy", "Return Policy"].map((item) => (
                <li key={item}><a href={`/page/${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a></li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2026 BuyFest Bangladesh | All rights reserved</p>
          <div className="social-links">
            <a href="https://wa.me/+8801635275630" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
            <a href="https://facebook.com/buyfestbd" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com/buyfestbd" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* WhatsApp Float */}
      <a href="https://wa.me/+8801635275630" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <FaWhatsapp />
      </a>
    </footer >
  );
}
