"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
import { newArrivals as staticArrivals, brandProductMap } from "@/data";
import { ChevronRight } from "lucide-react";

interface Category {
  id?: number;
  name: string;
  slug: string;
  image?: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  gadget: "🔌",
  gadgets: "🔌",
  "mobile-phone": "📱",
  mobile: "📱",
  phone: "📱",
  phones: "📱",
  laptop: "💻",
  laptops: "💻",
  tablet: "📟",
  tablets: "📟",
  "smart-watch": "⌚",
  smartwatch: "⌚",
  wallet: "💼",
  wallets: "💼",
  backpack: "🎒",
  backpacks: "🎒",
  airpods: "🎧",
  speakers: "🔊",
  "home-appliances": "🏠",
};

function CategoryProductsContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const categorySlug = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTitle, setCategoryTitle] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

        if (!categorySlug) {
          // Show all categories
          const catRes = await fetch(`${baseUrl}/api/categories/list/`);
          if (catRes.ok) {
            const cats = await catRes.json();
            setCategories(cats);
          }
          setCategoryTitle("All Categories");
          setProducts([]);
        } else {
          // Show products for selected category
          let foundName = "";
          try {
            const catRes = await fetch(`${baseUrl}/api/categories/list/`);
            if (catRes.ok) {
              const cats = await catRes.json();
              const found = cats.find((cat: any) =>
                cat.slug?.toLowerCase() === categorySlug.toLowerCase() ||
                cat.name?.toLowerCase().replace(/\s+/g, "-") === categorySlug.toLowerCase()
              );
              if (found) foundName = found.name;
            }
          } catch (err) {
            console.error("Failed to load categories:", err);
          }

          setCategoryTitle(foundName || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1));
          setCategories([]);

          const apiProducts = await getNewArrivals();
          const staticList = [
            ...staticArrivals,
            ...Object.values(brandProductMap).flat()
          ];
          const allProducts = apiProducts.length > 0 ? apiProducts : staticList;

          const filtered = allProducts.filter((product) => {
            if (!product.category) return false;
            const prodCatSlug = typeof product.category === "object"
              ? product.category.slug?.toLowerCase()
              : "";
            const prodCatName = typeof product.category === "object"
              ? product.category.name?.toLowerCase().replace(/\s+/g, "-")
              : "";
            return prodCatSlug === categorySlug.toLowerCase() || prodCatName === categorySlug.toLowerCase();
          });

          setProducts(filtered);
          setVisibleCount(20);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [categorySlug]);

  const handleAddToCart = (product: Product) => {
    const res = addToCart(product, 1);
    if (res && !res.success) {
      setNotification({ type: "error", text: res.message || "Could not add to cart" });
    } else {
      setNotification({ type: "success", text: `"${product.name}" added to cart!` });
    }
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const sortedProducts = [...products];
  if (sortBy === "price-asc") sortedProducts.sort((a, b) => Number(a.sell_price) - Number(b.sell_price));
  if (sortBy === "price-desc") sortedProducts.sort((a, b) => Number(b.sell_price) - Number(a.sell_price));

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <div className="checkout-spinner" style={{ margin: "0 auto 16px" }}></div>
        <h2 style={{ fontSize: "18px", color: "var(--text-secondary)" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="category-products-container">
      {/* Breadcrumb */}
      <nav className="product-breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={12} strokeWidth={2.5} />
        <span>{categoryTitle}</span>
      </nav>

      {categories.length > 0 ? (
        <>
          <div className="category-products-header">
            <h1 className="category-products-title">{categoryTitle}</h1>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => {
              const icon = CATEGORY_ICONS[cat.slug] || "📦";
              return (
                <Link
                  key={cat.id}
                  href={`/category_product?category=${cat.slug}`}
                  className="category-item"
                >
                  <div className="cat-icon-wrap">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="cat-icon-img" />
                    ) : (
                      <span className="cat-icon-emoji">{icon}</span>
                    )}
                  </div>
                  <span className="cat-name">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="category-products-header">
            <h1 className="category-products-title">{categoryTitle}</h1>
            <div className="category-header-sort">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <>
              <div className="products-row">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
              {hasMore && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
                  <button onClick={handleSeeMore} className="nt-see-more-btn">
                    See More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-category-view">
              <span className="empty-category-icon">🛍️</span>
              <h2 className="empty-category-title">No Products Found</h2>
              <p className="empty-category-desc">
                We currently don't have any items available under <strong>{categoryTitle}</strong>.
                Our team is working hard to restock this category soon!
              </p>
              <div style={{ marginTop: "32px" }}>
                <Link href="/" className="continue-shopping" style={{ background: "var(--primary)", color: "#fff", padding: "12px 32px", borderRadius: "30px", fontWeight: "700", fontSize: "14px" }}>
                  Back to Home Store
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {notification && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: notification.type === "success" ? "#10b981" : "#ef4444",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span>{notification.type === "success" ? "✅" : "⚠️"}</span>
          <span>{notification.text}</span>
        </div>
      )}
    </div>
  );
}

export default function CategoryProductsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Preparing...</h2>
        </div>
      }>
        <CategoryProductsContent />
      </Suspense>
      <Footer />
    </>
  );
}
