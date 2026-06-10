"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
// const BASE_URL = "http://127.0.0.1:8000";
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

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string | null;
  cta: string;
  href: string;
  accent_color: string;
  is_active: boolean;
  created_at: string;
}



interface NotificationBanner {
  id: number;
  title: string;
  image: string;
  target_url: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}



export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "categories" | "banners" | "notification_banners" | "admins">("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("adminTheme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("adminTheme", next);
  };

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
  const [banners, setBanners] = useState<Banner[]>([]);

  // Loading states
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [tempStatus, setTempStatus] = useState<Record<number, string>>({});

  // Orders filters and pagination
  const [orderDateFilter, setOrderDateFilter] = useState<"all" | "today" | "yesterday" | "week" | "month">("all");
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(20);

  // Forms statuses
  const [productSubmitLoading, setProductSubmitLoading] = useState(false);
  const [categorySubmitLoading, setCategorySubmitLoading] = useState(false);
  const [bannerSubmitLoading, setBannerSubmitLoading] = useState(false);

  const [productFormMsg, setProductFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [categoryFormMsg, setCategoryFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bannerFormMsg, setBannerFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Banner Form fields
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerCta, setBannerCta] = useState("Shop Now");
  const [bannerHref, setBannerHref] = useState("/");
  const [bannerAccentColor, setBannerAccentColor] = useState("#ff4d4d");
  const [bannerActive, setBannerActive] = useState(true);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

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

  const fetchBanners = async () => {
    setLoadingBanners(true);
    try {
      const res = await fetch(`${BASE_URL}/api/banner/list/`);
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    } finally {
      setLoadingBanners(false);
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

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImageFile(file);
      setBannerImagePreview(URL.createObjectURL(file));
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
        // Store JWT tokens
        localStorage.setItem("adminAccessToken", data.access);
        localStorage.setItem("adminRefreshToken", data.refresh);
        localStorage.setItem("adminUser", JSON.stringify({ username: data.username, is_staff: data.is_staff }));
        setAuthSuccess("🎉 Login successful! Redirecting...");
        setTimeout(() => {
          setIsLoggedIn(true);
          setPassword("");
          setAuthSuccess(null);
        }, 800);
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
      const token = localStorage.getItem("adminAccessToken");
      const res = await fetch(`${BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, email })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess("🎉 Admin user created successfully!");
        setUsername("");
        setPassword("");
        setEmail("");
        setTimeout(() => {
          setAuthSuccess(null);
        }, 3000);
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
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // Helper to get auth headers
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("adminAccessToken") || ""}`
  });

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}/update-status/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
        setTempStatus((prev) => {
          const next = { ...prev };
          delete next[orderId];
          return next;
        });
      } else if (res.status === 401) {
        alert("⚠️ Session expired. Please log in again.");
        handleLogout();
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


  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/categories/${categoryId}/delete/`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setCategories((prev) =>
          prev.filter((cat) => cat.id !== categoryId)
        );
      } else {
        alert("❌ Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("❌ Connection error while deleting category");
    }
  };




  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerFormMsg(null);

    if (!bannerTitle || !bannerImageFile) {
      setBannerFormMsg({ type: "error", text: "Title and Image are required!" });
      return;
    }

    setBannerSubmitLoading(true);
    const formData = new FormData();
    formData.append("title", bannerTitle);
    formData.append("subtitle", bannerSubtitle);
    formData.append("cta", bannerCta);
    formData.append("href", bannerHref);
    formData.append("accent_color", bannerAccentColor);
    formData.append("is_active", bannerActive ? "true" : "false");
    formData.append("image", bannerImageFile);

    try {
      const res = await fetch(`${BASE_URL}/api/banner/create/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setBannerFormMsg({ type: "success", text: "🎉 Banner created successfully!" });
        // Reset form
        setBannerTitle("");
        setBannerSubtitle("");
        setBannerCta("Shop Now");
        setBannerHref("/");
        setBannerAccentColor("#ff4d4d");
        setBannerActive(true);
        setBannerImageFile(null);
        setBannerImagePreview(null);
        // Refresh banners
        fetchBanners();
      } else {
        const errorText = JSON.stringify(responseData);
        setBannerFormMsg({ type: "error", text: `❌ Failed to create banner: ${errorText}` });
      }
    } catch (err) {
      setBannerFormMsg({ type: "error", text: "❌ Connection error to backend API." });
      console.error(err);
    } finally {
      setBannerSubmitLoading(false);
    }
  };

  const handleDeleteBanner = async (bannerId: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/banner/${bannerId}/delete/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== bannerId));
      } else {
        alert("❌ Failed to delete banner");
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("❌ Connection error while deleting banner");
    }
  };

  // Check auth session on mount — validate JWT token exists
  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    const adminUser = localStorage.getItem("adminUser");
    if (token && adminUser) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch only if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCategories();
      fetchProducts();
      fetchOrders();
      fetchBanners();
      fetchNotificationBanners();
    }
  }, [isLoggedIn]);

  // Stats Calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  // Filtered Orders for Date Filter
  const filteredOrders = orders.filter((order) => {
    if (orderDateFilter === "all") return true;
    if (!order.created_at) return false;
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (orderDateFilter === "today") {
      return orderDate >= startOfToday;
    } else if (orderDateFilter === "yesterday") {
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      return orderDate >= startOfYesterday && orderDate < startOfToday;
    } else if (orderDateFilter === "week") {
      const sevenDaysAgo = new Date(startOfToday);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return orderDate >= sevenDaysAgo;
    } else if (orderDateFilter === "month") {
      const thirtyDaysAgo = new Date(startOfToday);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }
    return true;
  });




  // ----------------------------------
  const [notificationBanners, setNotificationBanners] = useState<NotificationBanner[]>([]);
  const [loadingNotificationBanners, setLoadingNotificationBanners] = useState(false);

  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyTargetUrl, setNotifyTargetUrl] = useState("/");
  const [notifyActive, setNotifyActive] = useState(true);

  const [notifyImageFile, setNotifyImageFile] = useState<File | null>(null);
  const [notifyImagePreview, setNotifyImagePreview] = useState<string | null>(null);

  const [notifySubmitLoading, setNotifySubmitLoading] = useState(false);

  const [notifyFormMsg, setNotifyFormMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);





  const handleNotifyImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setNotifyImageFile(file);
    setNotifyImagePreview(URL.createObjectURL(file));
  };




  const fetchNotificationBanners = async () => {
    setLoadingNotificationBanners(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/banner/notification-banner/list/`
      );

      const data = await res.json();

      if (res.ok) {
        setNotificationBanners(data.data || []);
        
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotificationBanners(false);
    }
  };




  const handleCreateNotificationBanner = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setNotifyFormMsg(null);

    if (!notifyTitle || !notifyImageFile) {
      setNotifyFormMsg({
        type: "error",
        text: "Title and Image required",
      });
      return;
    }

    setNotifySubmitLoading(true);

    const formData = new FormData();

    formData.append("title", notifyTitle);
    formData.append("target_url", notifyTargetUrl);
    formData.append(
      "is_active",
      notifyActive ? "true" : "false"
    );

    formData.append("image", notifyImageFile);

    try {
      const res = await fetch(
        `${BASE_URL}/api/banner/notification-banner/create/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setNotifyFormMsg({
          type: "success",
          text: "Notification Banner Created",
        });

        setNotifyTitle("");
        setNotifyTargetUrl("/");
        setNotifyActive(true);

        setNotifyImageFile(null);
        setNotifyImagePreview(null);

        fetchNotificationBanners();
      } else {
        setNotifyFormMsg({
          type: "error",
          text: JSON.stringify(data),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNotifySubmitLoading(false);
    }
  };




  const handleNotificationBannerStatus = async (
    bannerId: number,
    currentStatus: boolean
  ) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/banner/notification-banner/${bannerId}/status/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !currentStatus,
          }),
        }
      );

      if (res.ok) {
        setNotificationBanners((prev) =>
          prev.map((banner) =>
            banner.id === bannerId
              ? {
                ...banner,
                is_active: !currentStatus,
              }
              : banner
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };




  const handleDeleteNotificationBanner = async (
    bannerId: number
  ) => {
    if (!confirm("Delete this notification banner?"))
      return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/banner/notification-banner/${bannerId}/delete/`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setNotificationBanners((prev) =>
          prev.filter((b) => b.id !== bannerId)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };




  const ordersToShow = filteredOrders.slice(0, visibleOrdersCount);

  return (
    <div className={`admin-dashboard-container theme-${theme}`}>
      {/* Dynamic embedded styles for glassmorphism, responsive grid and modern layout */}
      <style>{`
        /* ========== THEME VARIABLES ========== */
        .theme-dark {
          --bg-main: radial-gradient(circle at 10% 20%, #1e1e24 0%, #111115 90%);
          --bg-header: rgba(255, 255, 255, 0.04);
          --bg-header-border: rgba(255, 255, 255, 0.08);
          --text-main: #f0f0fa;
          --text-muted: #a0a0b0;
          --text-strong: #ffffff;
          --bg-card: rgba(255, 255, 255, 0.05);
          --bg-card-hover: rgba(255, 255, 255, 0.08);
          --border-card: rgba(255, 255, 255, 0.08);
          --border-hover: rgba(255, 255, 255, 0.18);
          --bg-form-panel: rgba(255, 255, 255, 0.04);
          --bg-input: rgba(0, 0, 0, 0.35);
          --border-input: rgba(255, 255, 255, 0.12);
          --text-input: #ffffff;
          --bg-table-th: rgba(255, 255, 255, 0.05);
          --border-table: rgba(255, 255, 255, 0.08);
          --bg-td-hover: rgba(255, 255, 255, 0.02);
          --text-td: #e8e8f0;
          --bg-status-select: rgba(0,0,0,0.5);
          --text-status-select: #ffffff;
          --border-status-select: rgba(255,255,255,0.2);
          --bg-home-link: rgba(255, 255, 255, 0.1);
          --text-home-link: #f0f0fa;
          --bg-home-link-hover: #fff;
          --text-home-link-hover: #111;
          --bg-refresh-btn: rgba(255, 255, 255, 0.07);
          --border-refresh-btn: rgba(255, 255, 255, 0.08);
          --bg-order-items: rgba(0, 0, 0, 0.25);
          --border-order-item-row: rgba(255, 255, 255, 0.05);
          --bg-auth-card: rgba(255, 255, 255, 0.05);
          --border-auth-card: rgba(255, 255, 255, 0.1);
          --shadow-auth-card: 0 20px 40px rgba(0, 0, 0, 0.5);
          --bg-auth-tab-border: rgba(255, 255, 255, 0.1);
          --text-auth-tab: #a0a0b0;
          --bg-spinner-border: rgba(255, 255, 255, 0.3);
          --bg-order-table-container: rgba(255, 255, 255, 0.02);
          --bg-list-card: rgba(255, 255, 255, 0.04);
          --border-list-card: rgba(255, 255, 255, 0.07);
          --bg-toggle-btn: rgba(255, 255, 255, 0.1);
          --border-toggle-btn: rgba(255, 255, 255, 0.15);
          --text-toggle-btn: #f0f0fa;
          --bg-toggle-hover: rgba(255, 255, 255, 0.18);
          --stat-detail-color: #7a7a8a;
          --tab-border: rgba(255, 255, 255, 0.1);
          --form-title-border: rgba(255, 255, 255, 0.08);
          --bg-sub-card: rgba(255, 255, 255, 0.03);
          --border-sub-card: rgba(255, 255, 255, 0.08);
          --status-pending-bg: rgba(255, 152, 0, 0.08);
          --status-pending-text: #ffa726;
          --status-processing-bg: rgba(33, 150, 243, 0.08);
          --status-processing-text: #29b6f6;
          --status-completed-bg: rgba(76, 175, 80, 0.08);
          --status-completed-text: #66bb6a;
          --status-cancelled-bg: rgba(244, 67, 54, 0.08);
          --status-cancelled-text: #ef5350;
          --badge-success-bg: rgba(76, 175, 80, 0.15);
          --badge-success-text: #81c784;
        }
        .theme-light {
          --bg-main: linear-gradient(135deg, #eef0f4 0%, #e2e6ed 100%);
          --bg-header: rgba(255, 255, 255, 0.95);
          --bg-header-border: rgba(0, 0, 0, 0.12);
          --text-main: #0f1117;
          --text-muted: #4b5563;
          --text-strong: #0f1117;
          --bg-card: rgba(255, 255, 255, 0.95);
          --bg-card-hover: #ffffff;
          --border-card: rgba(0, 0, 0, 0.1);
          --border-hover: rgba(0, 0, 0, 0.2);
          --bg-form-panel: rgba(255, 255, 255, 0.92);
          --bg-input: #ffffff;
          --border-input: rgba(0, 0, 0, 0.18);
          --text-input: #0f1117;
          --bg-table-th: rgba(0, 0, 0, 0.05);
          --border-table: rgba(0, 0, 0, 0.09);
          --bg-td-hover: rgba(0, 0, 0, 0.02);
          --text-td: #1f2937;
          --bg-status-select: #ffffff;
          --text-status-select: #0f1117;
          --border-status-select: rgba(0,0,0,0.2);
          --bg-home-link: rgba(0, 0, 0, 0.07);
          --text-home-link: #1f2937;
          --bg-home-link-hover: #111827;
          --text-home-link-hover: #fff;
          --bg-refresh-btn: rgba(0, 0, 0, 0.06);
          --border-refresh-btn: rgba(0, 0, 0, 0.1);
          --bg-order-items: rgba(0, 0, 0, 0.05);
          --border-order-item-row: rgba(0, 0, 0, 0.07);
          --bg-auth-card: #ffffff;
          --border-auth-card: rgba(0, 0, 0, 0.12);
          --shadow-auth-card: 0 20px 40px rgba(0, 0, 0, 0.15);
          --bg-auth-tab-border: rgba(0, 0, 0, 0.1);
          --text-auth-tab: #4b5563;
          --bg-spinner-border: rgba(0, 0, 0, 0.2);
          --bg-order-table-container: rgba(255, 255, 255, 0.95);
          --bg-list-card: #ffffff;
          --border-list-card: rgba(0, 0, 0, 0.09);
          --bg-toggle-btn: rgba(0, 0, 0, 0.08);
          --border-toggle-btn: rgba(0, 0, 0, 0.13);
          --text-toggle-btn: #1f2937;
          --bg-toggle-hover: rgba(0, 0, 0, 0.14);
          --stat-detail-color: #6b7280;
          --tab-border: rgba(0, 0, 0, 0.1);
          --form-title-border: rgba(0, 0, 0, 0.1);
          --bg-sub-card: rgba(0, 0, 0, 0.02);
          --border-sub-card: rgba(0, 0, 0, 0.06);
          --status-pending-bg: rgba(217, 119, 6, 0.08);
          --status-pending-text: #b45309;
          --status-processing-bg: rgba(2, 132, 199, 0.08);
          --status-processing-text: #0369a1;
          --status-completed-bg: rgba(22, 163, 74, 0.08);
          --status-completed-text: #15803d;
          --status-cancelled-bg: rgba(220, 38, 38, 0.08);
          --status-cancelled-text: #b91c1c;
          --badge-success-bg: rgba(46, 125, 50, 0.1);
          --badge-success-text: #2e7d32;
        }

        .admin-dashboard-container {
          min-height: 100vh;
          background: var(--bg-main);
          color: var(--text-main);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 0;
          margin: 0;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-header);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--bg-header-border);
          padding: 16px 40px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .admin-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-strong);
        }
        .admin-title a.logo {
          text-decoration: none;
          display: flex;
          align-items: center;
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
          background: var(--bg-home-link);
          color: var(--text-home-link);
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.25s ease;
          border: 1px solid var(--border-card);
        }
        .home-link:hover {
          background: var(--bg-home-link-hover);
          color: var(--text-home-link-hover);
          transform: translateY(-1px);
        }
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-toggle-btn);
          color: var(--text-toggle-btn);
          border: 1px solid var(--border-toggle-btn);
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .theme-toggle-btn:hover {
          background: var(--bg-toggle-hover);
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
          background: var(--bg-card);
          border: 1px solid var(--border-card);
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
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          border-color: var(--border-hover);
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
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-strong);
          margin-bottom: 4px;
        }
        .stat-detail {
          font-size: 12px;
          color: var(--stat-detail-color);
        }
        .stat-detail span {
          color: #4caf50;
          font-weight: bold;
        }

        /* Navigation Tabs */
        .tabs-container {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--tab-border);
          margin-bottom: 30px;
          padding-bottom: 1px;
        }
        .tab-btn {
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 12px 12px 0 0;
          position: relative;
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          color: var(--text-strong);
        }
        .tab-btn.active {
          color: var(--text-strong);
          background: var(--bg-card-hover);
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
          background: var(--bg-form-panel);
          border: 1px solid var(--border-card);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
        }
        .form-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-strong);
          border-bottom: 1px solid var(--form-title-border);
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
          border: 1px solid var(--border-status-select);
          outline: none;
          background: var(--bg-status-select);
          color: var(--text-status-select);
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
          color: var(--text-muted);
        }
        .form-input, .form-textarea, .form-select {
          background: var(--bg-input);
          border: 1px solid var(--border-input);
          border-radius: 8px;
          padding: 12px 16px;
          color: var(--text-input);
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
          color: var(--text-muted);
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
          background: var(--bg-refresh-btn);
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
          border: 1px solid var(--border-refresh-btn);
        }
        .refresh-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-strong);
        }
        .list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .list-card {
          background: var(--bg-list-card);
          border: 1px solid var(--border-list-card);
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
          color: var(--text-strong);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .list-card-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .list-card-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--badge-success-bg);
          color: var(--badge-success-text);
        }

        /* Order Data Table Styling */
        .order-table-container {
          background: var(--bg-order-table-container);
          border: 1px solid var(--border-card);
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
          background: var(--bg-table-th);
          color: var(--text-muted);
          font-weight: 600;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-table);
        }
        .order-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-table);
          color: var(--text-td);
        }
        .order-table tr:hover td {
          background: var(--bg-td-hover);
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
          background: var(--bg-order-items);
          border-radius: 8px;
          padding: 8px 12px;
          margin-top: 6px;
        }
        .order-item-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          border-bottom: 1px solid var(--border-order-item-row);
        }
        .order-item-row:last-child {
          border-bottom: none;
        }

        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid var(--bg-spinner-border);
          border-top: 2.5px solid var(--text-strong);
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
          background: var(--bg-auth-card);
          border: 1px solid var(--border-auth-card);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: var(--shadow-auth-card);
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
          border-bottom: 1px solid var(--bg-auth-tab-border);
        }
        .auth-tab {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-auth-tab);
          font-weight: 700;
          font-size: 15px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          border-bottom: 2px solid transparent;
        }
        .auth-tab.active {
          color: var(--text-strong);
          border-bottom: 2px solid var(--primary, #e8320a);
        }
        .auth-description {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 24px;
        }






        /* =========================
   Notification Banner Section
========================= */

.notification-preview {
  margin-top: 12px;
}

.notification-preview img {
  width: 220px;
  height: auto;
  border-radius: 10px;
  border: 1px solid var(--border-card);
}

.notification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.notification-card {
  background: var(--bg-list-card);
  border: 1px solid var(--border-list-card);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s ease;
}

.notification-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.notify-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.notification-info {
  padding: 16px;
}

.notification-info h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-strong);
  margin: 0 0 8px;
}

