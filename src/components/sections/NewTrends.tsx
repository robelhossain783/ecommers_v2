"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";

const PAGE_SIZE = 20;

export default function NewTrends() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const data = await getNewArrivals();
        setProducts(data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleSeeMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="container section-gap">
        <h2>Loading...</h2>
      </div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="container section-gap">

      <div className="section-header">
        <h2 className="section-title">Just For You</h2>
        <Link href="/all-products" className="see-all">View All</Link>
      </div>

      <div className="products-row">
        {visibleProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={() => handleAddToCart(p)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="nt-see-more-wrap">
          <button
            onClick={handleSeeMore}
            disabled={loadingMore}
            className={`nt-see-more-btn${loadingMore ? " nt-see-more-loading" : ""}`}
          >
            {loadingMore ? "Loading..." : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}
