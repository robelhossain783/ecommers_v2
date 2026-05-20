"use client";

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo */}
        <a href="/" className="logo">
          <span className="logo-text">
            <span>Avaa</span>.
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
          <a href="/pre-order" className="nav-link">Pre-order</a>
          <a href="/offer" className="nav-link">Offers</a>
          {/* <a href="/compare" className="nav-link">Compare</a> */}

          <button className="cart-btn" aria-label="Cart">
            🛒
            <span className="cart-count">{cartCount}</span>
          </button>

          {/* <button className="signin-btn">Sign In</button> */}
        </nav>
      </div>

      {/* Sub navigation */}
      <div className="sub-nav">
        <div className="sub-nav-inner">
          <a href="/" className="sub-nav-link active">Home</a>
          <a href="/category" className="sub-nav-link">Category ▾</a>
          <a href="/offer" className="sub-nav-link">Offer</a>
          <a href="/pre-order" className="sub-nav-link">Pre-Order</a>
          <a href="/compare" className="sub-nav-link">Compare</a>
          <a href="/tracking" className="sub-nav-link">Track Order</a>
          <a href="/outlets" className="sub-nav-link">Outlets</a>
          <a href="/contact-us" className="sub-nav-link">Contact</a>
        </div>
      </div>
    </header>
  );
}
