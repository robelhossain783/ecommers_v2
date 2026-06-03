"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { searchProducts } from "@/lib/api";
import { Product } from "@/lib/backend_type";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount: propCartCount }: HeaderProps) {
  const { cartCount: contextCartCount } = useCart();
  const cartCount = propCartCount ?? contextCartCount;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Desktop search state (always-visible bar)
  const [desktopQuery, setDesktopQuery] = useState("");
  const [desktopResults, setDesktopResults] = useState<Product[]>([]);
  const [isDesktopSearching, setIsDesktopSearching] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const desktopDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile search state (icon → expand)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState<Product[]>([]);
  const [isMobileSearching, setIsMobileSearching] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const [categoriesList, setCategoriesList] = useState<any[]>([
    { name: "Gadgets", slug: "gadget", icon: "🔌" },
    { name: "Mobile Phone", slug: "mobile-phone", icon: "📱" },
    { name: "Laptop", slug: "laptops", icon: "💻" },
    { name: "Tablet", slug: "tablet", icon: "📟" },
    { name: "Smart Watch", slug: "smart-watch", icon: "⌚" },
    { name: "Wallet", slug: "wallet", icon: "💼" },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/categories/list/`);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((cat: any) => {
            const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
            return { name: cat.name, slug, icon: "" };
          });
          setCategoriesList(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch header categories:", err);
      }
    }
    loadCategories();
  }, []);

  // ── Desktop search debounce ──
  useEffect(() => {
    if (desktopDebounceRef.current) clearTimeout(desktopDebounceRef.current);
    if (!desktopQuery.trim()) {
      setDesktopResults([]);
      setShowDesktopDropdown(false);
      return;
    }
    setIsDesktopSearching(true);
    setShowDesktopDropdown(true);
    desktopDebounceRef.current = setTimeout(async () => {
      const results = await searchProducts(desktopQuery);
      setDesktopResults(results.slice(0, 8));
      setIsDesktopSearching(false);
    }, 350);
    return () => { if (desktopDebounceRef.current) clearTimeout(desktopDebounceRef.current); };
  }, [desktopQuery]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowDesktopDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Mobile search debounce ──
  useEffect(() => {
    if (mobileDebounceRef.current) clearTimeout(mobileDebounceRef.current);
    if (!mobileQuery.trim()) {
      setMobileResults([]);
      setIsMobileSearching(false);
      return;
    }
    setIsMobileSearching(true);
    mobileDebounceRef.current = setTimeout(async () => {
      const results = await searchProducts(mobileQuery);
      setMobileResults(results.slice(0, 8));
      setIsMobileSearching(false);
    }, 350);
    return () => { if (mobileDebounceRef.current) clearTimeout(mobileDebounceRef.current); };
  }, [mobileQuery]);

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setTimeout(() => mobileInputRef.current?.focus(), 60);
  };

  const closeMobileSearch = useCallback(() => {
    setIsMobileSearchOpen(false);
    setMobileQuery("");
    setMobileResults([]);
  }, []);

  // Close mobile search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { closeMobileSearch(); setShowDesktopDropdown(false); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeMobileSearch]);

  // Close mobile search on outside click
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const handler = (e: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) closeMobileSearch();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobileSearchOpen, closeMobileSearch]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">

          {/* ── Logo ── */}
          <a href="/" className="logo" aria-label="IZUMart Home">
            <span className="logo-text">
              <span className="logo-accent">IZU</span>Mart
            </span>
          </a>

          {/* ── DESKTOP: always-visible search bar ── */}
          <div className="header-desktop-search" ref={desktopSearchRef}>
            <div className={`hds-input-row ${showDesktopDropdown && desktopQuery ? "active" : ""}`}>
              <svg className="hds-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="hds-input"
                placeholder="Search products…"
                value={desktopQuery}
                onChange={(e) => setDesktopQuery(e.target.value)}
                onFocus={() => { if (desktopQuery.trim()) setShowDesktopDropdown(true); }}
                autoComplete="off"
                id="desktop-search-input"
              />
              {desktopQuery && (
                <button className="hds-clear" onClick={() => { setDesktopQuery(""); setShowDesktopDropdown(false); }} aria-label="Clear search">✕</button>
              )}
            </div>

            {showDesktopDropdown && desktopQuery.trim() && (
              <div className="header-search-dropdown">
                <SearchDropdownContent
                  isSearching={isDesktopSearching}
                  results={desktopResults}
                  query={desktopQuery}
                  onClose={() => { setShowDesktopDropdown(false); setDesktopQuery(""); }}
                />
              </div>
            )}
          </div>


          {/* ── Nav ── */}
          <nav className="header-nav">
            {/* Mobile search icon — inside nav so it appears right of logo on mobile */}
            <div className="header-mobile-search" ref={mobileSearchRef}>
              {!isMobileSearchOpen ? (
                <button className="header-search-icon-btn" onClick={openMobileSearch} aria-label="Open search" id="header-search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              ) : (
                <div className="header-search-expanded" id="header-search-expanded" ref={mobileSearchRef}>
                  <div className="header-search-input-row">
                    <svg className="header-search-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      ref={mobileInputRef}
                      type="text"
                      className="header-search-input"
                      placeholder="Search products…"
                      value={mobileQuery}
                      onChange={(e) => setMobileQuery(e.target.value)}
                      id="header-search-input"
                      autoComplete="off"
                    />
                    <button className="header-search-close-btn" onClick={closeMobileSearch} aria-label="Close search">✕</button>
                  </div>
                  {mobileQuery.trim() && (
                    <div className="header-search-dropdown">
                      <SearchDropdownContent
                        isSearching={isMobileSearching}
                        results={mobileResults}
                        query={mobileQuery}
                        onClose={closeMobileSearch}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href="/orders" className="nav-link">Orders</Link>
            <Link href="/cart" className="cart-btn" aria-label="Cart" style={{ textDecoration: "none" }}>
              🛒
              <span className="cart-count">{cartCount}</span>
            </Link>
          </nav>
        </div>

        {/* Sub navigation */}
        <div className="sub-nav">
          <div className="sub-nav-inner">
            <a href="/" className="sub-nav-link active">Home</a>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="sub-nav-link"
              style={{ background: "none", border: "none", cursor: "pointer", outline: "none" }}
            >
              Category ▾
            </button>
            <a href="/" className="sub-nav-link">Offer</a>
            <Link href="/orders" className="sub-nav-link">Orders</Link>
          </div>
        </div>
      </header>

      {/* Mobile search backdrop */}
      {isMobileSearchOpen && (
        <div className="header-search-backdrop" onClick={closeMobileSearch} />
      )}

      {/* Category Sidebar */}
      <div className={`category-sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)}>
        <div className={`category-sidebar-drawer ${isSidebarOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
          <div className="category-sidebar-header">
            <h3 className="category-sidebar-title"><span>📁</span> Categories</h3>
            <button className="category-sidebar-close" onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
          <div className="category-sidebar-body">
            <p className="category-sidebar-subtitle">Select a category to view items</p>
            <div className="category-sidebar-list">
              {categoriesList.map((cat) => (
                <Link key={cat.slug} href={`/category_product?category=${cat.slug}`} className="category-sidebar-item" onClick={() => setIsSidebarOpen(false)}>
                  <span className="category-sidebar-item-icon">{cat.icon}</span>
                  <span className="category-sidebar-item-name">{cat.name}</span>
                  <span className="category-sidebar-item-arrow">➔</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="category-sidebar-footer"><p>Premium E-commerce Experience</p></div>
        </div>
      </div>
    </>
  );
}

// ── Shared dropdown content component ──
function SearchDropdownContent({
  isSearching, results, query, onClose
}: {
  isSearching: boolean;
  results: Product[];
  query: string;
  onClose: () => void;
}) {
  if (isSearching) {
    return (
      <div className="header-search-loading">
        <span className="header-search-spinner" />
        Searching…
      </div>
    );
  }
  if (results.length === 0) {
    return <div className="header-search-empty">No products found for &quot;{query}&quot;</div>;
  }
  return (
    <>
      {results.map((product) => {
        const imgSrc = product.image
          ? product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`
          : null;
        const sellPrice = Number(product.sell_price);
        const regularPrice = Number(product.regular_price);
        const hasDiscount = regularPrice && regularPrice > sellPrice;
        return (
          <Link key={product.id} href={`/product/${product.slug}`} className="header-search-result-item" onClick={onClose}>
            <div className="header-search-result-img">
              {imgSrc ? (
                <Image src={imgSrc} alt={product.name} width={48} height={48} className="header-search-result-photo" unoptimized />
              ) : (
                <span style={{ fontSize: "22px" }}>📦</span>
              )}
            </div>
            <div className="header-search-result-info">
              <span className="header-search-result-name">{product.name}</span>
              <div className="header-search-result-prices">
                <span className="header-search-result-sell">৳{sellPrice}</span>
                {hasDiscount && <span className="header-search-result-regular">৳{regularPrice}</span>}
              </div>
            </div>
            <svg className="header-search-result-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        );
      })}
      <Link href={`/search?q=${encodeURIComponent(query)}`} className="header-search-view-all" onClick={onClose}>
        View all results for &quot;{query}&quot; →
      </Link>
    </>
  );
}
