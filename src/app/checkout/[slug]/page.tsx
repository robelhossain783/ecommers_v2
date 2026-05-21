"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProductBySlug } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";

const BASE_URL = "http://127.0.0.1:8000";

interface CheckoutContentProps {
  slug: string;
}

function CheckoutContent({ slug }: CheckoutContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Form states
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Purchase state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product slug details
  useEffect(() => {
    if (!slug) return;
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);

        // Read qty query parameter
        const qtyParam = searchParams.get("qty");
        const qtyVal = qtyParam ? parseInt(qtyParam, 10) : 1;
        setQuantity(qtyVal > 0 ? qtyVal : 1);
      } catch (err) {
        console.error("Error loading checkout product:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, searchParams]);

  if (loading) {
    return (
      <div className="product-details-container" style={{ textAlign: "center", padding: "120px 0" }}>
        <div className="checkout-spinner"></div>
        <h2 style={{ fontWeight: "600", color: "var(--text-secondary)" }}>Loading secure checkout...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container" style={{ textAlign: "center", padding: "100px 16px" }}>
        <h2 style={{ fontSize: "24px", color: "var(--primary)", marginBottom: "8px" }}>Checkout Error</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>The selected product could not be loaded for checkout.</p>
        <Link href="/" className="continue-shopping" style={{ background: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "var(--radius)", fontWeight: "600" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const unitPrice = Number(product.sell_price);
  const subtotal = unitPrice * quantity;
  const deliveryCharge = district.toLowerCase() === "dhaka" ? 80 : 150;

  // Dynamic coupon rules
  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccessMsg("");

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (code === "SAVE10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponSuccessMsg(`🎉 Success! 10% discount of ৳${discount} applied.`);
    } else if (code === "AVAA100") {
      const discount = Math.min(100, subtotal);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponSuccessMsg(`🎉 Success! Flat ৳${discount} discount applied.`);
    } else if (code === "FREESHIP") {
      setDiscountAmount(deliveryCharge);
      setCouponApplied(true);
      setCouponSuccessMsg("🎉 Success! Free shipping discount applied.");
    } else {
      setCouponError("❌ Invalid coupon code! Try SAVE10 or AVAA100.");
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  };

  const grandTotal = Math.max(0, subtotal - discountAmount + (couponCode.toUpperCase() === "FREESHIP" ? 0 : deliveryCharge));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !mobileNumber || !address || !district) {
      alert("⚠️ Please fill in all required shipping fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/create-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "buy_now",
          product_id: product.id,
          quantity: quantity,
          full_name: fullName,
          phone: mobileNumber,
          address: `${address}, ${district}`,
          payment_type: paymentMethod.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to create order on backend.");
      }

      const data = await response.json();
      setOrderId(data.order_id || `ORDER-${data.id}`);
      setOrderPlaced(true);

      // Clean cart upon order placement
      clearCart();
    } catch (err: any) {
      console.error("Order creation failed:", err);
      alert(`❌ Order placement failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-root" style={{ background: "#fafafa", minHeight: "80vh", padding: "32px 0 60px" }}>
      <div className="container">
        {orderPlaced ? (
          // Success State UI
          <div style={{ maxWidth: "650px", margin: "40px auto", padding: "40px 24px", background: "#fff", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 8px 30px rgba(0,0,0,0.05)", textAlign: "center" }}>
            <span style={{ fontSize: "72px", display: "block", marginBottom: "16px" }}>🎉</span>
            <h2 style={{ fontSize: "30px", fontWeight: "800", color: "#2e7d32", marginBottom: "12px" }}>Order Confirmed!</h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>
              Thank you for your order, <strong>{fullName}</strong>. Your order has been registered successfully.
            </p>

            <div style={{ background: "#f8f9fa", borderRadius: "8px", padding: "20px", textAlign: "left", marginBottom: "32px", border: "1px solid #eee" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "12px" }}>Order Specifications</h4>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Order Reference:</strong> <span style={{ color: "var(--primary)", fontWeight: "700" }}>{orderId}</span></p>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Item Purchased:</strong> {product.name} (Qty: {quantity})</p>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Mobile Number:</strong> {mobileNumber}</p>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Shipping Address:</strong> {address}, {district}</p>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Payment Method:</strong> {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "bkash" ? "bKash / Nagad Wallet" : "Card Payment"}</p>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Total Payable:</strong> ৳{grandTotal}</p>
            </div>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <Link href="/" style={{ background: "var(--primary)", color: "#fff", textDecoration: "none", padding: "12px 30px", borderRadius: "30px", fontWeight: "700", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.9)"} onMouseLeave={(e) => e.currentTarget.style.filter = "none"}>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          // Split checkout layout
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }} className="checkout-grid">

            {/* LEFT SIDE: ORDER FORM */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid var(--border)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "2px solid var(--border-light)", paddingBottom: "12px" }}>
                <span>📋</span> Shipping & Billing Information
              </h2>

              <form onSubmit={handlePlaceOrder}>
                {/* Full Name */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none", transition: "all 0.2s" }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </div>

                {/* Mobile Number */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter 11-digit mobile number"
                    pattern="[0-9]{11}"
                    title="Please enter a valid 11-digit phone number"
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </div>

                {/* District */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", background: "#fff", cursor: "pointer", outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  >
                    <option value="Dhaka">Dhaka (Delivery Charge: ৳80)</option>
                    <option value="Chattogram">Chattogram (Delivery Charge: ৳150)</option>
                    <option value="Sylhet">Sylhet (Delivery Charge: ৳150)</option>
                    <option value="Rajshahi">Rajshahi (Delivery Charge: ৳150)</option>
                    <option value="Barishal">Barishal (Delivery Charge: ৳150)</option>
                    <option value="Khulna">Khulna (Delivery Charge: ৳150)</option>
                    <option value="Rangpur">Rangpur (Delivery Charge: ৳150)</option>
                    <option value="Mymensingh">Mymensingh (Delivery Charge: ৳150)</option>
                  </select>
                </div>

                {/* Full Address */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>Full Address *</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Village/Area, House No, Road, Flat Number, Landmarks"
                    rows={3}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", fontFamily: "inherit", resize: "none", outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </div>

                {/* Coupon Code Section */}
                <div style={{ background: "#fdf8f6", border: "1px dashed #ffccc7", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "var(--primary)" }}>🏷️ Apply Coupon Code</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="e.g. SAVE10 or AVAA100"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", textTransform: "uppercase", outline: "none" }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      style={{ background: "var(--primary)", color: "#fff", fontWeight: "700", padding: "0 18px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.95)"}
                      onMouseLeave={(e) => e.currentTarget.style.filter = "none"}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p style={{ color: "#d43f3a", fontSize: "12px", fontWeight: "600", marginTop: "6px" }}>{couponError}</p>}
                  {couponSuccessMsg && <p style={{ color: "#389e0d", fontSize: "12px", fontWeight: "600", marginTop: "6px" }}>{couponSuccessMsg}</p>}
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", fontStyle: "italic" }}>
                    * Tip: Try <strong style={{ color: "var(--text-secondary)" }}>SAVE10</strong> for 10% off or <strong style={{ color: "var(--text-secondary)" }}>AVAA100</strong> for ৳100 discount!
                  </p>
                </div>


                {/* Payment Method */}
                <div style={{ marginBottom: "28px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "10px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Payment Method
                  </label>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                    {/* COD */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: paymentMethod === "COD" ? "#fdfbfb" : "#fff",
                        borderColor: paymentMethod === "COD" ? "var(--primary)" : "#ddd",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>
                          💵 Cash on Delivery (COD)
                        </strong>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Pay with cash upon delivery
                        </span>
                      </div>
                    </label>

                    {/* BKASH */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: paymentMethod === "BKASH" ? "#fdfbfb" : "#fff",
                        borderColor: paymentMethod === "BKASH" ? "var(--primary)" : "#ddd",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "BKASH"}
                        onChange={() => setPaymentMethod("BKASH")}
                      />
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>
                          📱 bKash Payment
                        </strong>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Pay instantly using bKash
                        </span>
                      </div>
                    </label>

                    {/* NAGAD */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: paymentMethod === "NAGAD" ? "#fdfbfb" : "#fff",
                        borderColor: paymentMethod === "NAGAD" ? "var(--primary)" : "#ddd",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "NAGAD"}
                        onChange={() => setPaymentMethod("NAGAD")}
                      />
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>
                          💳 Nagad Payment
                        </strong>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Pay using Nagad mobile banking
                        </span>
                      </div>
                    </label>

                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ width: "100%", background: isSubmitting ? "#888" : "#2e7d32", color: "#fff", fontSize: "16px", fontWeight: "800", padding: "14px 20px", borderRadius: "30px", cursor: isSubmitting ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: isSubmitting ? "none" : "0 4px 12px rgba(46, 125, 50, 0.2)", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = "none")}
                >
                  {isSubmitting ? (
                    <>
                      <div className="checkout-spinner" style={{ width: "18px", height: "18px", border: "2px solid #fff", borderTop: "2px solid transparent", margin: 0 }}></div>
                      Processing Order...
                    </>
                  ) : (
                    <>⚡ Complete Order Now (৳{grandTotal})</>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT SIDE: ORDER SUMMARY */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px", boxShadow: "var(--shadow-sm)", position: "sticky", top: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px", color: "var(--text-primary)" }}>
                  🛍️ Order Summary
                </h3>

                {/* Product Detail Card */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "18px", paddingBottom: "16px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ width: "70px", height: "70px", background: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #eee", flexShrink: 0 }}>
                    {product.image ? (
                      <Image
                        src={product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`}
                        alt={product.name}
                        width={60}
                        height={60}
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    ) : (
                      <span style={{ fontSize: "11px", color: "#999" }}>No Image</span>
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px", lineHeight: "1.3" }}>{product.name}</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Category: {product.category?.name || "Gadgets"}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>৳{unitPrice}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>x {quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Item Billing Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Subtotal ({quantity} items)</span>
                    <strong style={{ color: "var(--text-primary)" }}>৳{subtotal}</strong>
                  </div>

                  {couponApplied && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#389e0d" }}>
                      <span>Coupon Discount ({couponCode.toUpperCase()})</span>
                      <strong>-৳{discountAmount}</strong>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Delivery Fee</span>
                    <strong style={{ color: "var(--text-primary)" }}>
                      {couponCode.toUpperCase() === "FREESHIP" ? (
                        <span style={{ textDecoration: "line-through", color: "var(--text-muted)", marginRight: "6px" }}>৳{deliveryCharge}</span>
                      ) : null}
                      {couponCode.toUpperCase() === "FREESHIP" ? "৳0 (Free)" : `৳${deliveryCharge}`}
                    </strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", borderTop: "2px solid var(--border-light)", paddingTop: "14px", marginTop: "4px" }}>
                    <span>Grand Total</span>
                    <span style={{ color: "var(--primary)" }}>৳{grandTotal}</span>
                  </div>
                </div>

                <div style={{ marginTop: "24px", padding: "12px", background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: "8px", fontSize: "11px", color: "#389e0d", display: "flex", gap: "6px" }}>
                  <span>🛡️</span>
                  <span><strong>100% Secure Checkout:</strong> Your information is fully encrypted and protected. Payment on Delivery is supported.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug;

  return (
    <>
      <TopBar />
      <Header />

      <Suspense fallback={
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Preparing Secure Checkout...</h2>
        </div>
      }>
        <CheckoutContent slug={slug} />
      </Suspense>

      <Footer />
    </>
  );
}
