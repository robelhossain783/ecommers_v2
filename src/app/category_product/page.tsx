"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
import { newArrivals as staticArrivals, brandProductMap } from "@/data";

const CATEGORY_NAMES: Record<string, string> = {
  "gadget": "🔌 Gadgets",
  "mobile-phone": "📱 Mobile Phones",
  "laptops": "💻 Laptops",
  "tablet": "📟 Tablets",
  "smart-watch": "⌚ Smart Watches",
  "wallet": "💼 Wallets",
  "backpack": "🎒 Backpacks",
  "airpods": "🎧 AirPods",
  "speakers": "🔊 Speakers",
  "home-appliances": "🏠 Home Appliances",
};

function CategoryProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const categorySlug = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryTitle = CATEGORY_NAMES[categorySlug.toLowerCase()] ||
    (categorySlug ? `📁 ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}` : "📁 All Categories");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        // Fetch dynamic products from Backend API
        const apiProducts = await getNewArrivals();

        // Merge with static data for robust fallbacks
        const staticList = [
          ...staticArrivals,
          ...Object.values(brandProductMap).flat()
        ];

        // Use api products if available, else fallback to static
        const allProducts = apiProducts.length > 0 ? apiProducts : staticList;

        // Filter based on category slug
        const filtered = allProducts.filter((product) => {
          if (!product.category) return false;
          const matchesSlug = product.category.slug?.toLowerCase() === categorySlug.toLowerCase();
          const matchesName = product.category.name?.toLowerCase().replace(/\s+/g, "-") === categorySlug.toLowerCase();
          return matchesSlug || matchesName;
        });

        setProducts(filtered);
      } catch (error) {
        console.error("Failed to load category products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [categorySlug]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    alert(`"${product.name}" added to cart!`);
  };

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
      {/* Dynamic breadcrumb */}
      <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{categoryTitle}</span>
      </div>

      {/* Category Header Banner */}
      <div className="category-products-header">
        <h1 className="category-products-title">{categoryTitle}</h1>
        <p className="category-products-count">
          Showing <strong>{products.length}</strong> dynamic items in this category
        </p>
      </div>

      {/* Product Display Grid or Empty State */}
      {products.length > 0 ? (
        <div className="products-row">
          {products.map((product) => (
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

          <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "var(--text-secondary)" }}>
            Explore Other Hot Categories:
          </h3>
          <div className="browse-categories-grid">
            <Link href="/category_product?category=mobile-phone" className="browse-category-card">
              📱 Mobile Phones
            </Link>
            <Link href="/category_product?category=smart-watch" className="browse-category-card">
              ⌚ Smart Watches
            </Link>
            <Link href="/category_product?category=speakers" className="browse-category-card">
              🔊 Speakers
            </Link>
            <Link href="/category_product?category=laptops" className="browse-category-card">
              💻 Laptops
            </Link>
          </div>

          <div style={{ marginTop: "40px" }}>
            <Link href="/" className="continue-shopping" style={{ background: "var(--primary)", color: "#fff", padding: "12px 32px", borderRadius: "30px", fontWeight: "700", fontSize: "14px" }}>
              Back to Home Store
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryProductsPage() {
  return (
    <>
      <TopBar />
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
