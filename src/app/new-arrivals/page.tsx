"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getNewArrival2 } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
import { newArrivals as staticArrivals, brandProductMap } from "@/data";

const PAGE_SIZE = 30;

export default function NewArrivalsAllPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSeeMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  };

  useEffect(() => {
    async function loadAllProducts() {
      setLoading(true);
      try {
        // Fetch all products from Backend API
        const apiProducts = await getNewArrival2();

        // Prepare static fallbacks
        const staticList = [
          ...staticArrivals,
          ...Object.values(brandProductMap).flat()
        ] as Product[];

        // Use api products if available, else fall back to static
        const allProducts = apiProducts.length > 0 ? apiProducts : staticList;

        // De-duplicate products by ID to guarantee uniqueness in grid
        const uniqueProductsMap = new Map<number, Product>();
        allProducts.forEach((product) => {
          if (product && product.id) {
            uniqueProductsMap.set(product.id, product);
          }
        });
        const uniqueProducts = Array.from(uniqueProductsMap.values());

        setProducts(uniqueProducts);
      } catch (error) {
        console.error("Failed to fetch all products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAllProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <>
      {/* <TopBar /> */}
      <Header />

      <div className="category-products-container">
        {/* Breadcrumb navigation */}
        <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>All Products</span>
        </div>

        {/* Header Section */}
        <div className="category-products-header">
          <h1 className="category-products-title">All Products</h1>
          {/* <p className="category-products-count">
            Explore our curated selection of <strong>{products.length}</strong> premium gadgets and accessories
          </p> */}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="checkout-spinner" style={{ margin: "0 auto 16px" }}></div>
            <h2 style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "600" }}>
              Loading awesome products...
            </h2>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="products-row">
              {products.slice(0, visibleCount).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>

            {visibleCount < products.length && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
                <button
                  onClick={handleSeeMore}
                  disabled={loadingMore}
                  style={{
                    background: "linear-gradient(135deg, #e8320a 0%, #ff6b35 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 36px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: "0 4px 16px rgba(232,50,10,0.3)",
                    letterSpacing: "0.3px",
                    opacity: loadingMore ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,50,10,0.45)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,50,10,0.3)";
                  }}
                >
                  {loadingMore ? "Loading..." : "See More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-category-view">
            <span className="empty-category-icon">🛍️</span>
            <h2 className="empty-category-title">No Products Listed</h2>
            <p className="empty-category-desc">
              We couldn't find any products in the store list. Please check back later!
            </p>
            <Link href="/" className="continue-shopping">
              Back to Home Store
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
