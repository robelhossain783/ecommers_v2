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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getNewArrival2();
      setProducts(data);
    }
    load();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    onAddToCart?.();
    router.push("/cart");
  };

  return (
    <div className="container section-gap">

      <div className="section-header">
        <h2 className="section-title">New Arrival</h2>

        {/* <a href="/new-arrivals" className="see-all">
          View All
        </a> */}
      </div>

      <div className="products-row">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

    </div>
  );
}