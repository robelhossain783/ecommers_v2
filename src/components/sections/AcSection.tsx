// "use client";

// import { acProducts } from "@/data";
// import ProductCard from "@/components/ui/ProductCard";

// interface AcSectionProps {
//   onAddToCart: () => void;
// }

// export default function AcSection({ onAddToCart }: AcSectionProps) {
//   return (
//     <div className="container section-gap">
//       <div className="section-header">
//         <h2 className="section-title">Great Deals On Air Conditioner</h2>
//         <a href="/category/air-conditioner" className="see-all">View All</a>
//       </div>
//       <div className="ac-section">
//         {/* Left banner */}
//         <div className="ac-banner">
//           <span className="ac-banner-icon">❄️</span>
//           <p className="ac-banner-title">Air Conditioner Deals</p>
//           <a href="/category/air-conditioner" className="ac-banner-link">Shop Now</a>
//         </div>

//         {/* Products */}
//         <div className="ac-products">
//           {acProducts.map((product) => (
//             <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
