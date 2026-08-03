"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, RotateCcw, Headset, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { bannerSlides as mockBanners } from "@/data";


const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://127.0.0.1:8000";

interface BannerSlide {
  id: number;
  title?: string;
  subtitle?: string;
  image: string;
  cta?: string;
  href: string;
  accent_color?: string;
  accentColor?: string;
}

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const autoPlayRef = useRef<(() => void) | null>(null);

  // Swipe gesture state variables
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum distance to trigger a swipe
  const minSwipeDistance = 50;

  // FETCH BANNER IMAGES
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/banner/list/`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Normalize properties to handle camelCase and snake_case
            const normalized = data.map((b: any) => ({
              id: b.id,
              image: b.image,
              href: b.href || "/",
              cta: b.cta || "Shop Now",
            }));
            setBannerSlides(normalized);
            return;
          }
        }
      } catch (error) {
        console.log("Banner fetch error:", error);
      }
      
      // Fallback to local mockup data if fetch fails or is empty
      const normalizedMock = mockBanners.map((b: any) => ({
        id: b.id,
        image: b.image,
        href: b.href || "/",
        cta: b.cta || "Shop Now",
      }));
      setBannerSlides(normalizedMock);
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    if (bannerSlides.length === 0) return;
    setActive((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    if (bannerSlides.length === 0) return;
    setActive((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Keep autoPlay callback updated
  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  // Auto-play timer
  useEffect(() => {
    if (bannerSlides.length <= 1) return;

    const play = () => {
      if (autoPlayRef.current) autoPlayRef.current();
    };

    const timer = setInterval(play, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (bannerSlides.length === 0) {
    return (
      <section className="hero-banner-container container">
        <div className="hero-banner-slider" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Loading banners...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-banner-section container">
      {/* ── Full-width Banner Slider ── */}
      <div 
        className="hero-banner-slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="hero-banner-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {bannerSlides.map((slide) => (
            <Link 
              href={slide.href} 
              key={slide.id} 
              className="hero-banner-slide"
            >
              <div className="hero-banner-image-wrapper">
                <Image
                  src={slide.image}
                  alt="Hero Banner Image"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                <div className="hero-banner-overlay" />
              </div>

              {/* Content Overlay */}
              <div className="hero-banner-content-box">
                <span className="hero-banner-tag">
                  <Sparkles size={11} /> Featured Store Collection
                </span>
                {slide.title && <h2 className="hero-banner-title">{slide.title}</h2>}
                {slide.subtitle && <p className="hero-banner-subtitle">{slide.subtitle}</p>}
                
                <div className="hero-banner-button">
                  <span>{slide.cta || "Shop Now"}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Dots */}
        {bannerSlides.length > 1 && (
          <div className="hero-banner-dots">
            {bannerSlides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(i);
                }}
                className={`hero-banner-dot ${i === active ? "active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Arrow Navigation */}
        {bannerSlides.length > 1 && (
          <>
            <button 
              className="hero-banner-arrow prev" 
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="hero-banner-arrow next" 
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>


      {/* ── Bottom E-Commerce Trust Value Pillars Bar ── */}
      <div className="hero-trust-bar">
        <div className="trust-pillar">
          <div className="trust-pillar-icon">
            <Truck size={20} />
          </div>
          <div className="trust-pillar-info">
            <span className="trust-pillar-title">Free Express Shipping</span>
            <span className="trust-pillar-sub">On orders over ৳999</span>
          </div>
        </div>

        <div className="trust-pillar">
          <div className="trust-pillar-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="trust-pillar-info">
            <span className="trust-pillar-title">100% Authentic Products</span>
            <span className="trust-pillar-sub">Official brand warranty</span>
          </div>
        </div>

        <div className="trust-pillar">
          <div className="trust-pillar-icon">
            <RotateCcw size={20} />
          </div>
          <div className="trust-pillar-info">
            <span className="trust-pillar-title">7-Day Replacement</span>
            <span className="trust-pillar-sub">Easy & fast exchange</span>
          </div>
        </div>

        <div className="trust-pillar">
          <div className="trust-pillar-icon">
            <Headset size={20} />
          </div>
          <div className="trust-pillar-info">
            <span className="trust-pillar-title">24/7 Dedicated Support</span>
            <span className="trust-pillar-sub">Call: 01635-275630</span>
          </div>
        </div>
      </div>

    </section>
  );
}