"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    { id: "intro", label: "1. Introduction" },
    { id: "accounts", label: "2. Accounts & Security" },
    { id: "shipping", label: "3. Shipping & Delivery" },
    { id: "returns", label: "4. Returns & Replacements" },
    { id: "warranty", label: "5. Warranty Policy" },
    { id: "privacy", label: "6. Privacy Policy" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 120;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <>
      <Header />

      <main style={{ minHeight: "80vh", background: "#fafafa" }}>
        <div className="terms-container">
          <div className="terms-header">
            <h1 className="terms-title">Terms & Conditions</h1>
            <p className="terms-subtitle">Last updated: July 2026 | Welcome to BuyFest Bangladesh</p>
          </div>

          <div className="terms-layout">
            {/* Sidebar Sticky Navigation */}
            <aside className="terms-sidebar">
              <h3 className="terms-sidebar-title">Sections</h3>
              <nav className="terms-nav">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => scrollToSection(e, sec.id)}
                    className={`terms-nav-item ${activeSection === sec.id ? "active" : ""}`}
                  >
                    {sec.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Content Panel */}
            <div className="terms-content">
              {/* Introduction */}
              <section id="intro" className="terms-section">
                <h2>1. Introduction</h2>
                <p>
                  Welcome to BuyFest (buyfestbd.com). These Terms &amp; Conditions govern your use of our website, services, and purchase of products. 
                  By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agreed to be bound by these terms.
                </p>
                <p>
                  We reserve the right to change, modify, add, or remove portions of these Terms at any time without prior notice. 
                  Please check these terms regularly for updates. Your continued use of the website following changes constitutes acceptance of those revisions.
                </p>
              </section>

              {/* Accounts & Security */}
              <section id="accounts" className="terms-section">
                <h2>2. Accounts &amp; Security</h2>
                <p>
                  To place orders or access specific features, you may need to register an account. You are solely responsible for maintaining the confidentiality of your account credentials (username, password) and for restricting access to your devices.
                </p>
                <p>
                  You agree to accept responsibility for all activities that occur under your account. If you believe your account security has been compromised, notify our support team immediately at buyfestbd@gmail.com.
                </p>
              </section>

              {/* Shipping & Delivery */}
              <section id="shipping" className="terms-section">
                <h2>3. Shipping &amp; Delivery</h2>
                <p>
                  We offer nationwide shipping within Bangladesh. Estimated delivery times are as follows:
                </p>
                <ul>
                  <li><strong>Inside Dhaka City:</strong> 24 to 48 Hours</li>
                  <li><strong>Outside Dhaka City:</strong> 2 to 4 Business Days</li>
                </ul>
                <p>
                  While we strive to meet these timelines, delivery may sometimes be delayed due to unforeseen events, political disruptions, or shipping courier limitations. 
                  Delivery charges are calculated at checkout based on your location.
                </p>
              </section>

              {/* Returns & Replacements */}
              <section id="returns" className="terms-section">
                <h2>4. Returns &amp; Replacements</h2>
                <p>
                  Our return policy allows you to request replacements or refunds under the following guidelines:
                </p>
                <ol>
                  <li>Requests must be raised within 3 days of receiving the package.</li>
                  <li>The product must be unused, unaltered, undamaged, and inside its original packaging with all tags, guides, and accessories intact.</li>
                  <li>Proof of purchase (invoice or order reference number) must be provided.</li>
                </ol>
                <p>
                  If you receive a defective, damaged, or incorrect item, contact our hotline (01635275630) immediately to initiate the replacement procedure free of cost.
                </p>
              </section>

              {/* Warranty Policy */}
              <section id="warranty" className="terms-section">
                <h2>5. Warranty Policy</h2>
                <p>
                  Various accessories and gadgets on BuyFest come with manufacturer warranties. 
                  The duration and conditions of the warranty depend solely on the manufacturer and will be explicitly mentioned on the product page or invoice.
                </p>
                <p>
                  Physical damage, liquid exposure, unauthorized repairs, or software tampering will instantly void any product warranties.
                </p>
              </section>

              {/* Privacy Policy */}
              <section id="privacy" className="terms-section">
                <h2>6. Privacy Policy</h2>
                <p>
                  Your privacy is highly important to us. Any personal details gathered during registration, checkout, or communication are strictly used to fulfill orders, verify accounts, and enhance your user experience.
                </p>
                <p>
                  We do not sell, rent, or lease your private information to third-party marketing companies. 
                  Secure payment gateways are utilized to protect online transactions.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