.notification-info p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 12px;
  word-break: break-word;
}

.notify-status-active {
  display: inline-block;
  background: var(--badge-success-bg);
  color: var(--badge-success-text);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.notify-status-inactive {
  display: inline-block;
  background: rgba(244, 67, 54, 0.15);
  color: #ef5350;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.notification-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.notify-action-btn {
  flex: 1;
  background: var(--bg-toggle-btn);
  color: var(--text-toggle-btn);
  border: 1px solid var(--border-toggle-btn);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notify-action-btn:hover {
  background: var(--bg-toggle-hover);
  transform: translateY(-1px);
}

.notify-action-btn.danger {
  background: rgba(244, 67, 54, 0.15);
  color: #ef5350;
  border: 1px solid rgba(244, 67, 54, 0.25);
}

.notify-action-btn.danger:hover {
  background: rgba(244, 67, 54, 0.22);
}

/* Notification Form Styling */

.banner-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.banner-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.banner-form label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.banner-form input[type="text"],
.banner-form input[type="file"] {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--text-input);
  font-size: 14px;
  outline: none;
}

.banner-form input[type="text"]:focus {
  border-color: var(--primary, #e8320a);
}

.banner-form button {
  background: var(--primary, #e8320a);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.banner-form button:hover {
  filter: brightness(1.08);
}

.banner-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  background: rgba(76, 175, 80, 0.15);
  color: #81c784;
  border: 1px solid rgba(76, 175, 80, 0.25);
  padding: 12px;
  border-radius: 8px;
}

.error-message {
  background: rgba(244, 67, 54, 0.15);
  color: #e57373;
  border: 1px solid rgba(244, 67, 54, 0.25);
  padding: 12px;
  border-radius: 8px;
}

/* Section Header */

.content-card {
  background: var(--bg-form-panel);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 30px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-strong);
  margin: 0;
}

/* Mobile */

@media (max-width: 768px) {
  .banner-form {
    grid-template-columns: 1fr;
  }

  .notification-grid {
    grid-template-columns: 1fr;
  }

  .notification-actions {
    flex-direction: column;
  }

  .notification-preview img {
    width: 100%;
  }
}


      `}</style>

      {/* ADMIN HEADER */}
      <header className="admin-header">
        <div className="admin-title">
          <Link href="/adminmanagement" className="logo" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <span className="logo-text">
              <span className="logo-buy">BUY</span><span className="logo-fest">FEST</span>
            </span>
          </Link>
          <span style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "4px" }}>Dashboard</span>
          <span className="badge">Control Center</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/" className="home-link">
            🏠 Visit Store
          </Link>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
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
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-strong)", textAlign: "center", marginBottom: "8px" }}>
                Admin Portal Sign In
              </h2>
              <p className="auth-description" style={{ textAlign: "center", marginBottom: "24px" }}>
                Access the administrative control center with your credentials.
              </p>

              {authError && <div className="msg-box error">{authError}</div>}
              {authSuccess && <div className="msg-box success">{authSuccess}</div>}

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
              <div className="stat-card">
                <span className="stat-label">Banners</span>
                <span className="stat-value">{banners.length}</span>
                <span className="stat-detail">Active promotional sliders</span>
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
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab("banners")}
                className={`tab-btn ${activeTab === "banners" ? "active" : ""}`}
              >
                Banners ({banners.length})
              </button>


              <button
                onClick={() =>
                  setActiveTab("notification_banners")
                }
                className={`tab-btn ${activeTab === "notification_banners"
                  ? "active"
                  : ""
                  }`}
              >
                 Notification Banner ({notificationBanners.length})
              </button>


              <button
                onClick={() => {
                  setActiveTab("admins");
                  setAuthError(null);
                  setAuthSuccess(null);
                  setUsername("");
                  setPassword("");
                  setEmail("");
                }}
                className={`tab-btn ${activeTab === "admins" ? "active" : ""}`}
              >
                 Manage Admins
              </button>
            </section>

            {/* TAB CONTENTS */}

            {/* 1. DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div>
                <div className="dashboard-grid">
                  <div className="form-panel">
                    <h3 className="form-title">📊 Store Status Summary</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                      Welcome back! Your shop is connected and running active operations. Here is a live breakdown of your database metrics across products, categories, orders, and banners.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {/* 1. Orders Status Breakdown */}
                      <div style={{ background: "var(--bg-sub-card)", border: "1px solid var(--border-sub-card)", borderRadius: "8px", padding: "16px" }}>
                        <h4 style={{ color: "var(--text-strong)", fontSize: "14px", marginBottom: "12px" }}>
                          📦 Order Status Breakdown ({orders.length} Total)
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "12px" }}>
                          <div style={{ background: "var(--status-pending-bg)", borderLeft: "3px solid #ff9800", padding: "8px 12px", borderRadius: "4px" }}>
                            <div style={{ fontSize: "11px", color: "var(--status-pending-text)", textTransform: "uppercase", fontWeight: "600" }}>Pending</div>
                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-strong)", marginTop: "2px" }}>
                              {orders.filter(o => o.status === "pending").length}
                            </div>
                          </div>
                          <div style={{ background: "var(--status-processing-bg)", borderLeft: "3px solid #2196f3", padding: "8px 12px", borderRadius: "4px" }}>
                            <div style={{ fontSize: "11px", color: "var(--status-processing-text)", textTransform: "uppercase", fontWeight: "600" }}>Processing</div>
                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-strong)", marginTop: "2px" }}>
                              {orders.filter(o => o.status === "processing").length}
                            </div>
                          </div>
                          <div style={{ background: "var(--status-completed-bg)", borderLeft: "3px solid #4caf50", padding: "8px 12px", borderRadius: "4px" }}>
                            <div style={{ fontSize: "11px", color: "var(--status-completed-text)", textTransform: "uppercase", fontWeight: "600" }}>Completed</div>
                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-strong)", marginTop: "2px" }}>
                              {orders.filter(o => o.status === "completed").length}
                            </div>
                          </div>
                          <div style={{ background: "var(--status-cancelled-bg)", borderLeft: "3px solid #f44336", padding: "8px 12px", borderRadius: "4px" }}>
                            <div style={{ fontSize: "11px", color: "var(--status-cancelled-text)", textTransform: "uppercase", fontWeight: "600" }}>Cancelled</div>
                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-strong)", marginTop: "2px" }}>
                              {orders.filter(o => o.status === "cancelled").length}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Products Inventory Health */}
                      <div style={{ background: "var(--bg-sub-card)", border: "1px solid var(--border-sub-card)", borderRadius: "8px", padding: "16px" }}>
                        <h4 style={{ color: "var(--text-strong)", fontSize: "14px", marginBottom: "12px" }}>
                          🏷️ Products & Inventory ({products.length} Total)
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Active (Listed) Products:</span>
                            <span style={{ color: "var(--text-strong)", fontWeight: "600" }}>
                              {products.filter(p => p.is_active).length} / {products.length}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Out of Stock:</span>
                            <span style={{ color: products.filter(p => p.stock === 0).length > 0 ? "#ff8a80" : "#66bb6a", fontWeight: "600" }}>
                              {products.filter(p => p.stock === 0).length} products
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Low Stock Alert (&lt; 5 units):</span>
                            <span style={{ color: products.filter(p => p.stock > 0 && p.stock < 5).length > 0 ? "#ffa726" : "#66bb6a", fontWeight: "600" }}>
                              {products.filter(p => p.stock > 0 && p.stock < 5).length} products
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Categories & Banners */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ background: "var(--bg-sub-card)", border: "1px solid var(--border-sub-card)", borderRadius: "8px", padding: "16px" }}>
                          <h4 style={{ color: "var(--text-strong)", fontSize: "14px", marginBottom: "8px" }}>📁 Categories</h4>
                          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-strong)" }}>
                            {categories.length}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                            {categories.filter(c => c.is_active).length} active categories
                          </div>
                        </div>

                        <div style={{ background: "var(--bg-sub-card)", border: "1px solid var(--border-sub-card)", borderRadius: "8px", padding: "16px" }}>
                          <h4 style={{ color: "var(--text-strong)", fontSize: "14px", marginBottom: "8px" }}>🖼️ Slider Banners</h4>
                          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-strong)" }}>
                            {banners.length}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                            {banners.filter(b => b.is_active).length} active sliders
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 className="form-title">Recent Orders</h3>
                      {orders.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No orders placed yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {orders.slice(0, 4).map((order) => (
                            <div key={order.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-order-item-row)" }}>
                              <div>
                                <span style={{ fontWeight: "700", color: "var(--text-strong)" }}>{order.full_name}</span>
                                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>{order.phone}</span>
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
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-strong)" }}>Customer Orders List</h3>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>Date Range:</span>
                      <select
                        value={orderDateFilter}
                        onChange={(e) => {
                          setOrderDateFilter(e.target.value as any);
                          setVisibleOrdersCount(20);
                        }}
                        style={{
                          background: "var(--bg-status-select, rgba(0,0,0,0.5))",
                          color: "var(--text-status-select, #fff)",
                          border: "1px solid var(--border-status-select, rgba(255,255,255,0.2))",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                      </select>
                    </div>
                    <button onClick={fetchOrders} className="refresh-btn">
                      🔄 Refresh Orders ({loadingOrders ? "Loading..." : "Synced"})
                    </button>
                  </div>
                </div>

                {loadingOrders && orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
                    <p style={{ color: "var(--text-muted)" }}>Fetching order records from Django API...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", background: "var(--bg-order-table-container)", borderRadius: "12px", border: "1px dashed var(--border-table)" }}>
                    <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>📦</span>
                    <h4 style={{ color: "var(--text-strong)", marginBottom: "4px" }}>No Orders Found</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Orders submitted through Checkout/Buy Now forms will show up here.</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", background: "var(--bg-order-table-container)", borderRadius: "12px", border: "1px dashed var(--border-table)" }}>
                    <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>🔍</span>
                    <h4 style={{ color: "var(--text-strong)", marginBottom: "4px" }}>No Orders Found for this Filter</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No order was created during the selected date range. Try choosing a different filter.</p>
                  </div>
                ) : (
                  <div>
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
                          {ordersToShow.map((order) => (
                            <tr key={order.id}>
                              <td><strong>#{order.id}</strong></td>
                              <td>
                                <div style={{ fontWeight: "700", color: "var(--text-strong)" }}>{order.full_name}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{order.phone}</div>
                              </td>
                              <td style={{ maxWidth: "200px" }}>
                                <span style={{ fontSize: "12px", color: "var(--text-main)", whiteSpace: "normal" }}>{order.address}</span>
                              </td>
                              <td>
                                <div className="order-items-summary">
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => (
                                      <div key={item.id} className="order-item-row">
                                        <span>{item.product?.name || "Unnamed Product"} <strong style={{ color: "var(--text-strong)" }}>x {item.quantity}</strong></span>
                                        <span style={{ color: "var(--text-muted)", marginLeft: "10px" }}>৳{Number(item.price).toLocaleString()}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No items found</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span style={{ fontSize: "12px", fontWeight: "700", background: "var(--bg-toggle-btn)", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--border-toggle-btn)" }}>
                                  {order.payment_type}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: "var(--primary, #e8320a)", fontSize: "14px" }}>
                                  ৳{Number(order.amount).toLocaleString()}
                                </strong>
                              </td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <select
                                    value={tempStatus[order.id] !== undefined ? tempStatus[order.id] : order.status}
                                    onChange={(e) => setTempStatus(prev => ({ ...prev, [order.id]: e.target.value }))}
                                    className={`status-select ${tempStatus[order.id] !== undefined ? tempStatus[order.id] : order.status}`}
                                    disabled={updatingOrderId === order.id}
                                    style={{ flex: 1, minWidth: "100px" }}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  {(tempStatus[order.id] !== undefined && tempStatus[order.id] !== order.status) && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, tempStatus[order.id]!)}
                                      disabled={updatingOrderId === order.id}
                                      style={{
                                        background: "var(--primary, #e8320a)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "6px 8px",
                                        fontSize: "11px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap"
                                      }}
                                    >
                                      {updatingOrderId === order.id ? "..." : "Save"}
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                                {new Date(order.created_at).toLocaleString("en-GB", { hour12: true })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredOrders.length > visibleOrdersCount && (
                      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <button
                          onClick={() => setVisibleOrdersCount(prev => prev + 20)}
                          style={{
                            background: "var(--bg-toggle-btn, rgba(255,255,255,0.1))",
                            color: "var(--text-toggle-btn, #fff)",
                            border: "1px solid var(--border-toggle-btn, rgba(255,255,255,0.15))",
                            borderRadius: "8px",
                            padding: "10px 24px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--bg-toggle-hover, rgba(255,255,255,0.18))";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "var(--bg-toggle-btn, rgba(255,255,255,0.1))";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          See More Orders (Showing {visibleOrdersCount} of {filteredOrders.length}) 👇
                        </button>
                      </div>
                    )}
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
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-strong)" }}>Catalog Products ({products.length})</h3>
                    <button onClick={fetchProducts} className="refresh-btn">
                      🔄 Refresh List
                    </button>
                  </div>

                  {loadingProducts && products.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
                      <p style={{ color: "var(--text-muted)" }}>Loading active catalog...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No products created yet.</p>
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
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-strong)" }}>Product Categories ({categories.length})</h3>
                    <button onClick={fetchCategories} className="refresh-btn">
                      🔄 Refresh List
                    </button>
                  </div>

                  {loadingCategories && categories.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
                      <p style={{ color: "var(--text-muted)" }}>Loading categories...</p>
                    </div>
                  ) : categories.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No categories created yet.</p>
                  ) : (
                    <div className="list-grid">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="list-card"
                          style={{ position: "relative" }}
                        >
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              fontSize: "11px",
                              cursor: "pointer",
                              zIndex: 10,
                            }}
                          >
                            🗑 Delete
                          </button>

                          <div
                            className="list-card-img"
                            style={{ background: "#15151b" }}
                          >
                            {cat.image ? (
                              <img
                                src={
                                  cat.image.startsWith("http")
                                    ? cat.image
                                    : `${BASE_URL}${cat.image}`
                                }
                                alt={cat.name}
                              />
                            ) : (
                              <span style={{ fontSize: "20px" }}>📁</span>
                            )}
                          </div>

                          <div className="list-card-info">
                            <div className="list-card-title">{cat.name}</div>

                            <div
                              className="list-card-subtitle"
                              style={{ fontFamily: "monospace" }}
                            >
                              slug: {cat.slug}
                            </div>

                            <span
                              className="list-card-badge"
                              style={{ marginTop: "4px" }}
                            >
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

            {/* 5. BANNERS TAB (LIST & FORM) */}
            {activeTab === "banners" && (
              <div>
                {/* Create Banner Form */}
                <div className="form-panel">
                  <h3 className="form-title">🖼️ Add New Hero Banner</h3>

                  {bannerFormMsg && (
                    <div className={`msg-box ${bannerFormMsg.type}`}>
                      {bannerFormMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleCreateBanner} className="form-grid">
                    {/* Banner Title */}
                    <div className="form-group">
                      <label className="form-label">Banner Title *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={bannerTitle}
                        onChange={(e) => setBannerTitle(e.target.value)}
                        placeholder="e.g. New Season Gadgets"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="form-group">
                      <label className="form-label">Subtitle</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bannerSubtitle}
                        onChange={(e) => setBannerSubtitle(e.target.value)}
                        placeholder="e.g. Best deals on tech products"
                      />
                    </div>

                    {/* CTA text */}
                    <div className="form-group">
                      <label className="form-label">CTA Text (Button Label) *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={bannerCta}
                        onChange={(e) => setBannerCta(e.target.value)}
                        placeholder="e.g. Shop Now"
                      />
                    </div>

                    {/* Target Link (href) */}
                    <div className="form-group">
                      <label className="form-label">Target Link (Href) *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={bannerHref}
                        onChange={(e) => setBannerHref(e.target.value)}
                        placeholder="e.g. /category/smartwatch or /product/x"
                      />
                    </div>

                    {/* Accent Color picker/input */}
                    <div className="form-group">
                      <label className="form-label">Accent Color (Hex Code) *</label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="color"
                          value={bannerAccentColor}
                          onChange={(e) => setBannerAccentColor(e.target.value)}
                          style={{
                            width: "45px",
                            height: "45px",
                            border: "none",
                            borderRadius: "8px",
                            background: "none",
                            cursor: "pointer",
                          }}
                        />
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={bannerAccentColor}
                          onChange={(e) => setBannerAccentColor(e.target.value)}
                          placeholder="#ff4d4d"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    {/* Image file upload */}
                    <div className="form-group">
                      <label className="form-label">Banner Image *</label>
                      <div className="image-upload-wrapper">
                        <input
                          type="file"
                          required
                          accept="image/*"
                          onChange={handleBannerImageChange}
                          style={{ fontSize: "12px" }}
                        />
                        <div className="image-preview" style={{ width: "120px", height: "80px" }}>
                          {bannerImagePreview ? (
                            <img src={bannerImagePreview} alt="Preview" />
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
                          checked={bannerActive}
                          onChange={(e) => setBannerActive(e.target.checked)}
                        />
                        <span>Make Active (Display on homepage hero slider)</span>
                      </label>
                    </div>

                    {/* Submit button */}
                    <div className="form-group full-width" style={{ marginTop: "10px" }}>
                      <button
                        type="submit"
                        disabled={bannerSubmitLoading}
                        className="form-button"
                      >
                        {bannerSubmitLoading ? (
                          <>
                            <div className="spinner"></div> Creating Banner...
                          </>
                        ) : (
                          "🚀 Create Hero Banner"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Banners List */}
                <div>
                  <div className="data-list-header">
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-strong)" }}>Active Hero Banners ({banners.length})</h3>
                    <button onClick={fetchBanners} className="refresh-btn">
                      🔄 Refresh List
                    </button>
                  </div>

                  {loadingBanners && banners.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
                      <p style={{ color: "var(--text-muted)" }}>Loading active banners...</p>
                    </div>
                  ) : banners.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No banners created yet.</p>
                  ) : (
                    <div className="list-grid">
                      {banners.map((slide) => (
                        <div key={slide.id} className="list-card" style={{ position: "relative", flexDirection: "column", alignItems: "stretch", gap: "12px", padding: "16px" }}>
                          <button
                            onClick={() => handleDeleteBanner(slide.id)}
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
                            title="Delete Banner"
                          >
                            🗑️ Delete
                          </button>

                          <div style={{ width: "100%", height: "120px", background: "#111", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                            {slide.image ? (
                              <img
                                src={slide.image.startsWith("http") ? slide.image : `${BASE_URL}${slide.image}`}
                                alt={slide.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#444" }}>No Image</div>
                            )}

                            {/* Accent color bar */}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", backgroundColor: slide.accent_color }} />
                          </div>

                          <div className="list-card-info" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div className="list-card-title" style={{ fontSize: "15px", whiteSpace: "normal" }}>
                              {slide.title}
                            </div>
                            {slide.subtitle && (
                              <div className="list-card-subtitle" style={{ fontSize: "12px", whiteSpace: "normal" }}>
                                {slide.subtitle}
                              </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                              <span>CTA: <strong>{slide.cta}</strong></span>
                              <span>Link: <strong>{slide.href}</strong></span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                              <span style={{ fontSize: "10px", color: slide.accent_color, fontWeight: "bold", textTransform: "uppercase" }}>
                                Accent: {slide.accent_color}
                              </span>
                              <span className="list-card-badge" style={{ background: slide.is_active ? "var(--badge-success-bg)" : "rgba(244, 67, 54, 0.15)", color: slide.is_active ? "var(--badge-success-text)" : "#e57373" }}>
                                {slide.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}






            {activeTab === "notification_banners" && (
              <section className="content-card">
                <div className="section-header">
                  <h2>🔔 Notification Banner Management</h2>
                </div>

                {/* Create Form */}

                <form
                  onSubmit={handleCreateNotificationBanner}
                  className="banner-form"
                >
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={notifyTitle}
                      onChange={(e) =>
                        setNotifyTitle(e.target.value)
                      }
                      placeholder="Banner title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Target URL</label>
                    <input
                      type="text"
                      value={notifyTargetUrl}
                      onChange={(e) =>
                        setNotifyTargetUrl(e.target.value)
                      }
                      placeholder="/products"
                    />
                  </div>

                  <div className="form-group">
                    <label>Banner Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleNotifyImageChange}
                    />
                  </div>

                  {notifyImagePreview && (
                    <div className="notification-preview">
                      <img
                        src={notifyImagePreview}
                        alt="Preview"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={notifyActive}
                        onChange={(e) =>
                          setNotifyActive(e.target.checked)
                        }
                      />
                      Active Banner
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={notifySubmitLoading}
                  >
                    {notifySubmitLoading
                      ? "Creating..."
                      : "Create Notification Banner"}
                  </button>

                  {notifyFormMsg && (
                    <div
                      className={
                        notifyFormMsg.type === "success"
                          ? "success-message"
                          : "error-message"
                      }
                    >
                      {notifyFormMsg.text}
                    </div>
                  )}
                </form>

                <hr style={{ margin: "30px 0" }} />

                <h3>
                  Notification Banners (
                  {notificationBanners.length})
                </h3>

                {loadingNotificationBanners ? (
                  <p>Loading...</p>
                ) : (
                  <div className="notification-grid">
                    {notificationBanners.map((banner) => (
                      <div
                        key={banner.id}
                        className="notification-card"
                      >
                        <img
                          src={`${BASE_URL}${banner.image}`}
                          alt={banner.title}
                          className="notify-image"
                        />

                        <div className="notification-info">
                          <h4>{banner.title}</h4>

                          <p>
                            URL: {banner.target_url}
                          </p>

                          <span
                            className={
                              banner.is_active
                                ? "notify-status-active"
                                : "notify-status-inactive"
                            }
                          >
                            {banner.is_active
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginTop: "15px",
                            }}
                          >
                            <button
                              className="notify-action-btn"
                              onClick={() =>
                                handleNotificationBannerStatus(
                                  banner.id,
                                  banner.is_active
                                )
                              }
                            >
                              {banner.is_active
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              className="notify-action-btn danger"
                              onClick={() =>
                                handleDeleteNotificationBanner(
                                  banner.id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}




            {/* 6. ADMINS TAB (CREATE ADMIN USER) */}
            {activeTab === "admins" && (
              <div>
                <div className="form-panel">
                  <h3 className="form-title">🔑 Register New Administrator</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                    Create a new administrative user. The user will be created with <code style={{ color: "var(--primary, #e8320a)", fontWeight: "600" }}>is_staff = True</code> and will be able to log in to this management panel.
                  </p>

                  {authError && <div className="msg-box error">{authError}</div>}
                  {authSuccess && <div className="msg-box success">{authSuccess}</div>}

                  <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "500px" }}>
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
                      {authLoading ? <div className="spinner"></div> : "Create Admin User 🚀"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
