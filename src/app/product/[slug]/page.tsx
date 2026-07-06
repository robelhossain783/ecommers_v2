"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getProductBySlug, getNewArrivals, getNewArrival2 } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";
import { ShoppingCart, Zap, AlertCircle, MessageSquare, Minus, Plus, ChevronRight, Package, Truck, RotateCcw, ShieldCheck } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
        <Header />
        <div className="product-details-container">
          <div className="product-page-status">
            <div className="product-page-spinner" />
            <p>Loading product details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="product-details-container">
          <div className="product-page-status">
            <Package size={48} strokeWidth={1.2} />
            <h2>Product Not Found</h2>
            <p>The product you are looking for does not exist or has been removed.</p>
            <Link href="/" className="continue-shopping">Back to Home</Link>
          </div>
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
        <nav className="product-breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} strokeWidth={2.5} />
          <Link href={`/category_product/?category=${product.category?.slug}`}>
            {product.category?.name || "Product"}
          </Link>
          <ChevronRight size={12} strokeWidth={2.5} />
          <span>{product.name}</span>
        </nav>

        {/* MAIN DETAIL GRID */}
        <div className="product-detail-grid">
          {/* LEFT: IMAGE & GALLERY SECTION */}
          <div className="product-detail-left-column">
            <div className="product-detail-image-wrapper">
              <div className="product-detail-image-sec">
                {activeImage ? (
                  <div className="product-detail-image-inner" onClick={() => setLightboxImage(activeImage)} style={{ cursor: "zoom-in" }}>
                    <Image
                      src={activeImage.startsWith("http") ? activeImage : `${BASE_URL}${activeImage}`}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="product-detail-image"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="product-no-image">No Product Image</div>
                )}
              </div>
              {hasDiscount && (
                <div className="product-detail-image-discount">
                  <span className="discount-pct">-{Math.round((discount / regularPrice) * 100)}%</span>
                  <span className="discount-amount">৳{discount} OFF</span>
                </div>
              )}
              {allImages.length > 1 && (
                <div className="product-detail-image-counter">
                  {allImages.indexOf(activeImage || product.image || "") + 1}/{allImages.length}
                </div>
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
            <span className="product-detail-category-badge">
              {product.category?.name || "Gadget"}
            </span>

            <h1 className="product-detail-title">{product.name}</h1>

            <div className={`product-detail-stock-badge ${inStock ? "" : "out"}`}>
              <span className="stock-dot" />
              <span>
                {inStock ? `In Stock` : "Stock Out"}
              </span>
            </div>

            {/* PRICES */}
            <div className="product-detail-prices-wrapper">
              <span className="product-detail-sell-price">৳{sellPrice.toLocaleString('en-US')}</span>
              {hasDiscount && (
                <>
                  <span className="product-detail-regular-price">৳{regularPrice.toLocaleString('en-US')}</span>
                  <span className="product-detail-discount-badge">
                    -{Math.round((discount / regularPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* TRUST BADGES */}
            <div className="product-trust-badges">
              <div className="trust-badge-item">
                <Truck size={16} strokeWidth={1.5} />
                <span>Fast Delivery</span>
              </div>
              <div className="trust-badge-item">
                <RotateCcw size={16} strokeWidth={1.5} />
                <span>Easy Returns</span>
              </div>
              <div className="trust-badge-item">
                <ShieldCheck size={16} strokeWidth={1.5} />
                <span>Secure Payment</span>
              </div>
            </div>

            {/* BUY BOX */}
            {inStock ? (
              <div className="product-buy-box">
                <div className="product-buy-box-row">
                  <span className="product-buy-box-label">Quantity</span>
                  <div className="quantity-control">
                    <button onClick={handleDecrement} className="quantity-control-btn">
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <input type="text" value={quantity} readOnly className="quantity-input" />
                    <button onClick={handleIncrement} className="quantity-control-btn">
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                  <span className="product-buy-box-total">৳{sellPrice * quantity}</span>
                </div>

                <div className="product-detail-btn-group">
                  <button onClick={handleAddToCart} className="product-detail-add-btn">
                    <ShoppingCart size={16} strokeWidth={2} />
                    Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="product-detail-buy-btn">
                    <Zap size={16} strokeWidth={2} />
                    Buy Now
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
                  <div className="product-stock-error">
                    <AlertCircle size={14} />
                    <span>{stockLimitMsg}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="product-buy-box">
                <div className="quantity-control disabled">
                  <button className="quantity-control-btn" disabled>
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <input type="text" value="0" readOnly className="quantity-input" />
                  <button className="quantity-control-btn" disabled>
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>

                <div className="product-detail-btn-group">
                  <button className="product-detail-add-btn disabled" disabled>Stock Out</button>
                  <button className="product-detail-buy-btn disabled" disabled>Stock Out</button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="product-detail-whatsapp-btn">
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
              <div className="tab-details-content">
                <h3>Product Overview</h3>
                <FormattedDescription text={product.description || "This premium device brings advanced features and exceptional power. Designed meticulously with quality materials, it provides unmatched reliability and convenience for your daily work and lifestyle."} />
              </div>
            )}

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
                    <MessageSquare size={40} strokeWidth={1.2} />
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
                              setReviewSuccess("Thank you! Your review has been submitted.");
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
          <div className="product-related-section">
            <div className="section-header">
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="products-scroll">
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

      {/* Image Lightbox */}
      {lightboxImage && (
        <div className="product-lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="product-lightbox-close" onClick={() => setLightboxImage(null)} type="button">
            &times;
          </button>
          <div className="product-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImage.startsWith("http") ? lightboxImage : `${BASE_URL}${lightboxImage}`}
              alt={product?.name || "Product image"}
              width={800}
              height={800}
              className="product-lightbox-image"
              unoptimized
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function FormattedDescription({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="formatted-desc">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.length > 1 && lines.every((l) => /^[-*•]\s/.test(l));
        if (isList) {
          return (
            <ul key={i} className="desc-list">
              {lines.map((line, j) => (
                <li key={j}>{line.replace(/^[-*•]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        if (lines.length === 1 && /^[A-Z][A-Za-z\s]+:$/.test(lines[0])) {
          return <h4 key={i} className="desc-subheading">{lines[0]}</h4>;
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
