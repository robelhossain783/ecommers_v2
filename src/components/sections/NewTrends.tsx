"use client";

import { newTrends } from "@/data";
import ProductCard from "@/components/ui/ProductCard";

interface NewTrendsProps {
  onAddToCart: () => void;
}

export default function NewTrends({ onAddToCart }: NewTrendsProps) {
  return (
    <div className="container section-gap">
      <div className="section-header">
        <h2 className="section-title">Top Selling Product</h2>
        <a href="/category" className="see-all">View All</a>
      </div>
      <div className="products-row">
        {newTrends.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}
