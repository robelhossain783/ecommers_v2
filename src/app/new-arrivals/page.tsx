"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import TopBar from "@/components/layout/TopBar";
import { ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getNewArrival2 } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
import { newArrivals as staticArrivals } from "@/data";

const PAGE_SIZE = 20;

export default function NewArrivalsAllPage() {
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
        // Fetch only New Arrival products from Backend API
        const apiProducts = await getNewArrival2({ is_new_arrivals: true });

        // Prepare static fallbacks
        const staticList = staticArrivals as Product[];

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
        console.error("Failed to fetch new arrival products:", error);
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
          <span>New Arrivals</span>
        </nav>

        {/* Header Section */}
        <div className="category-products-header">
          <h1 className="category-products-title">New Arrivals</h1>
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
                  className={`nt-see-more-btn${loadingMore ? " nt-see-more-loading" : ""}`}
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
