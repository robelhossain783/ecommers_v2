"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getProductBySlug, getNewArrivals, getNewArrival2 } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";

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
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "shipping" | "reviews">("details");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<{ id: number; name: string; rating: number; comment: string; created_at: string; avatar_url?: string | null }[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [stockLimitMsg, setStockLimitMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        if (data) {
          setActiveImage(data.image);
          if (data.reviews) setReviews(data.reviews);
          // Pre-fill name from logged-in user
          if (user) {
            const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
            setReviewName(fullName);
          }
        }

        // Fetch related products by category
        let related: Product[] = [];
        if (data && data.category?.slug) {
          related = await getNewArrival2({ slug: data.category.slug });
        } else {
          related = await getNewArrivals();
        }
        // Filter out current product and grab up to 4 items
        const filtered = related
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
    const maxAllowed = Math.max(1, Math.floor(product.stock * 0.7));
    if (quantity < maxAllowed) {
      setQuantity((prev) => prev + 1);
      setStockLimitMsg(null);
    } else {
      setStockLimitMsg(`Limit exceeded. You cannot order more than 70% of available stock (Limit: ${maxAllowed} items)`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setStockLimitMsg(null);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      setStockLimitMsg("Stock Out");
      return;
    }
    const maxAllowed = Math.max(1, Math.floor(product.stock * 0.7));
    if (quantity > maxAllowed) {
      setStockLimitMsg(`Limit exceeded. You cannot order more than 70% of available stock (Limit: ${maxAllowed} items)`);
      return;
    }
    const res = addToCart(product, quantity);
    if (res && !res.success) {
      setStockLimitMsg(res.message || "Failed to add to cart");
    } else {
      setStockLimitMsg(null);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.stock <= 0) {
      setStockLimitMsg("Stock Out");
      return;
    }
    const maxAllowed = Math.max(1, Math.floor(product.stock * 0.7));
    if (quantity > maxAllowed) {
      setStockLimitMsg(`Limit exceeded. You cannot order more than 70% of available stock (Limit: ${maxAllowed} items)`);
      return;
    }
    setStockLimitMsg(null);
    // Redirect to custom single-product checkout form
    router.push(`/checkout/${product.slug}?qty=${quantity}`);
  };

  if (loading) {
    return (
      <>
        {/* <TopBar /> */}
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
        {/* <TopBar /> */}
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

  const productUrl = typeof window !== "undefined" ? `${window.location.origin}/product/${product.slug}` : "";
  const whatsappMessage = `Hello, I want to order this product:\n\n*Product:* ${product.name}\n*Price:* ৳${sellPrice}\n*Quantity:* ${quantity}\n${productUrl ? `*Link:* ${productUrl}` : ""}`;
  const whatsappUrl = `https://wa.me/8801635275630?text=${encodeURIComponent(whatsappMessage)}`;

  // Build the list of all images for gallery
  const allImages: string[] = [];
  if (product.image) allImages.push(product.image);
  if (product.gallery_images && product.gallery_images.length > 0) {
    product.gallery_images.forEach((imgObj) => {
      if (imgObj.image && !allImages.includes(imgObj.image)) {
        allImages.push(imgObj.image);
      }
    });
  }

  return (
    <>
      {/* <TopBar /> */}
      <Header />

      <div className="product-details-container">
        {/* BREADCRUMB */}
        <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>

          <Link
            href={`/category_product/?category=${product.category?.slug}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.category?.name || "Product"}
          </Link>

          <span></span>

        </div>

        {/* MAIN DETAIL GRID */}
        <div className="product-detail-grid">
          {/* LEFT: IMAGE & GALLERY SECTION */}
          <div className="product-detail-left-column">
            <div className="product-detail-image-sec">
              {activeImage ? (
                <Image
                  src={activeImage.startsWith("http") ? activeImage : `${BASE_URL}${activeImage}`}
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

            {/* THUMBNAILS GALLERY */}
            {allImages.length > 1 && (
              <div className="product-detail-gallery-thumbs">
                {allImages.map((imgSrc, idx) => {
                  const resolvedSrc = imgSrc.startsWith("http") ? imgSrc : `${BASE_URL}${imgSrc}`;
                  const isActive = activeImage === imgSrc;
                  return (
                    <button
                      key={idx}
                      className={`product-detail-gallery-thumb-btn ${isActive ? "active" : ""}`}
                      onClick={() => setActiveImage(imgSrc)}
                      type="button"
                    >
                      <Image
                        src={resolvedSrc}
                        alt={`Product image ${idx + 1}`}
                        width={70}
                        height={70}
                        className="product-detail-gallery-thumb-img"
                        unoptimized
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* INFO SECTION */}
          <div className="product-detail-info-sec">
            <div>
              <span className="product-detail-category-badge">
                {product.category?.name || "Gadget"}
              </span>

              <h1 className="product-detail-title">{product.name}</h1>

              <div className={`product-detail-stock-badge ${inStock ? "" : "out"}`}>
                {/* <span style={{ fontSize: "16px" }}>{inStock ? "🟢" : "🔴"}</span> */}
                <span>
                  {inStock ? `In Stock (Available: ${product.stock})` : "Stock Out"}
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

                <div className="product-detail-btn-group">
                  <button onClick={handleAddToCart} className="product-detail-add-btn">
                    🛒 Add to Cart
                  </button>

                  <button onClick={handleBuyNow} className="product-detail-buy-btn">
                    ⚡ Buy Now
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-detail-whatsapp-btn"
                  >
                    <FaWhatsapp size={16} /> WhatsApp
                  </a>
                </div>

                {stockLimitMsg && (
                  <div style={{
                    width: "100%",
                    color: "#e8320a",
                    fontSize: "13px",
                    fontWeight: 500,
                    background: "rgba(232, 50, 10, 0.06)",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "12px",
                    border: "1px solid rgba(232, 50, 10, 0.15)",
                    boxSizing: "border-box"
                  }}>
                    <span>⚠️</span> {stockLimitMsg}
                  </div>
                )}
              </div>
            ) : (
              <div className="product-detail-actions">
                <div className="quantity-control disabled" style={{ opacity: 0.5, pointerEvents: "none" }}>
                  <button className="quantity-control-btn" disabled>−</button>
                  <input
                    type="text"
                    value="0"
                    readOnly
                    className="quantity-input"
                  />
                  <button className="quantity-control-btn" disabled>+</button>
                </div>

                <div className="product-detail-btn-group">
                  <button className="product-detail-add-btn" disabled style={{ background: "#f3f4f6", color: "#9ca3af", borderColor: "#e5e7eb", cursor: "not-allowed", opacity: 0.8 }}>
                    Stock Out
                  </button>

                  <button className="product-detail-buy-btn" disabled style={{ background: "#f3f4f6", color: "#9ca3af", borderColor: "#e5e7eb", cursor: "not-allowed", opacity: 0.8 }}>
                    Stock Out
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-detail-whatsapp-btn"
                  >
                    <FaWhatsapp size={16} /> WhatsApp
                  </a>
                </div>
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
            {/* <button
              onClick={() => setActiveTab("shipping")}
              className={`tab-btn ${activeTab === "shipping" ? "active" : ""}`}
            >
              Delivery & EMI Info
            </button> */}
            <button
              onClick={() => setActiveTab("reviews")}
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            >
              Reviews ({reviews.length})
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
            {/* 
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
            )} */}

            {activeTab === "reviews" && (
              <div className="reviews-tab-container">
                {/* REVIEW LIST */}
                {reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-meta">
                          <div className="review-author-avatar">
                            {review.avatar_url ? (
                              <img
                                src={review.avatar_url.startsWith("http") ? review.avatar_url : `${BASE_URL}${review.avatar_url}`}
                                alt={review.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                              />
                            ) : (
                              review.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="review-author-name">{review.name}</div>
                            <div className="review-date">
                              {new Date(review.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                          </div>
                        </div>
                        <div className="review-stars">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={s <= review.rating ? "star filled" : "star"}>★</span>
                          ))}
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="review-empty">
                    <span style={{ fontSize: "40px" }}>💬</span>
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}

                {/* REVIEW FORM */}
                <div className="review-form-sec">
                  <h3 className="review-form-title">Write a Review</h3>

                  {!user ? (
                    /* NOT LOGGED IN — show login gate */
                    <div className="review-login-gate">
                      <span className="review-login-icon"></span>
                      <p className="review-login-msg">
                        Required login to write a review.
                      </p>
                      <button
                        className="review-login-btn"
                        onClick={() => {
                          // Scroll to top and trigger header login modal
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setTimeout(() => {
                            const loginBtn = document.getElementById("account-login-btn");
                            if (loginBtn) loginBtn.click();
                          }, 400);
                        }}
                      >
                        Login
                      </button>
                    </div>
                  ) : (
                    /* LOGGED IN — show the form */
                    <>
                      {reviewSuccess && (
                        <div className="review-alert success">{reviewSuccess}</div>
                      )}
                      {reviewError && (
                        <div className="review-alert error">{reviewError}</div>
                      )}
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!reviewName.trim() || !reviewComment.trim()) {
                            setReviewError("Please fill in your name and comment.");
                            return;
                          }
                          setReviewSubmitting(true);
                          setReviewError("");
                          setReviewSuccess("");
                          try {
                            const res = await fetch(
                              `${BASE_URL}/api/products/${product.id}/reviews/add/`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name: reviewName, rating: reviewRating, comment: reviewComment, user_id: user?.id }),
                              }
                            );
                            if (res.ok) {
                              const data = await res.json();
                              setReviews((prev) => [data.review, ...prev]);
                              setReviewComment("");
                              setReviewRating(5);
                              setReviewSuccess("✅ Thank you! Your review has been submitted.");
                            } else {
                              const err = await res.json();
                              setReviewError(err?.comment?.[0] || err?.name?.[0] || "Failed to submit review.");
                            }
                          } catch {
                            setReviewError("Network error. Please try again.");
                          } finally {
                            setReviewSubmitting(false);
                          }
                        }}
                        className="review-form"
                      >
                        <div className="review-form-row">
                          <div className="review-form-group">
                            <label className="review-label">Posting as</label>
                            <input
                              type="text"
                              className="review-input review-input-readonly"
                              value={reviewName}
                              readOnly
                            />
                          </div>
                          <div className="review-form-group">
                            <label className="review-label">Your Rating</label>
                            <div className="rating-stars-input">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  className={`rating-star-btn ${s <= (reviewHover || reviewRating) ? "active" : ""}`}
                                  onClick={() => setReviewRating(s)}
                                  onMouseEnter={() => setReviewHover(s)}
                                  onMouseLeave={() => setReviewHover(0)}
                                >
                                  ★
                                </button>
                              ))}
                              <span className="rating-label">{reviewHover || reviewRating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="review-form-group">
                          <label className="review-label">Your Review</label>
                          <textarea
                            className="review-textarea"
                            placeholder="Share your experience with this product..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="review-submit-btn"
                          disabled={reviewSubmitting}
                        >
                          {reviewSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    </>
                  )}
                </div>
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
