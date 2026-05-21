"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount: propCartCount }: HeaderProps) {
  const { cartCount: contextCartCount } = useCart();
  const cartCount = propCartCount ?? contextCartCount;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoriesList = [
    { name: "Gadgets", slug: "gadget", icon: "🔌" },
    { name: "Mobile Phone", slug: "mobile-phone", icon: "📱" },
    { name: "Laptop", slug: "laptops", icon: "💻" },
    { name: "Tablet", slug: "tablet", icon: "📟" },
    { name: "Smart Watch", slug: "smart-watch", icon: "⌚" },
    { name: "Wallet", slug: "wallet", icon: "💼" },
    { name: "Backpack", slug: "backpack", icon: "🎒" },
    { name: "AirPods", slug: "airpods", icon: "🎧" },
    { name: "Speakers", slug: "speakers", icon: "🔊" },
    { name: "Home Appliances", slug: "home-appliances", icon: "🏠" },
  ];

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* Logo */}
          <a href="/" className="logo">
            <span className="logo-text">
              <span>IZU</span>Mart.
            </span>
          </a>

          {/* Search */}
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search for phones, laptops, gadgets..."
            />
            <button className="search-btn">Search</button>
          </div>

          {/* Nav */}
          <nav className="header-nav">
            {/* <a href="/blog" className="nav-link">Blog</a> */}
            <Link href="/orders" className="nav-link">Orders</Link>
            {/* <a href="/offer" className="nav-link">Offers</a> */}
            {/* <a href="/compare" className="nav-link">Compare</a> */}

            <Link href="/cart" className="cart-btn" aria-label="Cart" style={{ textDecoration: "none" }}>
              🛒
              <span className="cart-count">{cartCount}</span>
            </Link>

            {/* <button className="signin-btn">Sign In</button> */}
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
            {/* <a href="/compare" className="sub-nav-link">Compare</a> */}
            <a href="/" className="sub-nav-link">Track Order</a>
            {/* <a href="/outlets" className="sub-nav-link">Outlets</a>
            <a href="/contact-us" className="sub-nav-link">Contact</a> */}
          </div>
        </div>
      </header>

      {/* LEFT-SIDE SLIDING DRAWER SIDEBAR */}
      <div className={`category-sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)}>
        <div
          className={`category-sidebar-drawer ${isSidebarOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="category-sidebar-header">
            <h3 className="category-sidebar-title">
              <span>📁</span> Categories
            </h3>
            <button className="category-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
              ✕
            </button>
          </div>

          {/* Drawer Content */}
          <div className="category-sidebar-body">
            <p className="category-sidebar-subtitle">Select a category to view items</p>
            <div className="category-sidebar-list">
              {categoriesList.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category_product?category=${cat.slug}`}
                  className="category-sidebar-item"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="category-sidebar-item-icon">{cat.icon}</span>
                  <span className="category-sidebar-item-name">{cat.name}</span>
                  <span className="category-sidebar-item-arrow">➔</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="category-sidebar-footer">
            <p>Premium E-commerce Experience</p>
          </div>
        </div>
      </div>
    </>
  );
}

