// "use client";

// import { useState } from "react";
// import { featuredProducts } from "@/data";
// import ProductCard from "@/components/ui/ProductCard";

// interface FeaturedProductsProps {
//   onAddToCart: () => void;
// }

// const TABS = ["BEST DEALS", "TOP SELLING"];

// export default function FeaturedProducts({ onAddToCart }: FeaturedProductsProps) {
//   const [activeTab, setActiveTab] = useState(0);

//   const products = activeTab === 0
//     ? featuredProducts.filter((p) => p.regularPrice && p.regularPrice > p.salePrice)
//     : featuredProducts;

//   return (
//     <div className="container section-gap">
//       <div className="section-header">
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <h2 className="section-title">Featured Products</h2>
//           <div style={{ display: "flex", gap: "0" }}>
//             {TABS.map((tab, i) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(i)}
//                 style={{
//                   padding: "6px 14px",
//                   fontSize: "11px",
//                   fontWeight: 700,
//                   letterSpacing: "0.5px",
//                   border: "1px solid var(--border)",
//                   borderRadius: i === 0 ? "4px 0 0 4px" : "0 4px 4px 0",
//                   background: activeTab === i ? "var(--primary)" : "var(--bg-white)",
//                   color: activeTab === i ? "#fff" : "var(--text-muted)",
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                 }}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>
//         <a href="/products" className="see-all">View All</a>
//       </div>
//       <div className="products-row">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
//         ))}
//       </div>
//     </div>
//   );
// }
