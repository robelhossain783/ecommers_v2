"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/backend_type";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

export default function AddToCarts() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  // Form states
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setFullName] = useState("");
  const [phone, setMobileNumber] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const deliveryCharge = deliveryArea === "inside" ? 80 : 150;

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.product.sell_price) * item.quantity,
    0
  );

  // 
  const total = subtotal + deliveryCharge;

  const handleQuantityChange = (productId: number, newQty: number) => {
    updateQuantity(productId, newQty);
  };

  // const handleCheckoutSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!name || !phone || !address) {
  //     alert("⚠️ Please fill in all shipping details.");
  //     return;
  //   }

  //   // Generate mock order ID
  //   const randomId = "AG-" + Math.floor(100000 + Math.random() * 900000);
  //   setOrderId(randomId);
  //   setOrderPlaced(true);

  //   // Clear global cart
  //   clearCart();
  // };
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !address || !district) {
      alert("⚠️ Please fill in all shipping details.");
      return;
    }

    try {
      // cart empty check
      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      // each cart item order create
      for (const item of cart) {
        const response = await fetch(
          `${BASE_URL}/api/create-order/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              type: "buy_now",

              product_id: item.product.id,
              quantity: item.quantity,

              full_name: name,
              phone: phone,

              address: `${address}, ${district}`,

              payment_type: paymentMethod.toUpperCase(),
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));

          console.log(errData);

          throw new Error(
            errData.message || "Failed to place cart order"
          );
        }

        const data = await response.json();
        const confirmedOrderId = data.order_id || `ORDER-${data.id}`;

        // last order id
        setOrderId(confirmedOrderId);

        // Save order to localStorage
        try {
          const savedOrders = JSON.parse(localStorage.getItem("placed_orders") || "[]");
          const newOrder = {
            order_id: confirmedOrderId,
            fullName: name,
            phone: phone,
            address: `${address}, ${district}`,
            paymentMethod: paymentMethod.toUpperCase(),
            product_name: item.product.name,
            product_image: item.product.image,
            quantity: item.quantity,
            amount: Number(item.product.sell_price) * item.quantity + Math.round(deliveryCharge / cart.length),
            status: "pending",
            created_at: new Date().toISOString()
          };
          localStorage.setItem("placed_orders", JSON.stringify([newOrder, ...savedOrders]));
        } catch (e) {
          console.error("Failed to save order to localStorage", e);
        }
      }

      setOrderPlaced(true);

      clearCart();

    } catch (error: any) {
      console.error("ORDER ERROR:", error);

      alert(
        `❌ Order failed: ${error.message || "Something went wrong"}`
      );
    }
  };

  return (
    <>
      {/* <TopBar /> */}
      <Header />

      <div className="cart-container">
        {orderPlaced ? (
          <div style={{ textAlign: "center", padding: "60px 16px", background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)" }}>
            <span style={{ fontSize: "64px" }}>🎉</span>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#2e7d32", margin: "16px 0 8px" }}>
              Order Placed Successfully!
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Thank you for shopping with Avaa Gadgets. Your Order ID is <strong>{orderId}</strong>.
            </p>
            <div style={{ maxWidth: "450px", margin: "0 auto", padding: "16px", background: "#f9f9f9", borderRadius: "var(--radius-sm)", textAlign: "left", fontSize: "14px", border: "1px solid var(--border-light)", marginBottom: "24px" }}>
              <h4 style={{ margin: "0 0 10px", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>Shipping Details</h4>
              <p style={{ margin: "4px 0" }}><strong>Name:</strong> {name}</p>
              <p style={{ margin: "4px 0" }}><strong>Phone:</strong> {phone}</p>
              <p style={{ margin: "4px 0" }}><strong>Address:</strong> {address}</p>
              <p style={{ margin: "4px 0" }}><strong>Delivery:</strong> {deliveryArea === "inside" ? "Dhaka City (৳80)" : "Outside Dhaka (৳150)"}</p>
              <p style={{ margin: "4px 0" }}><strong>Payment:</strong> {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "bkash" ? "bKash / Nagad" : "Card Payment"}</p>
            </div>
            <Link href="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart-view">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your Cart is Empty</h2>
            <p className="empty-cart-desc">
              Looks like you haven't added anything to your cart yet. Explore our top gadgets and accessories!
            </p>
            <Link href="/" className="continue-shopping">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <h1 className="cart-title">Shopping Cart ({cart.length} item{cart.length > 1 ? "s" : ""})</h1>

            <div className="cart-layout">
              {/* LEFT SIDE: PRODUCTS */}
              <div className="cart-items-panel">
                {cart.map((item) => {
                  const itemPrice = Number(item.product.sell_price);
                  return (
                    <div key={item.product.id} className="cart-item-row">
                      <div className="cart-item-image-wrap">
                        {item.product.image ? (
                          <Image
                            src={item.product.image.startsWith("http") ? item.product.image : `${BASE_URL}${item.product.image}`}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="cart-item-image"
                            unoptimized
                          />
                        ) : (
                          <div style={{ fontSize: "12px", color: "#ccc" }}>No Image</div>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.product.name}</h3>
                        <p className="cart-item-category">{item.product.category?.name || "Gadget"}</p>
                      </div>

                      {/* QTY CONTROL */}
                      <div className="quantity-control" style={{ height: "36px" }}>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="quantity-control-btn"
                          style={{ width: "30px" }}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="quantity-input"
                          style={{ width: "40px", fontSize: "13px" }}
                        />
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="quantity-control-btn"
                          style={{ width: "30px" }}
                        >
                          +
                        </button>
                      </div>

                      {/* PRICE calculation */}
                      <div className="cart-item-price-sec">
                        <span className="cart-item-price">৳{itemPrice * item.quantity}</span>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          ৳{itemPrice} each
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="cart-item-delete"
                        title="Remove product"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT SIDE: SUMMARY & CHECKOUT FORM */}
              <div className="cart-summary-panel">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>৳{subtotal}</strong>
                </div>

                <div className="summary-row">
                  <span>Delivery Charge</span>
                  <strong>৳{deliveryCharge}</strong>
                </div>

                <div className="summary-row total">
                  <span>Grand Total</span>
                  <strong>৳{total}</strong>
                </div>

                {/* SHIPPING DETAILS FORM */}
                <form onSubmit={handleCheckoutSubmit} className="checkout-form-panel">
                  <h4 style={{ margin: "0 0 16px", color: "var(--text-primary)", fontSize: "15px", fontWeight: "700" }}>
                    Shipping Details
                  </h4>

                  <div className="form-group">
                    <label className="form-label">Customer Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Enter your full name"
                      required
                      value={name}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 017XXXXXXXX"
                      required
                      value={phone}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Delivery Address *</label>
                    <textarea
                      className="form-input"
                      placeholder="House No, Road No, Area, District"
                      style={{ minHeight: "60px", fontFamily: "inherit" }}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Zone</label>
                    <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={deliveryArea === "inside"}
                          onChange={() => setDeliveryArea("inside")}
                        />
                        Inside Dhaka (৳80)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={deliveryArea === "outside"}
                          onChange={() => setDeliveryArea("outside")}
                        />
                        Outside Dhaka (৳150)
                      </label>
                    </div>
                  </div>

                  {/* <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label className="form-label">Payment Method</label>

                    <select
                      className="form-input"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="BKASH">bKash Payment</option>
                      <option value="NAGAD">Nagad Payment</option>
                    </select>
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
                            bKash Payment
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
                            Nagad Payment
                          </strong>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            Pay using Nagad mobile banking
                          </span>
                        </div>
                      </label>

                    </div>
                  </div>

                  <button type="submit" className="checkout-btn">
                    Place Order (৳{total})
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
