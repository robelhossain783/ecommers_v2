"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
// TypeScript Interfaces based on Django Backend structures
interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
}

interface Product {
  id: number;
  category: Category | number;
  name: string;
  slug: string;
  image: string | null;
  description: string;
  sell_price: string;
  regular_price: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
}

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    sell_price: string;
  } | null;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  customer_id: string;
  payment_type: "COD" | "BKASH" | "NAGAD";
  full_name: string;
  phone: string;
  address: string;
  amount: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
  items: OrderItem[];
}

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "categories">("dashboard");

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Data lists
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Loading states
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Forms statuses
  const [productSubmitLoading, setProductSubmitLoading] = useState(false);
  const [categorySubmitLoading, setCategorySubmitLoading] = useState(false);

  const [productFormMsg, setProductFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [categoryFormMsg, setCategoryFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Category Form fields
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [catImagePreview, setCatImagePreview] = useState<string | null>(null);

  // Product Form fields
  const [prodName, setProdName] = useState("");
  const [prodSlug, setProdSlug] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState("");
  const [prodSellPrice, setProdSellPrice] = useState("");
  const [prodRegPrice, setProdRegPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodActive, setProdActive] = useState(true);
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  const [prodImagePreview, setProdImagePreview] = useState<string | null>(null);

  // Fetch functions
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch(`${BASE_URL}/api/categories/list/`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${BASE_URL}/api/products/list/?all=true`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/list/`);
      if (res.ok) {
        const result = await res.json();
        setOrders(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Auto-fill slug from name helpers
  const handleCatNameChange = (val: string) => {
    setCatName(val);
    setCatSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleProdNameChange = (val: string) => {
    setProdName(val);
    setProdSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  // Image change handlers with preview
  const handleCatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCatImageFile(file);
      setCatImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProdImageFile(file);
      setProdImagePreview(URL.createObjectURL(file));
    }
  };

  // Form Submissions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormMsg(null);

    if (!catName || !catSlug) {
      setCategoryFormMsg({ type: "error", text: "Name and Slug are required!" });
      return;
    }

    setCategorySubmitLoading(true);
    const formData = new FormData();
    formData.append("name", catName);
    formData.append("slug", catSlug);
    formData.append("is_active", "true");
    if (catImageFile) {
      formData.append("image", catImageFile);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/categories/create/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setCategoryFormMsg({ type: "success", text: "🎉 Category created successfully!" });
        // Reset form
        setCatName("");
        setCatSlug("");
        setCatImageFile(null);
        setCatImagePreview(null);
        // Refresh categories
        fetchCategories();
      } else {
        const errorText = JSON.stringify(responseData);
        setCategoryFormMsg({ type: "error", text: `❌ Failed to create category: ${errorText}` });
      }
    } catch (err) {
      setCategoryFormMsg({ type: "error", text: "❌ Connection error to backend API." });
      console.error(err);
    } finally {
      setCategorySubmitLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormMsg(null);

    if (!prodName || !prodSlug || !prodCategoryId || !prodSellPrice || !prodImageFile) {
      setProductFormMsg({ type: "error", text: "Name, Slug, Category, Sale Price, and Image are required!" });
      return;
    }

    setProductSubmitLoading(true);
    const formData = new FormData();
    formData.append("name", prodName);
    formData.append("slug", prodSlug);
    formData.append("category", prodCategoryId);
    formData.append("sell_price", prodSellPrice);
    formData.append("regular_price", prodRegPrice || prodSellPrice);
    formData.append("description", prodDesc);
    formData.append("stock", prodStock || "0");
    formData.append("is_active", prodActive ? "true" : "false");
    formData.append("image", prodImageFile);

    try {
      const res = await fetch(`${BASE_URL}/api/products/create/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setProductFormMsg({ type: "success", text: "🎉 Product created successfully!" });
        // Reset form
        setProdName("");
        setProdSlug("");
        setProdCategoryId("");
        setProdSellPrice("");
        setProdRegPrice("");
        setProdDesc("");
        setProdStock("");
        setProdActive(true);
        setProdImageFile(null);
        setProdImagePreview(null);
        // Refresh products
        fetchProducts();
      } else {
        const errorText = JSON.stringify(responseData);
        setProductFormMsg({ type: "error", text: `❌ Failed to create product: ${errorText}` });
      }
    } catch (err) {
      setProductFormMsg({ type: "error", text: "❌ Connection error to backend API." });
      console.error(err);
    } finally {
      setProductSubmitLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!username || !password) {
      setAuthError("❌ Username and password are required!");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess("🎉 Login successful! Redirecting...");
        localStorage.setItem("adminUser", JSON.stringify(data));
        setTimeout(() => {
          setIsLoggedIn(true);
          setPassword("");
          setAuthSuccess(null);
        }, 1000);
      } else {
        setAuthError(`❌ ${data.error || "Login failed!"}`);
      }
    } catch (err) {
      setAuthError("❌ Connection error to authentication API.");
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!username || !password) {
      setAuthError("❌ Username and password are required!");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess("🎉 Admin user created successfully! You can now log in.");
        setTimeout(() => {
          setAuthTab("login");
          setPassword("");
          setEmail("");
          setAuthSuccess(null);
        }, 1500);
      } else {
        setAuthError(`❌ ${data.error || "Registration failed!"}`);
      }
    } catch (err) {
      setAuthError("❌ Connection error to authentication API.");
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}/update-status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      } else {
        alert("❌ Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("❌ Connection error while updating order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteProduct = async (prodId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/products/${prodId}/delete/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== prodId));
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ Connection error while deleting product");
    }
  };

  // Check auth session
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch only if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCategories();
      fetchProducts();
      fetchOrders();
    }
  }, [isLoggedIn]);

  // Stats Calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="admin-dashboard-container">
      {/* Dynamic embedded styles for glassmorphism, responsive grid and modern layout */}
      <style>{`
        .admin-dashboard-container {
          min-height: 100vh;
          background: radial-gradient(circle at 10% 20%, #1e1e24 0%, #111115 90%);
          color: #f5f5fa;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 0;
          margin: 0;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 16px 40px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .admin-title {
          font-size: 22px;
          fontWeight: 800;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
        }
        .admin-title span.badge {
          background: var(--primary, #e8320a);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .home-link {
          background: rgba(255, 255, 255, 0.08);
          color: #eee;
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.25s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .home-link:hover {
          background: #fff;
          color: #111;
          transform: translateY(-1px);
        }
        .dashboard-body {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 40px 80px;
        }
        
        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .stat-card::before {
          content: "";
          position: absolute;
          top: 0; right: 0; width: 60px; height: 60px;
          background: linear-gradient(135deg, rgba(232, 50, 10, 0.25) 0%, transparent 60%);
          border-radius: 0 0 0 100%;
        }
        .stat-label {
          font-size: 13px;
          color: #8a8a98;
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }
        .stat-detail {
          font-size: 12px;
          color: #555566;
        }
        .stat-detail span {
          color: #4caf50;
          font-weight: bold;
        }

        /* Navigation Tabs */
        .tabs-container {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 30px;
          padding-bottom: 1px;
        }
        .tab-btn {
          color: #8a8a98;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 12px 12px 0 0;
          position: relative;
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          color: #fff;
        }
        .tab-btn.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.04);
        }
        .tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--primary, #e8320a);
        }

        /* Forms Styling */
        .form-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
        }
        .form-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #fff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        .status-select {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.15);
          outline: none;
          background: rgba(0,0,0,0.4);
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .status-select:focus {
          border-color: var(--primary, #e8320a);
        }
        .status-select.pending {
          color: #ffb74d;
          border-color: rgba(255, 152, 0, 0.4);
        }
        .status-select.processing {
          color: #64b5f6;
          border-color: rgba(33, 150, 243, 0.4);
        }
        .status-select.completed {
          color: #81c784;
          border-color: rgba(76, 175, 80, 0.4);
        }
        .status-select.cancelled {
          color: #e57373;
          border-color: rgba(244, 67, 54, 0.4);
        }

        @media(max-width: 900px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width: 768px) {
          .admin-header {
            padding: 12px 20px;
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
          .admin-title {
            font-size: 18px;
            justify-content: center;
          }
          .dashboard-body {
            padding: 20px 15px;
          }
          .tabs-container {
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 5px;
            -webkit-overflow-scrolling: touch;
          }
          .tab-btn {
            padding: 10px 16px;
            font-size: 13px;
            flex-shrink: 0;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #bbb;
        }
        .form-input, .form-textarea, .form-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: var(--primary, #e8320a);
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          color: #bbb;
          font-size: 14px;
        }
        .checkbox-container input {
          width: 18px;
          height: 18px;
          accent-color: var(--primary, #e8320a);
        }
        .form-button {
          background: var(--primary, #e8320a);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          padding: 14px 28px;
          border-radius: 8px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .form-button:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .form-button:disabled {
          background: #555;
          cursor: not-allowed;
        }
        .msg-box {
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .msg-box.success {
          background: rgba(76, 175, 80, 0.15);
          color: #81c784;
          border: 1px solid rgba(76, 175, 80, 0.25);
        }
        .msg-box.error {
          background: rgba(244, 67, 54, 0.15);
          color: #e57373;
          border: 1px solid rgba(244, 67, 54, 0.25);
        }

        /* Image upload layouts */
        .image-upload-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .image-preview {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .image-preview img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        .image-preview span {
          font-size: 11px;
          color: #666;
          text-align: center;
        }

        /* Grid Lists */
        .data-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .refresh-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #bbb;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .list-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .list-card-img {
          width: 60px;
          height: 60px;
          background: #000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .list-card-info {
          flex: 1;
          min-width: 0;
        }
        .list-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .list-card-subtitle {
          font-size: 12px;
          color: #7a7a88;
          margin-bottom: 4px;
        }
        .list-card-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(76, 175, 80, 0.15);
          color: #81c784;
        }

        /* Order Data Table Styling */
        .order-table-container {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow-x: auto;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }
        .order-table th {
          background: rgba(255, 255, 255, 0.03);
          color: #8a8a98;
          font-weight: 600;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .order-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #e0e0ea;
        }
        .order-table tr:hover td {
          background: rgba(255, 255, 255, 0.01);
        }
        .status-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: capitalize;
        }
        .status-badge.pending {
          background: rgba(255, 152, 0, 0.15);
          color: #ffb74d;
        }
        .status-badge.completed {
          background: rgba(76, 175, 80, 0.15);
          color: #81c784;
        }
        .status-badge.processing {
          background: rgba(33, 150, 243, 0.15);
          color: #64b5f6;
        }
        .status-badge.cancelled {
          background: rgba(244, 67, 54, 0.15);
          color: #e57373;
        }
        .order-items-summary {
          font-size: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          margin-top: 6px;
        }
        .order-item-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .order-item-row:last-child {
          border-bottom: none;
        }

        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top: 2.5px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Auth Screen Styles */
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(80vh - 100px);
          padding: 40px 20px;
        }
        .auth-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .auth-tab {
          flex: 1;
          background: none;
          border: none;
          color: #8a8a98;
          font-weight: 700;
          font-size: 15px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          border-bottom: 2px solid transparent;
        }
        .auth-tab.active {
          color: #fff;
          border-bottom: 2px solid var(--primary, #e8320a);
        }
        .auth-description {
          font-size: 13px;
          color: #8a8a98;
          text-align: center;
          margin-bottom: 24px;
        }
      `}</style>

      {/* ADMIN HEADER */}
      <header className="admin-header">
        <div className="admin-title">
          <span> Dheer Dashboard</span>
          <span className="badge">Control Center</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/" className="home-link">
            🏠 Visit Store
          </Link>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="home-link"
              style={{
                background: "rgba(244, 67, 54, 0.2)",
                color: "#ff8a80",
                border: "1px solid rgba(244, 67, 54, 0.3)",
                cursor: "pointer",
              }}
            >
              Logout 🚪
            </button>
          )}
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="dashboard-body">
        {!isLoggedIn ? (
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${authTab === "login" ? "active" : ""}`}
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${authTab === "register" ? "active" : ""}`}
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                >
                  Create Admin
                </button>
              </div>

              <p className="auth-description">
                {authTab === "login"
                  ? "Access the administrative control center with your credentials."
                  : "Register a new user profile with administrator permissions."}
              </p>

              {authError && <div className="msg-box error">{authError}</div>}
              {authSuccess && <div className="msg-box success">{authSuccess}</div>}

              {authTab === "login" ? (
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter admin username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secret password"
                      required
                    />
                  </div>
                  <button type="submit" disabled={authLoading} className="form-button" style={{ marginTop: "10px" }}>
                    {authLoading ? <div className="spinner"></div> : "Unlock Dashboard 🔒"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (Optional)</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose strong password"
                      required
                    />
                  </div>
                  <button type="submit" disabled={authLoading} className="form-button" style={{ marginTop: "10px" }}>
                    {authLoading ? <div className="spinner"></div> : "Create Account 🚀"}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* STATS OVERVIEW CARDS */}
            <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">৳{totalRevenue.toLocaleString()}</span>
            <span className="stat-detail">Lifetime earnings from completed & pending orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Orders Placed</span>
            <span className="stat-value">{orders.length}</span>
            <span className="stat-detail">
              <span>{pendingOrders}</span> pending action
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Products</span>
            <span className="stat-value">{products.length}</span>
            <span className="stat-detail">Listed in the e-commerce inventory</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{categories.length}</span>
            <span className="stat-detail">Active product classifications</span>
          </div>
        </section>

        {/* TABS NAVIGATION */}
        <section className="tabs-container">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            📦 Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          >
            🏷️ Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          >
            📁 Categories ({categories.length})
          </button>
        </section>

        {/* TAB CONTENTS */}

        {/* 1. DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <div className="dashboard-grid">
              <div className="form-panel">
                <h3 className="form-title">Store Status Summary</h3>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                  Welcome back! Your shop is connected and running active operations. Total database metrics are loaded dynamically via Django REST Framework API endpoints. Use the tabs above to manage orders, products, and categories.
                </p>
                <div style={{ background: "rgba(0, 0, 0, 0.2)", borderRadius: "8px", padding: "16px" }}>
                  <h4 style={{ color: "#fff", fontSize: "14px", marginBottom: "8px" }}>API Endpoints In-use:</h4>
                  <ul style={{ color: "#8a8a98", fontSize: "12px", listStyle: "inside", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li><strong>Categories list:</strong> {BASE_URL}/api/categories/list/</li>
                    <li><strong>Create category:</strong> {BASE_URL}/api/categories/create/</li>
                    <li><strong>Products list:</strong> {BASE_URL}/api/products/list/</li>
                    <li><strong>Create product:</strong> {BASE_URL}/api/products/create/</li>
                    <li><strong>Orders list:</strong> {BASE_URL}/api/orders/list/</li>
                  </ul>
                </div>
              </div>

              <div className="form-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 className="form-title">Recent Orders</h3>
                  {orders.length === 0 ? (
                    <p style={{ color: "#777", fontSize: "13px" }}>No orders placed yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {orders.slice(0, 4).map((order) => (
                        <div key={order.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <div>
                            <span style={{ fontWeight: "700", color: "#fff" }}>{order.full_name}</span>
                            <span style={{ fontSize: "11px", color: "#888", display: "block" }}>{order.phone}</span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ color: "var(--primary, #e8320a)", fontWeight: "700" }}>৳{Number(order.amount).toLocaleString()}</span>
                            <span className={`status-badge ${order.status}`} style={{ display: "block", fontSize: "9px", padding: "1px 6px", marginTop: "3px" }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setActiveTab("orders")} style={{ color: "var(--primary, #e8320a)", fontWeight: "600", fontSize: "13px", marginTop: "16px", cursor: "pointer", textDecoration: "underline" }}>
                  View All Orders →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS LIST TAB */}
        {activeTab === "orders" && (
          <div>
            <div className="data-list-header">
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>Customer Orders List</h3>
              <button onClick={fetchOrders} className="refresh-btn">
                🔄 Refresh Orders ({loadingOrders ? "Loading..." : "Synced"})
              </button>
            </div>

            {loadingOrders && orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
                <p style={{ color: "#aaa" }}>Fetching order records from Django API...</p>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(255, 255, 255, 0.01)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>📦</span>
                <h4 style={{ color: "#fff", marginBottom: "4px" }}>No Orders Found</h4>
                <p style={{ color: "#777", fontSize: "13px" }}>Orders submitted through Checkout/Buy Now forms will show up here.</p>
              </div>
            ) : (
              <div className="order-table-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer Details</th>
                      <th>Shipping Address</th>
                      <th>Items Purchased</th>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>
                          <div style={{ fontWeight: "700", color: "#fff" }}>{order.full_name}</div>
                          <div style={{ fontSize: "11px", color: "#8a8a98" }}>{order.phone}</div>
                        </td>
                        <td style={{ maxWidth: "200px" }}>
                          <span style={{ fontSize: "12px", color: "#bbb", whiteSpace: "normal" }}>{order.address}</span>
                        </td>
                        <td>
                          <div className="order-items-summary">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item) => (
                                <div key={item.id} className="order-item-row">
                                  <span>{item.product?.name || "Unnamed Product"} <strong style={{ color: "#fff" }}>x {item.quantity}</strong></span>
                                  <span style={{ color: "#8a8a98", marginLeft: "10px" }}>৳{Number(item.price).toLocaleString()}</span>
                                </div>
                              ))
                            ) : (
                              <span style={{ color: "#666", fontStyle: "italic" }}>No items found</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: "12px", fontWeight: "700", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px" }}>
                            {order.payment_type}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: "var(--primary, #e8320a)", fontSize: "14px" }}>
                            ৳{Number(order.amount).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`status-select ${order.status}`}
                            disabled={updatingOrderId === order.id}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ color: "#8a8a98", fontSize: "11px" }}>
                          {new Date(order.created_at).toLocaleString("en-GB", { hour12: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. PRODUCTS TAB (LIST & FORM) */}
        {activeTab === "products" && (
          <div>
            {/* Create Product Form */}
            <div className="form-panel">
              <h3 className="form-title">⚡ Add New Product</h3>

              {productFormMsg && (
                <div className={`msg-box ${productFormMsg.type}`}>
                  {productFormMsg.text}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="form-grid">
                {/* Product Name */}
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={prodName}
                    onChange={(e) => handleProdNameChange(e.target.value)}
                    placeholder="e.g. Redmi Buds 5 Pro"
                  />
                </div>

                {/* Slug */}
                <div className="form-group">
                  <label className="form-label">URL Slug *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={prodSlug}
                    onChange={(e) => setProdSlug(e.target.value)}
                    placeholder="redmi-buds-5-pro"
                  />
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label className="form-label">Product Description</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Describe product highlights, features, warranty..."
                  />
                </div>

                {/* Category Selection */}
                <div className="form-group">
                  <label className="form-label">Select Category *</label>
                  <select
                    required
                    className="form-select"
                    value={prodCategoryId}
                    onChange={(e) => setProdCategoryId(e.target.value)}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="form-group">
                  <label className="form-label">Available Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-input"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="e.g. 50"
                  />
                </div>

                {/* Sell Price */}
                <div className="form-group">
                  <label className="form-label">Sale Price (৳) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="form-input"
                    value={prodSellPrice}
                    onChange={(e) => setProdSellPrice(e.target.value)}
                    placeholder="Discounted price, e.g. 3500"
                  />
                </div>

                {/* Regular Price */}
                <div className="form-group">
                  <label className="form-label">Regular Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={prodRegPrice}
                    onChange={(e) => setProdRegPrice(e.target.value)}
                    placeholder="Before discount, e.g. 4000"
                  />
                </div>

                {/* Image file upload */}
                <div className="form-group">
                  <label className="form-label">Product Thumbnail Image *</label>
                  <div className="image-upload-wrapper">
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={handleProdImageChange}
                      style={{ fontSize: "12px" }}
                    />
                    <div className="image-preview">
                      {prodImagePreview ? (
                        <img src={prodImagePreview} alt="Preview" />
                      ) : (
                        <span>Preview</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active check */}
                <div className="form-group" style={{ justifyContent: "center" }}>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={prodActive}
                      onChange={(e) => setProdActive(e.target.checked)}
                    />
                    <span>Publish & Make Active (Display on homepage)</span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="form-group full-width" style={{ marginTop: "10px" }}>
                  <button
                    type="submit"
                    disabled={productSubmitLoading}
                    className="form-button"
                  >
                    {productSubmitLoading ? (
                      <>
                        <div className="spinner"></div> Creating Product...
                      </>
                    ) : (
                      "🚀 Publish Product to Catalog"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Products List */}
            <div>
              <div className="data-list-header">
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>Catalog Products ({products.length})</h3>
                <button onClick={fetchProducts} className="refresh-btn">
                  🔄 Refresh List
                </button>
              </div>

              {loadingProducts && products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
                  <p style={{ color: "#aaa" }}>Loading active catalog...</p>
                </div>
              ) : products.length === 0 ? (
                <p style={{ color: "#777", fontStyle: "italic" }}>No products created yet.</p>
              ) : (
                <div className="list-grid">
                  {products.map((prod) => (
                    <div key={prod.id} className="list-card" style={{ position: "relative" }}>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "rgba(244, 67, 54, 0.25)",
                          color: "#ff8a80",
                          border: "1px solid rgba(244, 67, 54, 0.35)",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          cursor: "pointer",
                          zIndex: 10,
                          transition: "all 0.2s"
                        }}
                        title="Delete Product"
                      >
                        🗑️ Delete
                      </button>
                      <div className="list-card-img">
                        {prod.image ? (
                          <img
                            src={prod.image.startsWith("http") ? prod.image : `${BASE_URL}${prod.image}`}
                            alt={prod.name}
                          />
                        ) : (
                          <span style={{ fontSize: "10px", color: "#666" }}>No Image</span>
                        )}
                      </div>
                      <div className="list-card-info">
                        <div className="list-card-title" title={prod.name}>
                          {prod.name}
                        </div>
                        <div className="list-card-subtitle">
                          Category: {typeof prod.category === "object" ? prod.category.name : `Cat ID ${prod.category}`}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                          <strong style={{ color: "var(--primary, #e8320a)", fontSize: "13px" }}>
                            ৳{Number(prod.sell_price).toLocaleString()}
                          </strong>
                          <span className="list-card-badge">Stock: {prod.stock}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. CATEGORIES TAB (LIST & FORM) */}
        {activeTab === "categories" && (
          <div>
            {/* Create Category Form */}
            <div className="form-panel">
              <h3 className="form-title">📁 Create Product Category</h3>

              {categoryFormMsg && (
                <div className={`msg-box ${categoryFormMsg.type}`}>
                  {categoryFormMsg.text}
                </div>
              )}

              <form onSubmit={handleCreateCategory} className="form-grid">
                {/* Category Name */}
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={catName}
                    onChange={(e) => handleCatNameChange(e.target.value)}
                    placeholder="e.g. Smart Watch"
                  />
                </div>

                {/* Slug */}
                <div className="form-group">
                  <label className="form-label">URL Slug *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="smart-watch"
                  />
                </div>

                {/* Category Image upload */}
                <div className="form-group">
                  <label className="form-label">Category Thumbnail / Icon Image</label>
                  <div className="image-upload-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCatImageChange}
                      style={{ fontSize: "12px" }}
                    />
                    <div className="image-preview">
                      {catImagePreview ? (
                        <img src={catImagePreview} alt="Preview" />
                      ) : (
                        <span>Preview</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Empty group for spacing */}
                <div className="form-group"></div>

                {/* Submit button */}
                <div className="form-group full-width" style={{ marginTop: "10px" }}>
                  <button
                    type="submit"
                    disabled={categorySubmitLoading}
                    className="form-button"
                  >
                    {categorySubmitLoading ? (
                      <>
                        <div className="spinner"></div> Creating Category...
                      </>
                    ) : (
                      "🚀 Create Category"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Categories List */}
            <div>
              <div className="data-list-header">
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>Product Categories ({categories.length})</h3>
                <button onClick={fetchCategories} className="refresh-btn">
                  🔄 Refresh List
                </button>
              </div>

              {loadingCategories && categories.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
                  <p style={{ color: "#aaa" }}>Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <p style={{ color: "#777", fontStyle: "italic" }}>No categories created yet.</p>
              ) : (
                <div className="list-grid">
                  {categories.map((cat) => (
                    <div key={cat.id} className="list-card">
                      <div className="list-card-img" style={{ background: "#15151b" }}>
                        {cat.image ? (
                          <img
                            src={cat.image.startsWith("http") ? cat.image : `${BASE_URL}${cat.image}`}
                            alt={cat.name}
                          />
                        ) : (
                          <span style={{ fontSize: "20px" }}>📁</span>
                        )}
                      </div>
                      <div className="list-card-info">
                        <div className="list-card-title">{cat.name}</div>
                        <div className="list-card-subtitle" style={{ fontFamily: "monospace" }}>
                          slug: {cat.slug}
                        </div>
                        <span className="list-card-badge" style={{ marginTop: "4px" }}>
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )}
      </main>
    </div>
  );
}
