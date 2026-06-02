// "use client";

// import { useEffect, useState } from "react";
// import { Product } from "@/lib/backend_type";
// import ProductCard from "@/components/ui/ProductCard";
// import { getNewArrivals } from "@/lib/api";

// interface FeaturedProductsProps {
//     onAddToCart: () => void;
// }

// const TABS = ["BEST DEALS", "TOP SELLING"];

// export default function FeaturedProducts({ onAddToCart }: FeaturedProductsProps) {
//     const [activeTab, setActiveTab] = useState(0);
//     const [products, setProducts] = useState<Product[]>([]);

//     useEffect(() => {
//         async function fetchData() {
//             const data = await getNewArrivals();
//             setProducts(data);
//         }

//         fetchData();
//     }, []);

//     // BEST DEALS filter
//     const filteredProducts =
//         activeTab === 0
//             ? products.filter((p) => p.regular_price > p.sell_price)
//             : products;

//     return (
//         <div className="container section-gap">
//             <div className="section-header">
//                 <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//                     <h2 className="section-title">Featured Products</h2>

//                     <div style={{ display: "flex" }}>
//                         {TABS.map((tab, i) => (
//                             <button
//                                 key={tab}
//                                 onClick={() => setActiveTab(i)}
//                                 style={{
//                                     padding: "6px 14px",
//                                     fontSize: "11px",
//                                     fontWeight: 700,
//                                     border: "1px solid var(--border)",
//                                     background: activeTab === i ? "var(--primary)" : "#fff",
//                                     color: activeTab === i ? "#fff" : "#333",
//                                     cursor: "pointer",
//                                 }}
//                             >
//                                 {tab}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div className="products-row">
//                 {filteredProducts.map((product) => (
//                     <ProductCard
//                         key={product.id}
//                         product={product}
//                         onAddToCart={onAddToCart}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }