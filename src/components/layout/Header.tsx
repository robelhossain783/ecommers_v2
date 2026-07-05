"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  List,
  Home,
  Menu as MenuIcon,
  ShoppingCart,
  ClipboardList,
  User,
  X,
  ChevronRight,
  Apple,
  Egg,
  Fish,
  Croissant,
  Snowflake,
  Cookie,
  CupSoda,
  GlassWater,
  Sparkles,
  ChefHat,
  Baby,
  Heart,
  Smile,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  Wallet,
  Shirt,
  Drumstick,
  Cpu,
  FolderOpen,
  Coffee,
  Utensils,
  TicketPercent
} from "lucide-react";
import { searchProducts } from "@/lib/api";
import { Product } from "@/lib/backend_type";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

interface HeaderProps {
  cartCount?: number;
}

function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("fruit") || s.includes("veg")) return <Apple size={20} strokeWidth={1.5} />;
  if (s.includes("dairy") || s.includes("egg")) return <Egg size={20} strokeWidth={1.5} />;
  if (s.includes("meat") || s.includes("poultry") || s.includes("chicken")) return <Drumstick size={20} strokeWidth={1.5} />;
  if (s.includes("seafood") || s.includes("fish")) return <Fish size={20} strokeWidth={1.5} />;
  if (s.includes("bakery") || s.includes("bread") || s.includes("bake")) return <Croissant size={20} strokeWidth={1.5} />;
  if (s.includes("canned")) return <FolderOpen size={20} strokeWidth={1.5} />;
  if (s.includes("frozen")) return <Snowflake size={20} strokeWidth={1.5} />;
  if (s.includes("pasta") || s.includes("rice")) return <Utensils size={20} strokeWidth={1.5} />;
  if (s.includes("breakfast") || s.includes("coffee")) return <Coffee size={20} strokeWidth={1.5} />;
  if (s.includes("snack") || s.includes("chip") || s.includes("cookie")) return <Cookie size={20} strokeWidth={1.5} />;
  if (s.includes("beverage") || s.includes("drink")) return <CupSoda size={20} strokeWidth={1.5} />;
  if (s.includes("condiment") || s.includes("sauce")) return <GlassWater size={20} strokeWidth={1.5} />;
  if (s.includes("spice") || s.includes("season")) return <Sparkles size={20} strokeWidth={1.5} />;
  if (s.includes("bakeware") || s.includes("baking") || s.includes("supply")) return <ChefHat size={20} strokeWidth={1.5} />;
  if (s.includes("baby") || s.includes("kids") || s.includes("child")) return <Baby size={20} strokeWidth={1.5} />;
  if (s.includes("health") || s.includes("wellness")) return <Heart size={20} strokeWidth={1.5} />;
  if (s.includes("household") || s.includes("house")) return <Home size={20} strokeWidth={1.5} />;
  if (s.includes("personal") || s.includes("care")) return <Smile size={20} strokeWidth={1.5} />;
  if (s.includes("pet") || s.includes("dog") || s.includes("cat")) return <Sparkles size={20} strokeWidth={1.5} />;

  // Tech / default
  if (s.includes("wallet")) return <Wallet size={20} strokeWidth={1.5} />;
  if (s.includes("gadget")) return <Cpu size={20} strokeWidth={1.5} />;
  if (s.includes("mobile") || s.includes("phone")) return <Smartphone size={20} strokeWidth={1.5} />;
  if (s.includes("laptop")) return <Laptop size={20} strokeWidth={1.5} />;
  if (s.includes("tablet")) return <Tablet size={20} strokeWidth={1.5} />;
  if (s.includes("watch")) return <Watch size={20} strokeWidth={1.5} />;
  if (s.includes("fashion") || s.includes("fasion") || s.includes("cloth")) return <Shirt size={20} strokeWidth={1.5} />;

  return <FolderOpen size={20} strokeWidth={1.5} />;
}

