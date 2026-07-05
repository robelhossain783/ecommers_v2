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

function CategoryProductsContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const categorySlug = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTitle, setCategoryTitle] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadProductsAndCategories() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

        // Resolve title
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

        if (foundName) {
          setCategoryTitle(foundName);
        } else if (categorySlug) {
          setCategoryTitle(categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1));
        } else {
          setCategoryTitle("All Categories");
        }

        // 2. Fetch products
        const apiProducts = await getNewArrivals();

        // Fallbacks
        const staticList = [
          ...staticArrivals,
          ...Object.values(brandProductMap).flat()
        ];
        const allProducts = apiProducts.length > 0 ? apiProducts : staticList;

        // Filter by slug
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
      } catch (error) {
        console.error("Failed to load category products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProductsAndCategories();
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <div className="checkout-spinner" style={{ margin: "0 auto 16px" }}></div>
        <h2 style={{ fontSize: "18px", color: "var(--text-secondary)" }}>Filtering products...</h2>
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

      {sortedProducts.length > 0 ? (
        <div className="products-row">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
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
          <h2>Preparing product filters...</h2>
        </div>
      }>
        <CategoryProductsContent />
      </Suspense>
      <Footer />
    </>
  );
}
