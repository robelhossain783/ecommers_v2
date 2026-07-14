"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProductBySlug } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

const PHONE_REGEX = /^01\d{9}$/;

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const MAX_CHARS = 1500;
const MAX_WORDS = 150;

interface CheckoutContentProps {
  slug: string;
}

function CheckoutContent({ slug }: CheckoutContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [checkoutItems, setCheckoutItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper variables for single product checkout backward compatibility
  const product = checkoutItems.length > 0 ? checkoutItems[0].product : null;
  const quantity = checkoutItems.length > 0 ? checkoutItems[0].quantity : 1;

  // Form states
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [districts, setDistricts] = useState<{ name: string; delivery_charge: number }[]>([]);
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [onlineMethod, setOnlineMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const receiverNumber = "01635275630";

  // Shipping Address Options
  const [addressOption, setAddressOption] = useState<"profile" | "new">("profile");
  const hasProfileAddress = !!(user && (user.address || user.phone));

  const nameDisabled = addressOption === "profile" && !!(user?.first_name || user?.last_name || user?.username);
  const phoneDisabled = addressOption === "profile" && !!user?.phone;
  const addressDisabled = addressOption === "profile" && !!user?.address;

  // Validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validate(checkName = true, checkPhone = true, checkAddress = true) {
    const errs: Record<string, string> = {};
    if (checkName) {
      if (!fullName.trim()) errs.fullName = "Full name is required";
      else if (fullName.length > MAX_CHARS) errs.fullName = `Maximum ${MAX_CHARS.toLocaleString()} characters allowed`;
      else if (wordCount(fullName) > MAX_WORDS) errs.fullName = `Maximum ${MAX_WORDS} words allowed`;
    }
    if (checkPhone) {
      if (!mobileNumber.trim()) errs.mobileNumber = "Mobile number is required";
      else if (!PHONE_REGEX.test(mobileNumber.trim())) errs.mobileNumber = "Enter a valid 11-digit Bangladeshi number (e.g. 01700000000)";
    }
    if (checkAddress) {
      if (!address.trim()) errs.address = "Address is required";
      else if (address.length > MAX_CHARS) errs.address = `Maximum ${MAX_CHARS.toLocaleString()} characters allowed`;
      else if (wordCount(address) > MAX_WORDS) errs.address = `Maximum ${MAX_WORDS} words allowed`;
    }
    return errs;
  }

  const errors = useMemo(() => validate(!nameDisabled, !phoneDisabled, !addressDisabled), [fullName, mobileNumber, address, nameDisabled, phoneDisabled, addressDisabled]);

  const blur = (field: string) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  // Purchase state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine initial address option based on profile completeness
  useEffect(() => {
    if (user) {
      const profileAddress = user.address || "";
      const profilePhone = user.phone || "";
      if (profileAddress || profilePhone) {
        setAddressOption("profile");
      } else {
        setAddressOption("new");
      }
    } else {
      setAddressOption("new");
    }
  }, [user]);

  // Sync inputs with profile or clear if different address selected
  useEffect(() => {
    if (user && addressOption === "profile") {
      const profileName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "";
      if (profileName) {
        setFullName(profileName);
      }
      if (user.phone) {
        setMobileNumber(user.phone);
      }
      if (user.address) {
        setAddress(user.address);
      }
    } else if (addressOption === "new") {
      setFullName("");
      setMobileNumber("");
      setAddress("");
    }
  }, [addressOption, user]);

  // Fetch districts from backend
  useEffect(() => {
    fetch(`${BASE_URL}/api/district/list/`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data);
        if (data.length > 0) setDistrict(data[0].name);
      })
      .catch(() => {
        setDistricts([]);
      });
  }, []);

  // Load product slug details or load from cart context
  useEffect(() => {
    if (!slug) return;
    if (slug === "cart") {
      setCheckoutItems(cart);
      setLoading(false);
      return;
    }

    async function loadProduct() {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        if (data) {
          // Read qty query parameter
          const qtyParam = searchParams.get("qty");
          const qtyVal = qtyParam ? parseInt(qtyParam, 10) : 1;
          const finalQty = qtyVal > 0 ? qtyVal : 1;
          setCheckoutItems([{ product: data, quantity: finalQty }]);
        } else {
          setCheckoutItems([]);
        }
      } catch (err) {
        console.error("Error loading checkout product:", err);
        setCheckoutItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, searchParams, cart]);

  if (loading) {
    return (
      <div className="product-details-container" style={{ textAlign: "center", padding: "120px 0" }}>
        <div className="checkout-spinner"></div>
        <h2 style={{ fontWeight: "600", color: "var(--text-secondary)" }}>Loading secure checkout...</h2>
      </div>
    );
  }

  if (checkoutItems.length === 0 && !orderPlaced) {
    return (
      <div className="product-details-container" style={{ textAlign: "center", padding: "100px 16px" }}>
        <h2 style={{ fontSize: "24px", color: "var(--primary)", marginBottom: "8px" }}>Checkout Error</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
          {slug === "cart" ? "Your cart is empty." : "The selected product could not be loaded for checkout."}
        </p>
        <Link href="/" className="continue-shopping" style={{ background: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "var(--radius)", fontWeight: "600" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const subtotal = checkoutItems.reduce((acc, item) => {
    return acc + Number(item.product.sell_price || 0) * item.quantity;
  }, 0);
  const selectedDistrict = districts.find((d) => d.name === district);
  const deliveryCharge = selectedDistrict?.delivery_charge ?? 0;

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
      setCouponSuccessMsg(`Success! 10% discount of ৳${discount} applied.`);
    } else if (code === "BF10") {
      const discount = Math.min(100, subtotal);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponSuccessMsg(`Success! Flat ৳${discount} discount applied.`);
    } else if (code === "FREESHIP") {
      setDiscountAmount(deliveryCharge);
      setCouponApplied(true);
      setCouponSuccessMsg("Success! Free shipping discount applied.");
    } else {
      setCouponError("Invalid coupon code! Try SAVE10 or AVAA100.");
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  };

  const grandTotal = Math.max(0, subtotal - discountAmount + (couponCode.toUpperCase() === "FREESHIP" ? 0 : deliveryCharge));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ fullName: true, mobileNumber: true, address: true });

    const fieldErrors = validate(!nameDisabled, !phoneDisabled, !addressDisabled);
    if (Object.keys(fieldErrors).length > 0) {
      alert("⚠️ Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save purchased items state first, before clearing cart
      setPurchasedItems(checkoutItems);

      const isCartOrder = slug === "cart";
      const requestBody: any = {
        type: isCartOrder ? "cart" : "buy_now",
        full_name: fullName,
        phone: mobileNumber,
        address: `${address}, ${district}`,
        payment_type: paymentMethod === "ONLINE" ? `ONLINE_${onlineMethod.toUpperCase()}` : paymentMethod.toUpperCase(),
        transaction_id: paymentMethod === "ONLINE" ? transactionId : "",
        delivery_charge: deliveryCharge,
        ...(user ? { user_id: user.id } : {}),
      };

      if (isCartOrder) {
        requestBody.items = checkoutItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }));
      } else {
        requestBody.product_id = product?.id;
        requestBody.quantity = quantity;
      }

      const response = await fetch(`${BASE_URL}/api/create-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to create order on backend.");
      }

      const data = await response.json();
      const confirmedOrderId = data.order_id || `ORDER-${data.id}`;
      setOrderId(confirmedOrderId);
      setOrderPlaced(true);

      // Save order to localStorage
      try {
        const savedOrders = JSON.parse(localStorage.getItem("placed_orders") || "[]");
        const newOrder = {
          order_id: confirmedOrderId,
          fullName,
          phone: mobileNumber,
          address: `${address}, ${district}`,
          paymentMethod: paymentMethod === "ONLINE" ? `ONLINE_${onlineMethod.toUpperCase()}` : paymentMethod.toUpperCase(),
          transaction_id: paymentMethod === "ONLINE" ? transactionId : "",
          product_name: isCartOrder 
            ? checkoutItems.map(item => `${item.product.name} (Qty: ${item.quantity})`).join(", ")
            : (product?.name || ""),
          product_image: isCartOrder 
            ? (checkoutItems[0]?.product?.image || "")
            : (product?.image || ""),
          quantity: isCartOrder 
            ? checkoutItems.reduce((sum, item) => sum + item.quantity, 0)
            : quantity,
          amount: grandTotal,
          status: "pending",
          created_at: new Date().toISOString()
        };
        localStorage.setItem("placed_orders", JSON.stringify([newOrder, ...savedOrders]));
      } catch (e) {
        console.error("Failed to save order to localStorage", e);
      }

      // Clean cart upon order placement
      clearCart();
    } catch (err: any) {
      console.error("Order creation failed:", err);
      alert(`Order placement failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle Download Receipt
  const handleDownloadReceipt = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    // Set styling
    // doc.setFont("Helvetica", "bold");
    // doc.setFontSize(22);
    // doc.setTextColor(232, 50, 10); // primary red color matching theme
    // doc.text("BUYFEST", 105, 20, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);

    const pageWidth = doc.internal.pageSize.getWidth();

    // Text widths
    const buyWidth = doc.getTextWidth("BUY");
    const festWidth = doc.getTextWidth("FEST");
    const totalWidth = buyWidth + festWidth;

    // Center position
    const startX = (pageWidth - totalWidth) / 2;

    // BUY - Blue
    doc.setTextColor(22, 73, 214);
    doc.text("BUY", startX, 20);

    // FEST - Orange
    doc.setTextColor(255, 87, 34);
    doc.text("FEST", startX + buyWidth, 20);



    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("www.buyfestbd.com", 105, 26, { align: "center" });

    // Decorative line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 32, 195, 32);

    // Invoice Details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("ORDER RECEIPT", 15, 42);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Order Reference: ${orderId}`, 15, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 56);

    // Shipping Section
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.text("Shipping & Customer Details", 15, 68);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Customer Name: ${fullName}`, 15, 76);
    doc.text(`Mobile Number: ${mobileNumber}`, 15, 82);
    doc.text(`Delivery Address: ${address}, ${district}`, 15, 88);
    const paymentLabel = paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod === "ONLINE" ? `Online (${onlineMethod.toUpperCase()})` : paymentMethod;
    doc.text(`Payment Method: ${paymentLabel}`, 15, 94);

    // Items Header
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 102, 195, 102);

    doc.setFont("Helvetica", "bold");
    doc.text("Item Details", 15, 108);
    doc.text("Qty", 150, 108, { align: "center" });
    doc.text("Price", 185, 108, { align: "right" });

    doc.line(15, 112, 195, 112);

    // Item rows
    doc.setFont("Helvetica", "normal");
    let currentY = 120;
    purchasedItems.forEach((item) => {
      const splitName = doc.splitTextToSize(item.product.name, 120);
      doc.text(splitName, 15, currentY);
      doc.text(String(item.quantity), 150, currentY, { align: "center" });
      doc.text(`BDT ${(Number(item.product.sell_price || 0) * item.quantity).toFixed(2)}`, 185, currentY, { align: "right" });
      currentY += (splitName.length * 6) + 4;
    });

    doc.line(15, currentY - 2, 195, currentY - 2);

    // Summary Section
    doc.text("Delivery Charge:", 130, currentY + 6);
    doc.text(`BDT ${deliveryCharge.toFixed(2)}`, 185, currentY + 6, { align: "right" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Paid:", 130, currentY + 14);
    doc.text(`BDT ${grandTotal.toFixed(2)}`, 185, currentY + 14, { align: "right" });

    // Footer
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for shopping with www.buyfestbd.com", 105, currentY + 30, { align: "center" });

    doc.save("order-receipt.pdf");
  };

  return (
    <div className="checkout-page-root">
      <div className="container">
        {orderPlaced ? (
          // Success State UI
          <div className="checkout-success-card" style={{ maxWidth: "650px", margin: "40px auto", padding: "40px 24px", background: "#fff", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 8px 30px rgba(0,0,0,0.05)", textAlign: "center" }}>
            <span style={{ fontSize: "72px", display: "block", marginBottom: "16px" }}>🎉</span>
            <h2 style={{ fontSize: "30px", fontWeight: "800", color: "#2e7d32", marginBottom: "12px" }}>Order Confirmed!</h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>
              Thank you for your order, <strong>{fullName}</strong>. Your order has been registered successfully.
            </p>

            <div style={{ background: "#f8f9fa", borderRadius: "8px", padding: "20px", textAlign: "left", marginBottom: "32px", border: "1px solid #eee" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "12px" }}>Order Specifications</h4>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Order Reference:</strong> <span style={{ color: "var(--primary)", fontWeight: "700" }}>{orderId}</span></p>
              <div style={{ margin: "6px 0", fontSize: "14px" }}>
                <strong>Items Purchased:</strong>
                <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
                  {purchasedItems.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>
                      {item.product.name} (Qty: {item.quantity}) - ৳{Number(item.product.sell_price || 0) * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Mobile Number:</strong> {mobileNumber}</p>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Shipping Address:</strong> {address}, {district}</p>
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Payment Method:</strong> {paymentMethod === "COD" ? "Cash on Delivery" : `Online (${onlineMethod.toUpperCase()})`}</p>
              {transactionId && <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Transaction ID:</strong> {transactionId}</p>}
              <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Total Payable:</strong> ৳{grandTotal}</p>
            </div>

            <div className="checkout-success-actions" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleDownloadReceipt}
                style={{
                  background: "#4caf50",
                  color: "#fff",
                  border: "none",
                  padding: "12px 30px",
                  borderRadius: "30px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.9)"}
                onMouseLeave={(e) => e.currentTarget.style.filter = "none"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Receipt
              </button>
              <Link href="/" style={{ background: "var(--primary)", color: "#fff", textDecoration: "none", padding: "12px 30px", borderRadius: "30px", fontWeight: "700", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.9)"} onMouseLeave={(e) => e.currentTarget.style.filter = "none"}>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          // Split checkout layout
          <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>

            {/* LEFT SIDE: ORDER FORM */}
            <div className="checkout-form-left">
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "2px solid var(--border-light)", paddingBottom: "12px" }}>
                <span></span> Shipping & Billing Information
              </h2>

              <form onSubmit={handlePlaceOrder}>
                {hasProfileAddress && (
                  <div style={{ marginBottom: "20px", padding: "14px", background: "#f0f7ff", border: "1px solid #bae7ff", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#0050b3", marginBottom: "8px", letterSpacing: "0.5px" }}>
                      Delivery Destination Option
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="addressOption"
                          value="profile"
                          checked={addressOption === "profile"}
                          onChange={() => setAddressOption("profile")}
                        />
                        Profile Shipping Address
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="addressOption"
                          value="new"
                          checked={addressOption === "new"}
                          onChange={() => setAddressOption("new")}
                        />
                        New Address
                      </label>
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={MAX_CHARS}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={nameDisabled}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${touched.fullName && errors.fullName ? "#ef4444" : "#ddd"}`,
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.2s",
                      background: nameDisabled ? "#f5f5f5" : touched.fullName && errors.fullName ? "#fef2f2" : "#fff",
                      cursor: nameDisabled ? "not-allowed" : "text",
                      color: nameDisabled ? "#666" : "var(--text-primary)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => { if (!errors.fullName) e.target.style.borderColor = "#ddd"; blur("fullName")(); }}
                  />
                  {touched.fullName && errors.fullName && (
                    <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 500, marginTop: "4px", display: "block" }}>{errors.fullName}</span>
                  )}

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
                    disabled={phoneDisabled}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${touched.mobileNumber && errors.mobileNumber ? "#ef4444" : "#ddd"}`,
                      fontSize: "14px",
                      outline: "none",
                      background: phoneDisabled ? "#f5f5f5" : touched.mobileNumber && errors.mobileNumber ? "#fef2f2" : "#fff",
                      cursor: phoneDisabled ? "not-allowed" : "text",
                      color: phoneDisabled ? "#666" : "var(--text-primary)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => { if (!errors.mobileNumber) e.target.style.borderColor = "#ddd"; blur("mobileNumber")(); }}
                  />
                  {touched.mobileNumber && errors.mobileNumber && (
                    <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 500, marginTop: "4px", display: "block" }}>{errors.mobileNumber}</span>
                  )}
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
                    {districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} (Delivery Charge: ৳{d.delivery_charge})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Address */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>Full Address *</label>
                  <textarea
                    required
                    maxLength={MAX_CHARS}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Village/Area, House No, Road, Flat Number, Landmarks"
                    rows={3}
                    disabled={addressDisabled}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${touched.address && errors.address ? "#ef4444" : "#ddd"}`,
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "none",
                      outline: "none",
                      background: addressDisabled ? "#f5f5f5" : touched.address && errors.address ? "#fef2f2" : "#fff",
                      cursor: addressDisabled ? "not-allowed" : "text",
                      color: addressDisabled ? "#666" : "var(--text-primary)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => { if (!errors.address) e.target.style.borderColor = "#ddd"; blur("address")(); }}
                  />
                  {touched.address && errors.address && (
                    <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 500, marginTop: "4px", display: "block" }}>{errors.address}</span>
                  )}

                </div>

                {/* Coupon Code Section — MUTED (not implemented yet) */}
                {/* <div style={{ background: "#fdf8f6", border: "1px dashed #ffccc7", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "var(--primary)" }}>🏷️ Apply Coupon Code</label>
                  <div className="checkout-coupon-row" style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="e.g. enter coupon code if have"
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
                </div> */}


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
                          Cash on Delivery (COD)
                        </strong>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Pay with cash upon delivery
                        </span>
                      </div>
                    </label>

                    {/* Online Payment */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: paymentMethod === "ONLINE" ? "#fdfbfb" : "#fff",
                        borderColor: paymentMethod === "ONLINE" ? "var(--primary)" : "#ddd",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "ONLINE"}
                        onChange={() => { setPaymentMethod("ONLINE"); setOnlineMethod(""); setTransactionId(""); }}
                      />
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>
                          Online Payment
                        </strong>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Pay via bKash / Nagad / Rocket / Upay
                        </span>
                      </div>
                    </label>

                    {paymentMethod === "ONLINE" && (
                      <div style={{ padding: "16px", background: "#fafafa", borderRadius: "8px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Select your payment method:</p>
                        <div className="checkout-payment-methods-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          {[
                            { id: "bkash", label: "bKash", color: "#E2136E" },
                            { id: "nagad", label: "Nagad", color: "#F5821F" },
                            { id: "rocket", label: "Rocket", color: "#ED1C24" },
                            { id: "upay", label: "Upay", color: "#0EA5E9" },
                          ].map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setOnlineMethod(m.id)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: onlineMethod === m.id ? `2px solid ${m.color}` : "1px solid var(--border)",
                                background: onlineMethod === m.id ? "#fff" : "#fff",
                                fontWeight: onlineMethod === m.id ? "700" : "500",
                                color: onlineMethod === m.id ? m.color : "var(--text-secondary)",
                                cursor: "pointer",
                                fontSize: "13px",
                                transition: "all 0.2s",
                              }}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>

                        {onlineMethod && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px", background: "#fff", borderRadius: "8px", border: "1px solid var(--border)" }}>
                            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                              Make Payment or Cash out
                            </p>
                            <p style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "1px" }}>
                              {receiverNumber}
                            </p>
                            <div style={{ borderTop: "1px dashed var(--border-light)", paddingTop: "10px" }}>
                              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                                Transaction ID
                              </label>
                              <input
                                type="text"
                                placeholder="Enter your transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                                required={paymentMethod === "ONLINE"}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="checkout-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="checkout-spinner" style={{ width: "18px", height: "18px", border: "2px solid #fff", borderTop: "2px solid transparent", margin: 0 }}></div>
                      Processing Order...
                    </>
                  ) : (
                    <> Place Order (৳{grandTotal})</>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT SIDE: ORDER SUMMARY */}
            <div className="checkout-order-summary" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px", boxShadow: "var(--shadow-sm)", position: "sticky", top: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px", color: "var(--text-primary)" }}>
                  🛍️ Order Summary
                </h3>

                {/* Product Detail Cards */}
                <div style={{ maxHeight: "280px", overflowY: "auto", marginBottom: "18px", paddingBottom: "8px", borderBottom: "1px solid #f5f5f5" }}>
                  {checkoutItems.map((item, idx) => {
                    const itemUnitPrice = Number(item.product.sell_price || 0);
                    return (
                      <div key={idx} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                        <div style={{ width: "60px", height: "60px", background: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #eee", flexShrink: 0 }}>
                          {item.product.image ? (
                            <Image
                              src={item.product.image.startsWith("http") ? item.product.image : `${BASE_URL}${item.product.image}`}
                              alt={item.product.name}
                              width={50}
                              height={50}
                              style={{ objectFit: "contain" }}
                              unoptimized
                            />
                          ) : (
                            <span style={{ fontSize: "10px", color: "#999" }}>No Image</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2px", lineHeight: "1.3" }}>{item.product.name}</h4>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>Category: {item.product.category?.name || "Gadgets"}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)" }}>৳{itemUnitPrice}</span>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>x {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Item Billing Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Subtotal ({checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
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
      {/* <TopBar /> */}
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