export default function Header({ cartCount: propCartCount }: HeaderProps) {
  const { cartCount: contextCartCount } = useCart();
  const { user, login, register, logout } = useAuth();
  const cartCount = propCartCount ?? contextCartCount;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoriesSidebarExpanded, setIsCategoriesSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mobile states & refs
  const pathname = usePathname();
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  const mbUserMenuRef = useRef<HTMLDivElement>(null);

  // Login form
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");

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
            return { name: cat.name, slug, image: cat.image, icon: "" };
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
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { closeMobileSearch(); setShowDesktopDropdown(false); setIsAuthModalOpen(false); } };
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

  // Close user dropdown menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUserMenu]);

  // Close mobile user dropdown on outside click
  useEffect(() => {
    if (!showMobileUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (mbUserMenuRef.current && !mbUserMenuRef.current.contains(e.target as Node)) {
        setShowMobileUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMobileUserMenu]);

  // Reset auth forms when modal closes
  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthError("");
    setAuthSuccess("");
    setLoginUsername("");
    setLoginPassword("");
    setRegFirstName("");
    setRegLastName("");
    setRegEmail("");
    setRegUsername("");
    setRegPassword("");
    setRegPassword2("");
    setIsAuthModalOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const result = await login(loginUsername, loginPassword);
    setAuthLoading(false);
    if (result.success) {
      setIsAuthModalOpen(false);
    } else {
      setAuthError(result.error || "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (regPassword !== regPassword2) {
      setAuthError("Passwords do not match");
      return;
    }
    setAuthLoading(true);
    const result = await register({
      username: regUsername,
      password: regPassword,
      email: regEmail,
      first_name: regFirstName,
      last_name: regLastName,
    });
    setAuthLoading(false);
    if (result.success) {
      setIsAuthModalOpen(false);
    } else {
      setAuthError(result.error || "Registration failed");
    }
  };

  const getInitials = () => {
    if (!user) return "";
    if (user.first_name && user.first_name.trim().length > 0) return user.first_name[0].toUpperCase();
    if (user.username && user.username.trim().length > 0) return user.username[0].toUpperCase();
    if (user.email && user.email.trim().length > 0) return user.email[0].toUpperCase();
    return "U";
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">

          <div className="header-left">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="category-menu-btn"
              aria-label="Open Category Sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* ── Logo ── */}
            <a href="/" className="logo" aria-label="BuyFest Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/official_logo_3.png"
                alt="BuyFest Logo"
                className="logo-img"
              />
            </a>
          </div>


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

            {/* ── Account Button ── */}
            {mounted && (user ? (
              <div className="account-btn-wrap" ref={userMenuRef}>
                <button
                  className="account-avatar-btn"
                  onClick={() => setShowUserMenu(v => !v)}
                  aria-label="Account menu"
                  id="account-avatar-btn"
                  style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}${user.avatar}`}
                      alt="User Avatar"
                      className="account-avatar-img"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span className="account-avatar-initials">{getInitials()}</span>
                  )}
                </button>
                {showUserMenu && (
                  <div className="account-dropdown">
                    <div className="account-dropdown-header">
                      <div className="account-dropdown-avatar" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {user.avatar ? (
                          <img
                            src={user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}${user.avatar}`}
                            alt="User Avatar"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          getInitials()
                        )}
                      </div>
                      <div>
                        <div className="account-dropdown-name">
                          {user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
                        </div>
                        <div className="account-dropdown-email">{user.email || user.username}</div>
                      </div>
                    </div>
                    <div className="account-dropdown-divider" />
                    <Link href="/profile" className="account-dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      My Profile
                    </Link>
                    <Link href="/orders" className="account-dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                      My Orders
                    </Link>
                    <button className="account-dropdown-item account-logout-btn" onClick={() => { logout(); setShowUserMenu(false); }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="account-login-btn"
                onClick={() => openAuthModal("login")}
                aria-label="Login / Register"
                id="account-login-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            ))}

            <Link href="/cart" className="cart-btn" aria-label="Cart" style={{ textDecoration: "none" }}>
              <ShoppingCart size={20} strokeWidth={1.75} />
              <span className="cart-count">{cartCount}</span>
            </Link>
          </nav>
        </div>

        {/* Sub navigation */}
        <div className="sub-nav">
          <div className="sub-nav-inner">
            <a href="/" className="sub-nav-link active">Home</a>
            <div className="sub-nav-dropdown">
              <span className="sub-nav-link">Category ▾</span>
              <div className="sub-nav-dropdown-menu">
                {categoriesList.map((cat) => (
                  <Link key={cat.slug} href={`/category_product?category=${cat.slug}`} className="sub-nav-dropdown-item">
                    <span className="cat-icon">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          style={{ width: "16px", height: "16px", objectFit: "contain", verticalAlign: "middle" }}
                        />
                      ) : (
                        getCategoryIcon(cat.slug)
                      )}
                    </span>
                    <span className="cat-name">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/offer" className="sub-nav-link">Offer</Link>
            <Link href="/orders" className="sub-nav-link">Orders</Link>
            <Link href="/contact-us" className="sub-nav-link">Contact Us</Link>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation */}
      {mounted && (
        <div className="mobile-bottom-nav">
          <Link href="/" className={`mb-nav-item ${pathname === "/" ? "active" : ""}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(true)} className="mb-nav-item">
            <MenuIcon size={20} />
            <span>Menu</span>
          </button>
          <Link href="/cart" className={`mb-nav-item ${pathname === "/cart" ? "active" : ""}`}>
            <div className="mb-cart-icon-wrap">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="mb-cart-count">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </Link>
          <Link href="/orders" className={`mb-nav-item ${pathname === "/orders" ? "active" : ""}`}>
            <ClipboardList size={20} />
            <span>Orders</span>
          </Link>
          {user ? (
            <div className="mb-account-wrap" ref={mbUserMenuRef}>
              <button onClick={() => setShowMobileUserMenu(v => !v)} className={`mb-nav-item ${showMobileUserMenu ? "active" : ""}`}>
                <User size={20} />
                <span>Account</span>
              </button>
              {showMobileUserMenu && (
                <div className="mb-account-dropdown">
                  <div className="mb-account-dropdown-header">
                    <span className="mb-avatar-initials" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {user.avatar ? (
                        <img
                          src={user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}${user.avatar}`}
                          alt="User Avatar"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        getInitials()
                      )}
                    </span>
                    <div className="mb-user-info">
                      <div className="mb-user-name">{user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}</div>
                      <div className="mb-user-email">{user.email || user.username}</div>
                    </div>
                  </div>
                  <div className="mb-dropdown-divider" />
                  <Link href="/profile" className="mb-dropdown-item" onClick={() => setShowMobileUserMenu(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    My Profile
                  </Link>
                  <Link href="/orders" className="mb-dropdown-item" onClick={() => setShowMobileUserMenu(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                    My Orders
                  </Link>
                  <button className="mb-dropdown-item mb-logout-btn" onClick={() => { logout(); setShowMobileUserMenu(false); }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => openAuthModal("login")} className="mb-nav-item">
              <User size={20} />
              <span>Account</span>
            </button>
          )}
        </div>
      )}

      {/* Mobile search backdrop */}
      {isMobileSearchOpen && (
        <div className="header-search-backdrop" onClick={closeMobileSearch} />
      )}

      {/* Category/Menu Sidebar */}
      <div className={`category-sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)}>
        <div className={`category-sidebar-drawer ${isSidebarOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
          {/* ── Sidebar Header: User/Login Banner ── */}
          <div className="category-sidebar-header">
            <button className="category-sidebar-close" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
              <X size={16} />
            </button>
            {mounted && (user ? (
              <div className="sidebar-user-banner sidebar-user-banner--loggedin">
                <Link href="/profile" className="sidebar-user-profile-clickable" onClick={() => setIsSidebarOpen(false)}>
                  <div className="sidebar-user-avatar sidebar-user-avatar--lg">
                    {user.avatar ? (
                      <img
                        src={user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}${user.avatar}`}
                        alt="User Avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      />
                    ) : (
                      <span className="sidebar-user-avatar-initials">{getInitials()}</span>
                    )}
                  </div>
                  <div className="sidebar-user-info">
                    <div className="sidebar-user-hello">
                      {user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.username}
                    </div>
                    <span className="sidebar-user-view-profile">View Profile →</span>
                  </div>
                </Link>
                {/* <button
                  className="sidebar-user-logout-pill"
                  onClick={() => { logout(); setIsSidebarOpen(false); }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  Logout
                </button> */}
              </div>
            ) : (
              <button
                className="sidebar-user-banner sidebar-user-banner--guest"
                onClick={() => { openAuthModal("login"); setIsSidebarOpen(false); }}
              >
                <div className="sidebar-user-avatar sidebar-user-avatar--guest">
                  <User size={26} strokeWidth={1.5} color="#fff" />
                </div>
                <div className="sidebar-user-info">
                  <div className="sidebar-user-hello">Hello there!</div>
                  <div className="sidebar-user-signin">Sign In / Register</div>
                </div>
                <svg className="sidebar-user-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            ))}
          </div>

          <div className="category-sidebar-body">
            <div className="sidebar-nav-menu">
              {/* Home */}
              <Link href="/" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <Home size={18} strokeWidth={2} />
                <span>Home</span>
              </Link>

              {/* Category (Accordion style) */}
              <div className={`sidebar-accordion ${isCategoriesSidebarExpanded ? "expanded" : ""}`}>
                <button
                  className="sidebar-accordion-trigger"
                  onClick={() => setIsCategoriesSidebarExpanded(!isCategoriesSidebarExpanded)}
                >
                  <div className="sidebar-accordion-trigger-left">
                    <List size={18} strokeWidth={2} />
                    <span>Categories</span>
                  </div>
                  <ChevronRight size={16} strokeWidth={2} className="sidebar-accordion-arrow" />
                </button>

                {isCategoriesSidebarExpanded && (
                  <div className="sidebar-accordion-content">
                    {categoriesList.map((cat) => (
                      <Link key={cat.slug} href={`/category_product?category=${cat.slug}`} className="sidebar-sub-item" onClick={() => setIsSidebarOpen(false)}>
                        <span className="sidebar-sub-item-icon">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="sidebar-sub-item-img"
                            />
                          ) : (
                            getCategoryIcon(cat.slug)
                          )}
                        </span>
                        <span className="sidebar-sub-item-name">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Offer */}
              <Link href="/offer" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <TicketPercent size={18} strokeWidth={2} />
                <span>Offers</span>
              </Link>

              {/* Orders */}
              <Link href="/orders" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <ClipboardList size={18} strokeWidth={2} />
                <span>My Orders</span>
              </Link>

              {/* Profile */}
              <Link href="/profile" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <User size={18} strokeWidth={2} />
                <span>My Profile</span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <ShoppingCart size={18} strokeWidth={2} />
                <span>Cart</span>
              </Link>

              {/* Contact Us */}
              <Link href="/contact-us" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
          <div className="category-sidebar-footer">
            <p className="category-sidebar-footer-text">Explore premium gadgets & accessories</p>
          </div>
        </div>
      </div>

      {/* ── Auth Modal ── */}
      {isAuthModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setIsAuthModalOpen(false)} aria-label="Close">✕</button>

            {/* Logo */}
            <div className="auth-modal-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/official_logo_3.png"
                alt="BuyFest Logo"
                className="auth-modal-logo"
              />
            </div>

            {/* Tabs */}
            <div className="auth-modal-tabs">
              <button
                className={`auth-tab-btn ${authTab === "login" ? "active" : ""}`}
                onClick={() => { setAuthTab("login"); setAuthError(""); }}
                id="auth-tab-login"
              >Login</button>
              <button
                className={`auth-tab-btn ${authTab === "register" ? "active" : ""}`}
                onClick={() => { setAuthTab("register"); setAuthError(""); }}
                id="auth-tab-register"
              >Register</button>
            </div>

            {authError && <div className="auth-error-msg">{authError}</div>}
            {authSuccess && <div className="auth-success-msg">{authSuccess}</div>}

            {/* Login Form */}
            {authTab === "login" && (
              <form className="auth-form" onSubmit={handleLogin} id="auth-login-form">
                <div className="auth-field">
                  <label className="auth-label">Username</label>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    autoComplete="username"
                    id="auth-login-username"
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    id="auth-login-password"
                  />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={authLoading} id="auth-login-submit">
                  {authLoading ? <span className="auth-spinner" /> : "Login"}
                </button>
                <p className="auth-switch-text">
                  Don&apos;t have an account?{" "}
                  <button type="button" className="auth-switch-link" onClick={() => { setAuthTab("register"); setAuthError(""); }}>
                    Register here
                  </button>
                </p>
              </form>
            )}

            {/* Register Form */}
            {authTab === "register" && (
              <form className="auth-form" onSubmit={handleRegister} id="auth-register-form">
                <div className="auth-field-row">
                  <div className="auth-field">
                    <label className="auth-label">First Name</label>
                    <input className="auth-input" type="text" placeholder="First name" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} autoComplete="given-name" id="auth-reg-firstname" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Last Name</label>
                    <input className="auth-input" type="text" placeholder="Last name" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} autoComplete="family-name" id="auth-reg-lastname" />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Email <span className="auth-optional">(optional)</span></label>
                  <input className="auth-input" type="email" placeholder="your@email.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} autoComplete="email" id="auth-reg-email" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Username <span className="auth-required">*</span></label>
                  <input className="auth-input" type="text" placeholder="Choose a username" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required autoComplete="username" id="auth-reg-username" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password <span className="auth-required">*</span></label>
                  <input className="auth-input" type="password" placeholder="Create a password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required autoComplete="new-password" id="auth-reg-password" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm Password <span className="auth-required">*</span></label>
                  <input className="auth-input" type="password" placeholder="Confirm your password" value={regPassword2} onChange={(e) => setRegPassword2(e.target.value)} required autoComplete="new-password" id="auth-reg-password2" />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={authLoading} id="auth-register-submit">
                  {authLoading ? <span className="auth-spinner" /> : "Create Account"}
                </button>
                <p className="auth-switch-text">
                  Already have an account?{" "}
                  <button type="button" className="auth-switch-link" onClick={() => { setAuthTab("login"); setAuthError(""); }}>
                    Login here
                  </button>
                </p>
              </form>
            )}

            <p className="auth-guest-note">
              💡 You can also <Link href="/orders" className="auth-guest-link" onClick={() => setIsAuthModalOpen(false)}>track orders</Link> without an account
            </p>
          </div>
        </div>
      )}
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
      {/* <Link href={`/search?q=${encodeURIComponent(query)}`} className="header-search-view-all" onClick={onClose}>
        View all results for &quot;{query}&quot; →
      </Link> */}
    </>
  );
}
