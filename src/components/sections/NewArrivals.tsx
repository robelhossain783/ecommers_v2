// "use client";

// import { useState } from "react";
// import { newArrivals } from "@/data";
// import ProductCard from "@/components/ui/ProductCard";

// interface NewArrivalsProps {
//   onAddToCart: () => void;
// }

// export default function NewArrivals({ onAddToCart }: NewArrivalsProps) {
//   // const [tab, setTab] = useState<"Gadgets" | "Device">("Gadgets");

//   // const products = tab === "Gadgets"
//   //   ? newArrivals.filter((p) => ["smart-watch", "earbuds", "airpods", "speakers"].includes(p.category))
//   //   : newArrivals;

//   return (
//     <div className="container section-gap">
//       <div className="section-header">
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <h2 className="section-title">New Arrival</h2>
//           <div style={{ display: "flex", gap: "0" }}>
//             {(["Gadgets", "Device"] as const).map((t, i) => (
//               <button
//                 key={t}
//                 // onClick={() => setTab(t)}
//                 style={{
//                   padding: "6px 14px",
//                   fontSize: "11px",
//                   fontWeight: 700,
//                   border: "1px solid var(--border)",
//                   borderRadius: i === 0 ? "4px 0 0 4px" : "0 4px 4px 0",
//                   // background: tab === t ? "var(--primary)" : "var(--bg-white)",
//                   color: tab === t ? "#fff" : "var(--text-muted)",
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                 }}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>
//         <a href="/new-arrivals" className="see-all">View All</a>
//       </div>
//       <div className="products-row">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
//         ))}
//       </div>
//     </div>
//   );
// }


// // "use client";

// // import { useEffect, useState } from "react";
// // import ProductCard from "@/components/ui/ProductCard";
// // import { getNewArrivals, Product } from "@/lib/api";

// // interface NewArrivalsProps {
// //   onAddToCart: () => void;
// // }

// // export default function NewArrivals({ onAddToCart }: NewArrivalsProps) {
// //   const [tab, setTab] = useState<"Gadgets" | "Device">("Gadgets");
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   // 🔥 API CALL
// //   useEffect(() => {
// //     async function loadData() {
// //       setLoading(true);

// //       const data = await getNewArrivals();
// //       setProducts(data);

// //       setLoading(false);
// //     }

// //     loadData();
// //   }, []);

// //   // 🔥 FILTER LOGIC
// //   const filteredProducts =
// //     tab === "Gadgets"
// //       ? products.filter((p) =>
// //           ["smart-watch", "earbuds", "airpods", "speakers"].includes(p.category)
// //         )
// //       : products;

// //   return (
// //     <div className="container section-gap">
// //       <div className="section-header">
// //         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
// //           <h2 className="section-title">New Arrival</h2>

// //           <div style={{ display: "flex" }}>
// //             {(["Gadgets", "Device"] as const).map((t, i) => (
// //               <button
// //                 key={t}
// //                 onClick={() => setTab(t)}
// //                 style={{
// //                   padding: "6px 14px",
// //                   fontSize: "11px",
// //                   fontWeight: 700,
// //                   border: "1px solid var(--border)",
// //                   borderRadius: i === 0 ? "4px 0 0 4px" : "0 4px 4px 0",
// //                   background: tab === t ? "var(--primary)" : "var(--bg-white)",
// //                   color: tab === t ? "#fff" : "var(--text-muted)",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 {t}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         <a href="/new-arrivals" className="see-all">
// //           View All
// //         </a>
// //       </div>

// //       {/* 🔥 LOADING */}
// //       {loading ? (
// //         <p>Loading products...</p>
// //       ) : (
// //         <div className="products-row">
// //           {filteredProducts.length > 0 ? (
// //             filteredProducts.map((product) => (
// //               <ProductCard
// //                 key={product.id}
// //                 product={product}
// //                 onAddToCart={onAddToCart}
// //               />
// //             ))
// //           ) : (
// //             <p>No products found</p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// import { getNewArrival2 } from "@/lib/api";
// import ProductCard from "@/components/ui/ProductCard";
// import { useCart } from "@/context/CartContext";
// import { useRouter } from "next/navigation";
// import { Product } from "@/lib/backend_type";

