"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getProductBySlug, getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const slug = params?.slug;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "shipping">("details");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!slug) return;
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);

        // Fetch related products
        const allProducts = await getNewArrivals();
        // Filter out current product and grab up to 4 items
        const filtered = allProducts
          .filter((p) => p.slug !== slug)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  const handleIncrement = () => {
    if (!product) return;
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    alert(`${quantity} x "${product.name}" added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Redirect to custom single-product checkout form
    router.push(`/checkout/${product.slug}?qty=${quantity}`);
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="product-details-container" style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Loading product details...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="product-details-container" style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Product Not Found</h2>
          <p style={{ margin: "20px 0", color: "var(--text-muted)" }}>
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/" className="continue-shopping">
            Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const sellPrice = Number(product.sell_price);
  const regularPrice = Number(product.regular_price);
  const hasDiscount = regularPrice && regularPrice > sellPrice;
  const discount = hasDiscount ? regularPrice - sellPrice : 0;
  const inStock = product.stock > 0;

  return (
    <>
      <TopBar />
      <Header />

      <div className="product-details-container">
        {/* BREADCRUMB */}
        <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span>{product.category?.name || "Product"}</span>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{product.name}</span>
        </div>

        {/* MAIN DETAIL GRID */}
        <div className="product-detail-grid">
          {/* IMAGE SECTION */}
          <div className="product-detail-image-sec">
            {product.image ? (
              <Image
                src={product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`}
                alt={product.name}
                width={400}
                height={400}
                className="product-detail-image"
                unoptimized
              />
            ) : (
              <div style={{ fontSize: "24px", color: "#ccc" }}>No Product Image</div>
            )}
          </div>

          {/* INFO SECTION */}
          <div className="product-detail-info-sec">
            <div>
              <span className="product-detail-category-badge">
                {product.category?.name || "Gadget"}
              </span>

              <h1 className="product-detail-title">{product.name}</h1>

              <div className="product-detail-stock-badge">
                <span style={{ fontSize: "16px" }}>{inStock ? "🟢" : "🔴"}</span>
                <span className={inStock ? "" : "out"}>
                  {inStock ? `In Stock (Available: ${product.stock})` : "Out of Stock"}
                </span>
              </div>

              {/* PRICES */}
              <div className="product-detail-prices-wrapper">
                <span className="product-detail-sell-price">৳{sellPrice}</span>
                {hasDiscount && (
                  <>
                    <span className="product-detail-regular-price">৳{regularPrice}</span>
                    <span className="product-detail-discount-badge">
                      ৳{discount} OFF
                    </span>
                  </>
                )}
              </div>

              {/* BRIEF DESCRIPTION */}
              <p className="product-detail-desc">
                {product.description || "No description available for this premium gadget. Experience state-of-the-art features, top-tier performance, and modern ergonomics, backed by manufacturer support."}
              </p>
            </div>

            {/* ACTIONS */}
            {inStock ? (
              <div className="product-detail-actions">
                <div className="quantity-control">
                  <button onClick={handleDecrement} className="quantity-control-btn">−</button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="quantity-input"
                  />
                  <button onClick={handleIncrement} className="quantity-control-btn">+</button>
                </div>

                <button onClick={handleAddToCart} className="product-detail-add-btn">
                  🛒 Add to Cart
                </button>

                <button onClick={handleBuyNow} className="product-detail-buy-btn">
                  ⚡ Buy Now
                </button>
              </div>
            ) : (
              <div style={{ marginTop: "24px", padding: "16px", background: "#ffebee", color: "#c62828", borderRadius: "var(--radius-sm)", fontWeight: "600" }}>
                This item is currently unavailable. Please check back later or subscribe to pre-order notifications.
              </div>
            )}
          </div>
        </div>

        {/* TABS FOR MORE DETAILS */}
        <div className="tabs-wrapper">
          <div className="tabs-header">
            <button
              onClick={() => setActiveTab("details")}
              className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`tab-btn ${activeTab === "specs" ? "active" : ""}`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`tab-btn ${activeTab === "shipping" ? "active" : ""}`}
            >
              Delivery & EMI Info
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "details" && (
              <div>
                <h3 style={{ marginBottom: "12px", color: "var(--text-primary)" }}>Product Overview</h3>
                <p style={{ lineHeight: "1.7", color: "var(--text-secondary)" }}>
                  {product.description || "This premium device brings advanced features and exceptional power. Designed meticulously with quality materials, it provides unmatched reliability and convenience for your daily work and lifestyle."}
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <table className="spec-table">
                <tbody>
                  <tr>
                    <td className="spec-label">Product Name</td>
                    <td className="spec-value">{product.name}</td>
                  </tr>
                  <tr>
                    <td className="spec-label">Category</td>
                    <td className="spec-value">{product.category?.name || "Premium Gadgets"}</td>
                  </tr>
                  <tr>
                    <td className="spec-label">URL Slug</td>
                    <td className="spec-value">{product.slug}</td>
                  </tr>
                  <tr>
                    <td className="spec-label">Internal Code</td>
                    <td className="spec-value">#PRD-{product.id}</td>
                  </tr>
                  <tr>
                    <td className="spec-label">Availability</td>
                    <td className="spec-value">{inStock ? "Available (In Stock)" : "Out of stock"}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {activeTab === "shipping" && (
              <div>
                <h3 style={{ marginBottom: "12px", color: "var(--text-primary)" }}>Fast & Secured Delivery</h3>
                <p style={{ lineHeight: "1.7", color: "var(--text-secondary)", marginBottom: "16px" }}>
                  📦 <strong>Dhaka City:</strong> Same-day or Next-day home delivery (Standard charge: ৳80).<br />
                  🚚 <strong>Outside Dhaka:</strong> 2 to 3 days delivery via partner courier services (Standard charge: ৳150).
                </p>
                <h3 style={{ marginBottom: "12px", color: "var(--text-primary)" }}>EMI Options</h3>
                <p style={{ lineHeight: "1.7", color: "var(--text-secondary)" }}>
                  💳 Pay in easy monthly installments (EMI) up to 36 months using credit cards from leading banks in Bangladesh (UCB, City Bank, EBL, DBBL, etc.). Contact outlets for offline EMI support.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <div className="section-header">
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="products-row">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => addToCart(p)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
