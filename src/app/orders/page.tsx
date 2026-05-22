"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BASE_URL = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000");

interface OrderItem {
  product_name: string;
  product_image: string | null;
  quantity: number;
  amount: number;
  paymentMethod: string;
  fullName: string;
  phone: string;
  address: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
  order_id: string;
}

export default function MyOrdersPage() {
  const [localOrders, setLocalOrders] = useState<OrderItem[]>([]);
  const [searchResults, setSearchResults] = useState<OrderItem[] | null>(null);
  const [searchVal, setSearchVal] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchMsg, setSearchMsg] = useState("");

  // Load orders placed on this device from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("placed_orders");
    if (saved) {
      try {
        setLocalOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchVal.trim();
    if (!query) {
      setSearchResults(null);
      setSearchMsg("");
      return;
    }

    setSearching(true);
    setSearchMsg("");

    try {
      // 1. Fetch all orders from backend to look up matching details
      const response = await fetch(`${BASE_URL}/api/orders/list/`);
      if (!response.ok) throw new Error("Backend API down");

      const result = await response.json();
      const allBackendOrders = result.data || [];

      // Filter backend orders by matching Phone Number or Order Reference
      const matched = allBackendOrders.filter((ord: any) => {
        const orderRef = ord.order_id || `ORDER-${ord.id}`;
        const phoneMatch = ord.phone?.trim() === query || ord.phone?.trim().includes(query);
        const refMatch = orderRef.toLowerCase() === query.toLowerCase() || orderRef.toLowerCase().includes(query.toLowerCase());
        return phoneMatch || refMatch;
      });

      if (matched.length > 0) {
        // Map backend orders structure to our OrderItem format
        const mappedOrders: OrderItem[] = matched.map((ord: any) => {
          // If items exist, get the first one's detail or standard details
          const firstItem = ord.items?.[0] || {};
          const prodName = firstItem.product?.name || "Premium Gadget";
          const prodImg = firstItem.product?.image || null;
          const prodQty = firstItem.quantity || 1;

          return {
            order_id: ord.order_id || `ORDER-${ord.id}`,
            fullName: ord.full_name,
            phone: ord.phone,
            address: ord.address,
            paymentMethod: ord.payment_type || "COD",
            product_name: prodName,
            product_image: prodImg,
            quantity: prodQty,
            amount: Number(ord.amount),
            status: ord.status || "pending",
            created_at: ord.created_at || new Date().toISOString(),
          };
        });

        setSearchResults(mappedOrders);
        setSearchMsg(`🎉 Found ${mappedOrders.length} order(s) matching your query!`);
      } else {
        // 2. Fallback to searching locally in localStorage
        const localMatches = localOrders.filter((ord) => {
          const phoneMatch = ord.phone?.trim() === query || ord.phone?.trim().includes(query);
          const refMatch = ord.order_id.toLowerCase() === query.toLowerCase() || ord.order_id.toLowerCase().includes(query.toLowerCase());
          return phoneMatch || refMatch;
        });

        if (localMatches.length > 0) {
          setSearchResults(localMatches);
          setSearchMsg(`🎉 Found ${localMatches.length} order(s) inside your local device history!`);
        } else {
          setSearchResults([]);
          setSearchMsg("❌ No orders found matching that Mobile Number or Order Reference on our system.");
        }
      }
    } catch (err) {
      console.warn("Failed to fetch backend order list, searching locally:", err);
      // Fallback search locally
      const localMatches = localOrders.filter((ord) => {
        const phoneMatch = ord.phone?.trim() === query || ord.phone?.trim().includes(query);
        const refMatch = ord.order_id.toLowerCase() === query.toLowerCase() || ord.order_id.toLowerCase().includes(query.toLowerCase());
        return phoneMatch || refMatch;
      });

      if (localMatches.length > 0) {
        setSearchResults(localMatches);
        setSearchMsg(`🎉 Found ${localMatches.length} order(s) inside your local device history!`);
      } else {
        setSearchResults([]);
        setSearchMsg("❌ No matching orders found. (Database connection is offline)");
      }
    } finally {
      setSearching(false);
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "0%";
      case "processing": return "50%";
      case "completed": return "100%";
      case "cancelled": return "100%";
      default: return "0%";
    }
  };

  const ordersToDisplay = searchResults !== null ? searchResults : localOrders;

  return (
    <>
      <TopBar />
      <Header />

      <div className="orders-page-container">
        {/* Breadcrumbs */}
        <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>My Orders</span>
        </div>

        {/* Header Section */}
        <div className="orders-title-sec">
          <div>
            <h1>Order History & Tracking</h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "13px" }}>
              Track placed orders, view shipping details, and check real-time status.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="order-search-box">
            <input
              type="text"
              className="order-search-input"
              placeholder="Enter Mobile No or Order Ref..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit" className="order-search-btn" disabled={searching}>
              {searching ? "Searching..." : "Track"}
            </button>
          </form>
        </div>

        {searchMsg && (
          <div style={{ padding: "12px 16px", borderRadius: "8px", background: searchResults && searchResults.length > 0 ? "#f6ffed" : "#fff2f0", border: searchResults && searchResults.length > 0 ? "1px solid #b7eb8f" : "1px solid #ffccc7", color: searchResults && searchResults.length > 0 ? "#389e0d" : "#ff4d4f", fontSize: "13px", fontWeight: "600", marginBottom: "24px" }}>
            {searchMsg}
          </div>
        )}

        {/* Orders list rendering */}
        {ordersToDisplay.length > 0 ? (
          <div className="orders-list">
            {ordersToDisplay.map((order) => {
              const orderDateStr = new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              const isCancelled = order.status.toLowerCase() === "cancelled";

              return (
                <div key={order.order_id} className="order-history-card">
                  {/* Card Top */}
                  <div className="order-card-header">
                    <div>
                      <div className="order-ref">Order Reference: <span>{order.order_id}</span></div>
                      <div className="order-date">Placed on {orderDateStr}</div>
                    </div>

                    <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Card Middle Grid */}
                  <div className="order-card-body">
                    {/* Item details */}
                    <div className="order-item-detail">
                      <div className="order-item-img-wrap">
                        {order.product_image ? (
                          <Image
                            src={order.product_image.startsWith("http") ? order.product_image : `${BASE_URL}${order.product_image}`}
                            alt={order.product_name}
                            width={54}
                            height={54}
                            unoptimized
                          />
                        ) : (
                          <span style={{ fontSize: "10px", color: "#aaa" }}>No Image</span>
                        )}
                      </div>

                      <div className="order-item-info">
                        <h4>{order.product_name}</h4>
                        <p>Quantity: {order.quantity} | Total paid: <strong style={{ color: "var(--primary)", fontSize: "14px" }}>৳{order.amount}</strong></p>
                        <p style={{ marginTop: "4px" }}>Payment Method: <strong>{order.paymentMethod === "COD" ? "💵 Cash on Delivery" : `📱 ${order.paymentMethod}`}</strong></p>
                      </div>
                    </div>

                    {/* Shipping Address Summary */}
                    <div className="order-shipping-summary">
                      <h5>Shipping Details</h5>
                      <p><strong>Customer Name:</strong> {order.fullName}</p>
                      <p><strong>Mobile No:</strong> {order.phone}</p>
                      <p><strong>Full Address:</strong> {order.address}</p>
                    </div>
                  </div>

                  {/* Live Tracking Progress Bar */}
                  {!isCancelled ? (
                    <div className="order-progress-bar-container">
                      <div className="order-progress-track">
                        <div className="order-progress-line" style={{ width: getProgressWidth(order.status) }}></div>

                        <div className="order-progress-step completed">
                          <div className="order-progress-dot">✓</div>
                          <span className="order-progress-text">Confirmed</span>
                        </div>

                        <div className={`order-progress-step ${order.status.toLowerCase() === "processing" || order.status.toLowerCase() === "completed" ? "completed" : ""}`}>
                          <div className="order-progress-dot">⚙️</div>
                          <span className="order-progress-text">Processing</span>
                        </div>

                        <div className={`order-progress-step ${order.status.toLowerCase() === "completed" ? "completed" : ""}`}>
                          <div className="order-progress-dot">🎁</div>
                          <span className="order-progress-text">Completed</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: "20px", padding: "10px 16px", background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: "var(--radius)", color: "#cf1322", fontSize: "12px", fontWeight: "600" }}>
                      🛑 This order has been cancelled by backend administration. Please place a new order or contact outlet support.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "80px 32px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <span style={{ fontSize: "72px", display: "block", marginBottom: "16px" }}>🛍️</span>
            <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "12px" }}>No Placed Orders Found</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "480px", margin: "0 auto 32px", lineHeight: "1.6" }}>
              We couldn't find any orders stored locally on this device. If you've placed an order, search for it using your <strong>Mobile Number</strong> or <strong>Order Reference</strong> in the tracking search box above!
            </p>

            <Link href="/" className="continue-shopping" style={{ background: "var(--primary)", color: "#fff", padding: "12px 32px", borderRadius: "30px", fontWeight: "700" }}>
              Shop Hot Gadgets Now
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
