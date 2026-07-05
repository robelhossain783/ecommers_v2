"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Briefcase, MapPin, Clock, Send, CheckCircle2, GraduationCap, Heart, Calendar, Trophy } from "lucide-react";

export default function CareersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const jobs = [
    {
      title: "Senior Frontend Developer (Next.js)",
      department: "Technology",
      type: "Full-Time",
      location: "Dhaka (Hybrid)",
    },
    {
      title: "E-Commerce Customer Specialist",
      department: "Customer Operations",
      type: "Full-Time",
      location: "Dhaka (On-site)",
    },
    {
      title: "Social Media Executive",
      department: "Marketing",
      type: "Full-Time",
      location: "Dhaka (On-site)",
    },
  ];

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
      setPosition("");
      setResumeUrl("");
      setCoverLetter("");
    }, 1200);
  };

  const handleApplyClick = (jobTitle: string) => {
    setPosition(jobTitle);
    const formElement = document.getElementById("apply-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Header />

      <main style={{ minHeight: "80vh", background: "#fafafa" }}>
        <div className="careers-container">
          {/* Hero Section */}
          <section className="careers-hero">
            <span className="careers-hero-badge">Careers</span>
            <h1>Join the BuyFest Team</h1>
            <p>
              Are you passionate about technology, gadgets, and building digital retail experiences?
              Come help us shape the future of e-commerce in Bangladesh.
            </p>
          </section>

          {/* Perks Section */}
          <section style={{ marginBottom: "80px" }}>
            <h2 className="about-section-title">Why Work With Us</h2>
            <div className="careers-perks-grid">
              <div className="careers-perk-card">
                <div className="careers-perk-icon">
                  <GraduationCap size={24} />
                </div>
                <h3>Growth &amp; Learning</h3>
                <p>Access to learning budgets, online course accounts, and peer mentorship to grow your skillset.</p>
              </div>

              <div className="careers-perk-card">
                <div className="careers-perk-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                  <Calendar size={24} />
                </div>
                <h3>Flexible Hours</h3>
                <p>Supportive work environment with hybrid options and flexible work hour schedules.</p>
              </div>

              <div className="careers-perk-card">
                <div className="careers-perk-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
                  <Heart size={24} />
                </div>
                <h3>Health Benefits</h3>
                <p>Subsidized medical checks and wellness allowance support programs for our core team.</p>
              </div>

              <div className="careers-perk-card">
                <div className="careers-perk-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
                  <Trophy size={24} />
                </div>
                <h3>Yearly Bonuses</h3>
                <p>Performance based bi-annual bonuses, festival bonuses, and recognition packages.</p>
              </div>
            </div>
          </section>

          {/* Job Openings */}
          <section className="careers-jobs-section">
            <h2 className="about-section-title">Current Openings</h2>
            <div className="careers-jobs-grid">
              {jobs.map((job) => (
                <div key={job.title} className="careers-job-card">
                  <div className="careers-job-info">
                    <h3>{job.title}</h3>
                    <div className="careers-job-meta">
                      <span className="careers-job-tag">
                        <Briefcase size={14} />
                        {job.department}
                      </span>
                      <span className="careers-job-tag">
                        <Clock size={14} />
                        {job.type}
                      </span>
                      <span className="careers-job-tag">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleApplyClick(job.title)} className="careers-apply-btn">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Application Form */}
          <section id="apply-form" className="careers-form-card" style={{ scrollMarginTop: "120px" }}>
            {!isSubmitted ? (
              <>
                <h2 className="careers-form-title">Send Your Application</h2>
                <p className="careers-form-desc">
                  Fill out the form details below. Alternatively, you can directly email your resume to <strong>careers@buyfestbd.com</strong>.
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-row">
                    <div className="contact-input-group">
                      <label className="contact-input-label">Full Name *</label>
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
                      <label className="contact-input-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="contact-input"
                        placeholder="e.g. 01700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="contact-input-group">
                      <label className="contact-input-label">Applying Position *</label>
                      <select
                        required
                        className="contact-input"
                        style={{ height: "46px" }}
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      >
                        <option value="">Select a position...</option>
                        {jobs.map((job) => (
                          <option key={job.title} value={job.title}>
                            {job.title}
                          </option>
                        ))}
                        <option value="General Application">General Application (Internship/Other)</option>
                      </select>
                    </div>
                  </div>

                  <div className="contact-input-group">
                    <label className="contact-input-label">Link to Resume (Google Drive, Dropbox, etc.) *</label>
                    <input
                      type="url"
                      required
                      className="contact-input"
                      placeholder="https://drive.google.com/..."
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                    />
                  </div>

                  <div className="contact-input-group">
                    <label className="contact-input-label">Cover Letter / Note (Optional)</label>
                    <textarea
                      rows={4}
                      className="contact-input contact-textarea"
                      placeholder="Tell us why you want to join our team..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Submitting Application...</>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Application</span>
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
                <h2 className="contact-success-title">Application Submitted!</h2>
                <p className="contact-success-text">
                  Thank you for applying. We have received your application successfully.
                  Our HR team will review your profile and reach out if you are shortlisted for the next rounds.
                </p>
                <button className="contact-reset-btn" onClick={() => setIsSubmitted(false)}>
                  Submit Another Application
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
