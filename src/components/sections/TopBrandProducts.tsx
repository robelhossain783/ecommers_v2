// "use client";

// import { useState } from "react";
// import { topBrands, brandProductMap, featuredProducts } from "@/data";
// import ProductCard from "@/components/ui/ProductCard";

// interface TopBrandsProps {
//   onAddToCart: () => void;
// }

// export default function TopBrandProducts({ onAddToCart }: TopBrandsProps) {
//   const [activeBrand, setActiveBrand] = useState("All");

//   const displayBrands = ["All", ...topBrands.slice(0, 10).map((b) => b.name)];

//   const products =
//     brandProductMap[activeBrand] ??
//     featuredProducts.filter((p) => p.brand === activeBrand).slice(0, 8);

//   return (
//     <div className="container section-gap">
//       <div className="section-header">
//         <h2 className="section-title">Top Brand Products</h2>
//         <a href="/brands" className="see-all">All Brands</a>
//       </div>

//       {/* Brand filter tabs */}
//       <div className="brands-tabs">
//         {displayBrands.map((brand) => (
//           <button
//             key={brand}
//             onClick={() => setActiveBrand(brand)}
//             className={`brand-tab ${activeBrand === brand ? "active" : ""}`}
//           >
//             {brand}
//           </button>
//         ))}
//       </div>

//       <div className="products-row">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
//           ))
//         ) : (
//           <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>
//             No products found for {activeBrand}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
