"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";

const PAGE_SIZE = 30;

export default function AllProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState("");

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
        // Fetch all products (no filter)
        const apiProducts = await getNewArrivals();

        // De-duplicate by ID
        const uniqueMap = new Map<number, Product>();
        apiProducts.forEach((product) => {
          if (product && product.id) uniqueMap.set(product.id, product);
        });

        setProducts(Array.from(uniqueMap.values()));
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

  const sortedProducts = [...products];
  if (sortBy === "price-asc") sortedProducts.sort((a, b) => Number(a.sell_price) - Number(b.sell_price));
  if (sortBy === "price-desc") sortedProducts.sort((a, b) => Number(b.sell_price) - Number(a.sell_price));

  return (
    <>
      <Header />

      <div className="category-products-container">
        {/* Breadcrumb */}
        <nav className="product-breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} strokeWidth={2.5} />
          <span>All Products</span>
        </nav>

        {/* Header Section */}
        <div className="category-products-header">
          <h1 className="category-products-title">All Products</h1>
          <div className="category-header-sort">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="checkout-spinner" style={{ margin: "0 auto 16px" }}></div>
            <h2 style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "600" }}>
              Loading awesome products...
            </h2>
          </div>
        ) : sortedProducts.length > 0 ? (
          <>
            <div className="products-row">
              {sortedProducts.slice(0, visibleCount).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>

            {visibleCount < sortedProducts.length && (
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
            <h2 className="empty-category-title">No Products Found</h2>
            <p className="empty-category-desc">
              We couldn't find any products. Please check back later!
            </p>
            <Link href="/" className="continue-shopping">
              Back to Home
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
