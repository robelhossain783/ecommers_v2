"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Phone, Mail, MessageSquare, Send, CheckCircle2, MapPin, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <>
      <Header />

      <main style={{ minHeight: "80vh", background: "#fafafa" }}>
        <div className="contact-page-container">
          <div className="contact-header">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">
              Have questions, feedback, or need assistance? Reach out to us through any of the channels below, or send us a direct message.
            </p>
          </div>

          <div className="contact-grid">
            {/* Info Card */}
            <div className="contact-info-card">
              <h2 className="contact-info-section-title">Get in Touch</h2>

              <div className="contact-info-list">
                {/* Hotline */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap">
                    <Phone size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h4>Hotline Number</h4>
                    <a href="tel:01635275630">01635275630</a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap" style={{ background: "#e8f8f0", color: "#10b981" }}>
                    <FaWhatsapp size={22} />
                  </div>
                  <div className="contact-info-details">
                    <h4>WhatsApp</h4>
                    <a href="https://wa.me/+8801635275630" target="_blank" rel="noopener noreferrer">
                      +880 1635275630
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap">
                    <Mail size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h4>Email Address</h4>
                    <a href="mailto:buyfestbd@gmail.com">buyfestbd@gmail.com</a>
                  </div>
                </div>

                {/* Store Hours */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap">
                    <Clock size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h4>Support Hours</h4>
                    <p>Everyday: 9:00 AM - 10:00 PM</p>
                  </div>
                </div>

                {/* Location */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h4>Our Location</h4>
                    <p>Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="contact-social-wrap">
                <h4 className="contact-social-title">Follow Us</h4>
                <div className="contact-social-links">
                  <a href="https://wa.me/+8801635275630" className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp size={18} />
                  </a>
                  <a href="https://facebook.com/buyfestbd" className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                    <FaFacebookF size={16} />
                  </a>
                  <a href="https://instagram.com/buyfestbd" className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="contact-form-card">
              {!isSubmitted ? (
                <>
                  <h2 className="contact-form-title">Send a Message</h2>
                  <p className="contact-form-desc">
                    Fill out the form below and our customer support team will get back to you shortly.
                  </p>

                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="contact-form-row">
                      <div className="contact-input-group">
                        <label className="contact-input-label">Your Name *</label>
                        <input
                          type="text"
                          required
                          className="contact-input"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="contact-input-group">
                        <label className="contact-input-label">Email Address *</label>
                        <input
                          type="email"
                          required
                          className="contact-input"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="contact-form-row">
                      <div className="contact-input-group">
                        <label className="contact-input-label">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          className="contact-input"
                          placeholder="e.g. 01700000000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="contact-input-group">
                        <label className="contact-input-label">Subject *</label>
                        <input
                          type="text"
                          required
                          className="contact-input"
                          placeholder="How can we help?"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="contact-input-group">
                      <label className="contact-input-label">Message *</label>
                      <textarea
                        required
                        rows={5}
                        className="contact-input contact-textarea"
                        placeholder="Write your message details here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Sending Message...</>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="contact-success-card">
                  <div className="contact-success-icon">
                    <CheckCircle2 size={56} strokeWidth={1.5} />
                  </div>
                  <h2 className="contact-success-title">Thank You!</h2>
                  <p className="contact-success-text">
                    Your message has been successfully sent. Our support team will review your inquiry and contact you via email as soon as possible.
                  </p>
                  <button className="contact-reset-btn" onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