// interface NewArrivalsProps {
//   onAddToCart?: () => void;
// }

// export default function NewArrivals({ onAddToCart }: NewArrivalsProps) {
//   const { addToCart } = useCart();
//   const router = useRouter();

//   const handleAddToCart = (product: Product) => {
//     addToCart(product);
//     onAddToCart?.();
//     router.push("/cart");
//   };

//   return (
//     <div className="container section-gap">

//       {/* HEADER */}
//       <div className="section-header">
//         <h2 className="section-title">New Arrival</h2>

//         <a href="/new-arrivals" className="see-all">
//           View All
//         </a>
//       </div>

//       {/* PRODUCTS */}
//       <div className="products-row">
//         {newArrivals2.map((product) => (
//           <ProductCard
//             key={product.id}
//             product={product as Product}
//             onAddToCart={() => handleAddToCart(product as Product)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import { getNewArrival2 } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/lib/backend_type";

interface NewArrivalsProps {
  onAddToCart?: () => void;
}

export default function NewArrivals({ onAddToCart }: NewArrivalsProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function load() {
      const data = await getNewArrival2({ is_new_arrivals: true });
      setProducts(data);
    }
    load();
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const check = () => setHasOverflow(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [products]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    onAddToCart?.();
  };

  // ---- Arrow scroll ----
  const scrollBy = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  // ---- Mouse drag handlers ----
  const onMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = sliderRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    el.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
      sliderRef.current.style.userSelect = "";
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="container section-gap">

      {/* HEADER */}
      <div className="section-header">
        <h2 className="section-title">New Arrival</h2>
        <Link href="/new-arrivals" className="see-all">
          View All
        </Link>
      </div>

      {/* HORIZONTAL SLIDER */}
      <style>{`
        .new-arrival-slider-wrapper {
          position: relative;
        }
        .new-arrival-slider::-webkit-scrollbar {
          display: none;
        }
        .slider-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(232,50,10,0.3);
          background: #ffffff;
          color: #e8320a;
          font-size: 22px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (hover: hover) {
          .slider-arrow-btn:hover {
            background: #e8320a;
            color: #ffffff;
            border-color: #e8320a;
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 16px rgba(232, 50, 10, 0.3);
          }
        }
        .slider-arrow-btn:active {
          transform: translateY(-50%) scale(0.95);
        }
        .slider-arrow-left {
          left: -20px;
        }
        .slider-arrow-right {
          right: -20px;
        }

        @media (max-width: 1024px) {
          .slider-arrow-left {
            left: 8px;
          }
          .slider-arrow-right {
            right: 8px;
          }
        }

        @media (max-width: 640px) {
          .slider-arrow-btn {
            width: 32px;
            height: 32px;
            font-size: 18px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          }
          .slider-arrow-left {
            left: 4px;
          }
          .slider-arrow-right {
            right: 4px;
          }
        }
      `}</style>
      
      <div className="new-arrival-slider-wrapper">
        {/* Left Arrow Button */}
        {hasOverflow && (
          <button
            onClick={() => scrollBy("left")}
            className="slider-arrow-btn slider-arrow-left"
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        {/* Right Arrow Button */}
        {hasOverflow && (
          <button
            onClick={() => scrollBy("right")}
            className="slider-arrow-btn slider-arrow-right"
            aria-label="Scroll right"
          >
            ›
          </button>
        )}

        <div
          ref={sliderRef}
          className="new-arrival-slider"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            overflowX: "auto",
            overflowY: "visible",
            scrollSnapType: "x mandatory",
            cursor: "grab",
            paddingBottom: "12px",
            paddingTop: "4px",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                flex: "0 0 auto",
                width: "200px",
                scrollSnapAlign: "start",
              }}
            >
              <ProductCard
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}