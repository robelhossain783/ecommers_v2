"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Phone, Mail, Send, CheckCircle2, MapPin, Clock,
  MessageSquare, User, AlertCircle, LogIn
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

const PHONE_REGEX = /^01\d{9}$/;

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function validate(form: { name: string; email: string; phone: string; subject: string; message: string }) {
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email format";
  if (form.phone.trim() && !PHONE_REGEX.test(form.phone.trim())) errors.phone = "Enter a valid 11-digit Bangladeshi number (e.g. 01700000000)";
  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.length > 1500) errors.message = "Maximum 1,500 characters allowed";
  else if (wordCount(form.message) > 250) errors.message = "Maximum 250 words allowed";
  return errors;
}

export default function ContactUsPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const errors = useMemo(() => validate(form), [form]);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const blur = (field: string) => () => setTouched((prev) => ({ ...prev, [field]: true }));



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginPrompt(false);

    setTouched({ name: true, email: true, phone: true, subject: true, message: true });

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) return;

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/api/feedback/customer-feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let msg = "Failed to send.";
        try { const d = await res.json(); msg = d.detail || d.error || Object.values(d).flat().join(", ") || msg; } catch {}
        alert(msg);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTouched({});
    } catch {
      alert("Network error. Please try again.");
      setIsSubmitting(false);
    }
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
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap"><Phone size={20} /></div>
                  <div className="contact-info-details">
                    <h4>Hotline Number</h4>
                    <a href="tel:01635275630">01635275630</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap" style={{ background: "#e8f8f0", color: "#10b981" }}>
                    <FaWhatsapp size={22} />
                  </div>
                  <div className="contact-info-details">
                    <h4>WhatsApp</h4>
                    <a href="https://wa.me/+8801635275630" target="_blank" rel="noopener noreferrer">+880 1635275630</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap"><Mail size={20} /></div>
                  <div className="contact-info-details">
                    <h4>Email Address</h4>
                    <a href="mailto:buyfestbd@gmail.com">buyfestbd@gmail.com</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap"><Clock size={20} /></div>
                  <div className="contact-info-details">
                    <h4>Support Hours</h4>
                    <p>Everyday: 9:00 AM - 10:00 PM</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon-wrap"><MapPin size={20} /></div>
                  <div className="contact-info-details">
                    <h4>Our Location</h4>
                    <p>Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              <div className="contact-social-wrap">
                <h4 className="contact-social-title">Follow Us</h4>
                <div className="contact-social-links">
                  <a href="https://wa.me/+8801635275630" className="contact-social-btn" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={18} /></a>
                  <a href="https://facebook.com/buyfestbd" className="contact-social-btn" target="_blank" rel="noopener noreferrer"><FaFacebookF size={16} /></a>
                  <a href="https://instagram.com/buyfestbd" className="contact-social-btn" target="_blank" rel="noopener noreferrer"><FaInstagram size={18} /></a>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="contact-form-card">
              {!isSubmitted ? (
                <>
                  <div className="contact-form-header">
                    <div className="contact-form-icon-wrap">
                      <MessageSquare size={22} />
                    </div>
                    <div>
                      <h2 className="contact-form-title">Send your feedback</h2>
                      <p className="contact-form-desc">
                        We'd love to hear from you. Fill out the form and we'll get back to you shortly.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="contact-form" noValidate>
                    <div className="contact-form-row">
                      <div className="contact-input-group">
                        <label className="contact-input-label">
                          <User size={13} />
                          Your Name <span className="contact-required">*</span>
                        </label>
                        <input type="text" required className={`contact-input${touched.name && errors.name ? " contact-input-error" : ""}`} placeholder="John Doe"
                          value={form.name} onChange={update("name")} onBlur={blur("name")} />
                        {touched.name && errors.name && <span className="contact-error-text">{errors.name}</span>}
                      </div>
                      <div className="contact-input-group">
                        <label className="contact-input-label">
                          <Mail size={13} />
                          Email Address <span className="contact-required">*</span>
                        </label>
                        <input type="email" required className={`contact-input${touched.email && errors.email ? " contact-input-error" : ""}`} placeholder="john@example.com"
                          value={form.email} onChange={update("email")} onBlur={blur("email")} />
                        {touched.email && errors.email && <span className="contact-error-text">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="contact-form-row">
                      <div className="contact-input-group">
                        <label className="contact-input-label">
                          <Phone size={13} />
                          Phone Number
                        </label>
                        <input type="tel" className={`contact-input${touched.phone && errors.phone ? " contact-input-error" : ""}`} placeholder="e.g. 01700000000"
                          value={form.phone} onChange={update("phone")} onBlur={blur("phone")} />
                        {touched.phone && errors.phone && <span className="contact-error-text">{errors.phone}</span>}
                      </div>
                      <div className="contact-input-group">
                        <label className="contact-input-label">
                          <AlertCircle size={13} />
                          Subject <span className="contact-required">*</span>
                        </label>
                        <input type="text" required className={`contact-input${touched.subject && errors.subject ? " contact-input-error" : ""}`} placeholder="How can we help?"
                          value={form.subject} onChange={update("subject")} onBlur={blur("subject")} />
                        {touched.subject && errors.subject && <span className="contact-error-text">{errors.subject}</span>}
                      </div>
                    </div>

                    <div className="contact-input-group">
                      <label className="contact-input-label">
                        <MessageSquare size={13} />
                        Message <span className="contact-required">*</span>
                      </label>
                      <textarea required rows={5} maxLength={1500} className={`contact-input contact-textarea${touched.message && errors.message ? " contact-input-error" : ""}`}
                        placeholder="Write your message details here..."
                        value={form.message} onChange={update("message")} onBlur={blur("message")} />
                      {touched.message && errors.message && <span className="contact-error-text">{errors.message}</span>}
                    </div>

                    <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="contact-btn-loading">
                          <span className="contact-spinner" />
                          Sending Message...
                        </span>
                      ) : (
                        <><Send size={16} /><span>Send Message</span></>
                      )}
                    </button>

                    {showLoginPrompt && (
                      <div className="contact-login-prompt">
                        <LogIn size={15} />
                        <span>Please <button type="button" className="contact-login-prompt-link" onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setTimeout(() => document.getElementById("account-login-btn")?.click(), 400);
                        }}>Sign in</button> to send your message.</span>
                      </div>
                    )}
                  </form>
                </>
              ) : (
                <div className="contact-success-card">
                  <div className="contact-success-icon"><CheckCircle2 size={56} strokeWidth={1.5} /></div>
                  <h2 className="contact-success-title">Thank You!</h2>
                  <p className="contact-success-text">
                    Your message has been successfully sent. Our support team will review your inquiry and contact you via email as soon as possible.
                  </p>
                  <button className="contact-reset-btn" onClick={() => setIsSubmitted(false)}>
                    <Send size={15} />
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
