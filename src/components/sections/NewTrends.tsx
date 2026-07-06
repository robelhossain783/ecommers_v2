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





// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import ProductCard from "@/components/ui/ProductCard";
// import { getNewArrivals } from "@/lib/api";
// import { Product } from "@/lib/backend_type";
// import { useCart } from "@/context/CartContext";
// import { getNewArrival2 } from "@/lib/api";

// interface NewTrendsProps {
//   onAddToCart?: () => void;
// }

// export default function NewTrends({ onAddToCart }: NewTrendsProps) {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [product, setProduct] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { addToCart } = useCart();

//   // ---------------- FETCH API ----------------
//   useEffect(() => {
//     async function fetchProducts() {
//       try {

//         const data = await getNewArrivals();
//         console.log("API DATA:", data);
//         setProducts(data);
//       } catch (error) {
//         console.log("API Error:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);
//   useEffect(() => {
//     async function load() {
//       const data = await getNewArrival2();
//       setProduct(data);
//     }
//     load();
//   }, []);


//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await getNewArrivals();
//         setProduct(data);
//       } catch (err) {
//         setProduct([]);
//       }
//     }
//     load();
//   }, []);

//   // 👉 ADD TO CART HANDLER
//   const handleAddToCart = (product: Product) => {
//     console.log("Added:", product);

//     addToCart(product); // ✅ Add to global cart context
//     onAddToCart?.(); // optional callback

//     router.push("/cart"); // 🔥 go to cart page
//   };

//   // ---------------- LOADING ----------------
//   if (loading) {
//     return (
//       <div className="container section-gap">
//         <h2>Loading products...</h2>
//       </div>
//     );
//   }

//   // ---------------- UI ----------------
//   return (
//     <div className="container section-gap">

//       <div className="section-header">
//         <h2 className="section-title">Top Selling Product</h2>

//         <a href="/arrivals" className="see-all">
//           View All
//         </a>
//       </div>

//       <div className="products-row">
//         {product.map((product) => (
//           <ProductCard
//             key={product.id}
//             product={product}
//             onAddToCart={() => handleAddToCart(product)}
//           />
//         ))}
//       </div>

//       <div className="products-row">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               onAddToCart={() => handleAddToCart(product)}
//             />
//           ))
//         ) : (
//           <p>No Product Found</p>
//         )}
//       </div>
//       {/* <div className="products-row">
//   {products.map((p) => {
//     console.log("RENDER PRODUCT:", p);
//     return (
//       <ProductCard
//         key={p.id}
//         product={p}
//         onAddToCart={onAddToCart}
//       />
//     );
//   })}
// </div> */}

//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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

      {/* HEADER */}
      <div className="section-header">
        <h2 className="section-title">Just For You</h2>
        <Link href="/all-products" className="see-all">
          View All
        </Link>
      </div>

      {/* PRODUCTS GRID */}
      <div className="products-row">
        {visibleProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={() => handleAddToCart(p)}
          />
        ))}
      </div>

      {/* SEE MORE BUTTON */}
      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
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
            {loadingMore
              ? "Loading..."
              : `See More`}
          </button>
        </div>
      )}
    </div>
  );
}