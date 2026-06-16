"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Mail,
  Camera,
  ShoppingBag,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

interface OrderItem {
  id: number;
  product: {
    name: string;
    image?: string;
  };
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  status: string;
  payment_type: string;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
  total_amount: string;
  amount: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const { user, isLoading, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [isEditing, setIsEditing] = useState(false);

  // Form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Image states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | ""; text: string }>({
    type: "",
    text: "",
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  // Fetch orders
  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/orders/customer/?user_id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch customer orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const handleLoginClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      const loginBtn = document.getElementById("account-login-btn");
      if (loginBtn) loginBtn.click();
    }, 400);
  };

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Show immediate preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setIsUploading(true);
    setStatusMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/profile/${user.id}/`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateUser({ avatar: data.avatar });
        setStatusMessage({ type: "success", text: "Profile picture uploaded successfully!" });
      } else {
        const data = await res.json();
        setStatusMessage({ type: "error", text: data.error || "Failed to upload profile picture." });
        setAvatarPreview(user.avatar || null); // revert preview on error
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error during avatar upload." });
      setAvatarPreview(user.avatar || null); // revert preview
    } finally {
      setIsUploading(false);
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${BASE_URL}/api/auth/profile/${user.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          address: address,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateUser({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        });
        setStatusMessage({ type: "success", text: "Profile details updated successfully!" });
        setIsEditing(false);
      } else {
        const data = await res.json();
        setStatusMessage({ type: "error", text: data.error || "Failed to update profile details." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = () => {
    if (!user) return "";
    if (user.first_name) return user.first_name[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    return "U";
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Header />
      <main className="profile-main-content">
        <div className="profile-container">

          {isLoading ? (
            /* LOADING SKELETON */
            <div className="profile-loading-skeleton">
              <Loader2 className="spinner" size={40} />
              <p>Loading your profile details...</p>
            </div>
          ) : !user ? (
            /* ACCESS DENIED GATE */
            <div className="profile-auth-gate">
              <div className="auth-gate-card">
                <div className="auth-gate-icon-wrap">
                  <Lock size={36} />
                </div>
                <h2 className="auth-gate-title">Login Required</h2>
                <p className="auth-gate-desc">
                  You must be logged in to view and manage your account profile.
                </p>
                <button onClick={handleLoginClick} className="auth-gate-btn">
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            /* PROFILE DASHBOARD */
            <div className="profile-dashboard-layout">

              {/* LEFT COLUMN: OVERVIEW */}
              <div className="profile-sidebar-card">

                {/* Avatar Section */}
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-container">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview.startsWith("http") ? avatarPreview : `${BASE_URL}${avatarPreview}`}
                        alt="Profile picture"
                        className="profile-avatar-img"
                      />
                    ) : (
                      <span className="profile-avatar-placeholder">{getInitials()}</span>
                    )}

                    <button
                      type="button"
                      className={`profile-avatar-edit-btn ${isUploading ? "disabled" : ""}`}
                      onClick={handleAvatarEditClick}
                      disabled={isUploading}
                      aria-label="Upload profile image"
                    >
                      {isUploading ? (
                        <Loader2 className="spinner" size={16} />
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div className="profile-user-summary">
                  <h3 className="profile-user-fullname">
                    {user.first_name ? `${user.first_name} ${user.last_name}`.trim() : "New Customer"}
                  </h3>
                  <p className="profile-user-username">@{user.username}</p>
                  <span className="profile-badge">Customer Account</span>
                </div>

                <div className="profile-sidebar-divider" />

                {/* Sidebar Navigation */}
                <nav className="profile-sidebar-nav">
                  <button
                    onClick={() => { setActiveTab("info"); setStatusMessage({ type: "", text: "" }); }}
                    className={`profile-nav-item ${activeTab === "info" ? "active" : ""}`}
                  >
                    <UserIcon size={18} />
                    <span>Personal Info</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("orders"); setStatusMessage({ type: "", text: "" }); }}
                    className={`profile-nav-item ${activeTab === "orders" ? "active" : ""}`}
                  >
                    <ShoppingBag size={18} />
                    <span>Order History ({orders.length})</span>
                  </button>
                </nav>
              </div>

              {/* RIGHT COLUMN: DETAIL TABS */}
              <div className="profile-content-card">

                {/* STATUS ALERT MESSAGE */}
                {statusMessage.text && (
                  <div className={`profile-status-alert ${statusMessage.type}`}>
                    {statusMessage.type === "success" ? (
                      <CheckCircle2 size={18} className="alert-icon" />
                    ) : (
                      <AlertCircle size={18} className="alert-icon" />
                    )}
                    <span className="alert-text">{statusMessage.text}</span>
                  </div>
                )}

                {/* TAB CONTENT: PERSONAL DETAILS */}
                {activeTab === "info" && (
                  <div className="profile-tab-pane">
                    <div className="tab-pane-header">
                      <h2 className="tab-pane-title">Personal Information</h2>
                      <p className="tab-pane-desc">
                        {isEditing
                          ? "Update your personal information and delivery destination details."
                          : "View your personal profile details."}
                      </p>
                    </div>

                    {!isEditing ? (
                      /* READ ONLY MODE */
                      <div className="profile-details-view">
                        <div className="profile-details-grid">
                          <div className="detail-item">
                            <span className="detail-label">First Name</span>
                            <span className="detail-value">{user.first_name || "—"}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Last Name</span>
                            <span className="detail-value">{user.last_name || "—"}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Email Address</span>
                            <span className="detail-value">{user.email || "—"}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Phone Number</span>
                            <span className="detail-value">{user.phone || "—"}</span>
                          </div>
                          <div className="detail-item full-width">
                            <span className="detail-label">Shipping Address</span>
                            <span className="detail-value address-value">{user.address || "—"}</span>
                          </div>
                        </div>
                        <div className="profile-view-actions">
                          <button
                            type="button"
                            className="profile-edit-toggle-btn"
                            onClick={() => setIsEditing(true)}
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* EDIT MODE FORM */
                      <form onSubmit={handleInfoSubmit} className="profile-info-form">
                        <div className="form-row-two">
                          <div className="form-group">
                            <label className="form-label" htmlFor="first-name">First Name</label>
                            <div className="input-with-icon">
                              <span className="input-icon"><UserIcon size={18} /></span>
                              <input
                                id="first-name"
                                type="text"
                                className="form-input"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="last-name">Last Name</label>
                            <div className="input-with-icon">
                              <span className="input-icon"><UserIcon size={18} /></span>
                              <input
                                id="last-name"
                                type="text"
                                className="form-input"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="email-address">Email Address</label>
                          <div className="input-with-icon">
                            <span className="input-icon"><Mail size={18} /></span>
                            <input
                              id="email-address"
                              type="email"
                              className="form-input"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="username@example.com"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="phone-number">Phone Number</label>
                          <div className="input-with-icon">
                            <span className="input-icon"><Phone size={18} /></span>
                            <input
                              id="phone-number"
                              type="tel"
                              className="form-input"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="e.g. +8801700000000"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="shipping-address">Shipping Address</label>
                          <div className="textarea-with-icon">
                            <span className="textarea-icon"><MapPin size={18} /></span>
                            <textarea
                              id="shipping-address"
                              className="form-textarea"
                              rows={4}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Enter your complete home/office delivery address..."
                            />
                          </div>
                        </div>

                        <div className="form-actions">
                          <button
                            type="button"
                            className="profile-cancel-btn"
                            onClick={() => {
                              // Reset state variables to persisted user details
                              setFirstName(user.first_name || "");
                              setLastName(user.last_name || "");
                              setEmail(user.email || "");
                              setPhone(user.phone || "");
                              setAddress(user.address || "");
                              setIsEditing(false);
                              setStatusMessage({ type: "", text: "" });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="profile-save-btn"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="spinner animate-spin" size={16} style={{ marginRight: "8px" }} />
                                <span>Saving Changes...</span>
                              </>
                            ) : (
                              <span>Save Changes</span>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: ORDER HISTORY */}
                {activeTab === "orders" && (
                  <div className="profile-tab-pane">
                    <div className="tab-pane-header">
                      <h2 className="tab-pane-title">Order History</h2>
                      <p className="tab-pane-desc">Track and view details of your previous store purchases.</p>
                    </div>

                    {ordersLoading ? (
                      <div className="orders-loading-state">
                        <Loader2 className="spinner" size={30} />
                        <p>Fetching your orders history...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="orders-empty-state">
                        <div className="empty-state-icon"><ShoppingBag size={40} /></div>
                        <h3>No Orders Found</h3>
                        <p>You haven&apos;t placed any orders with BuyFest yet.</p>
                        <Link href="/" className="empty-state-btn">Shop Now</Link>
                      </div>
                    ) : (
                      <div className="profile-orders-list">
                        <div className="orders-table-wrapper">
                          <table className="orders-table">
                            <thead>
                              <tr>
                                <th>Order ID</th>
                                <th>Date Placed</th>
                                <th>Total Price</th>
                                <th>Payment</th>
                                <th>Shipment Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => (
                                <tr key={order.id}>
                                  <td className="order-id">#BF-{order.id}</td>
                                  <td>{formatDate(order.created_at)}</td>
                                  <td className="order-amount">৳{Number(order.total_amount || order.amount).toFixed(2)}</td>
                                  <td className="order-payment">{order.payment_type}</td>
                                  <td>
                                    <span className={`status-badge ${order.status}`}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Link href="/orders" className="order-view-link">
                                      <FileText size={14} style={{ marginRight: "4px" }} />
                                      Track
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
