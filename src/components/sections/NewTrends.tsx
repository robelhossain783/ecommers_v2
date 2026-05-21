// "use client";

// import { newTrends } from "@/data";
// import ProductCard from "@/components/ui/ProductCard";

// interface NewTrendsProps {
//   onAddToCart: () => void;
// }

// export default function NewTrends({ onAddToCart }: NewTrendsProps) {
//   return (
//     <div className="container section-gap">
//       <div className="section-header">
//         <h2 className="section-title">Top Selling Product</h2>
//         <a href="/category" className="see-all">View All</a>
//       </div>
//       <div className="products-row">
//         {newTrends.map((product) => (
//           <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";

interface NewTrendsProps {
  onAddToCart?: () => void;
}

export default function NewTrends({ onAddToCart }: NewTrendsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();

  // ---------------- FETCH API ----------------
  useEffect(() => {
    async function fetchProducts() {
      try {

        const data = await getNewArrivals();
        console.log("API DATA:", data);
        setProducts(data);
      } catch (error) {
        console.log("API Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);
  // 👉 ADD TO CART HANDLER
  const handleAddToCart = (product: Product) => {
    console.log("Added:", product);

    addToCart(product); // ✅ Add to global cart context
    onAddToCart?.(); // optional callback

    router.push("/cart"); // 🔥 go to cart page
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="container section-gap">
        <h2>Loading products...</h2>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="container section-gap">

      <div className="section-header">
        <h2 className="section-title">Top Selling Product</h2>

        <a href="/category" className="see-all">
          View All
        </a>
      </div>

      <div className="products-row">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))
        ) : (
          <p>No Product Found</p>
        )}
      </div>
      {/* <div className="products-row">
  {products.map((p) => {
    console.log("RENDER PRODUCT:", p);
    return (
      <ProductCard
        key={p.id}
        product={p}
        onAddToCart={onAddToCart}
      />
    );
  })}
</div> */}

    </div>
  );
}