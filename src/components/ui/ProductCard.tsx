// "use client";

// import { Product } from "@/types";
// import { formatPrice, getDiscount } from "@/lib/utils";

// interface ProductCardProps {
//   product: Product;
//   onAddToCart: () => void;
// }

// const BRAND_ICONS: Record<string, string> = {
//   Apple: "🍎",
//   Samsung: "📱",
//   Xiaomi: "📲",
//   Sony: "🎵",
//   JBL: "🔊",
//   Anker: "🔋",
//   Nothing: "⚪",
//   Philips: "💡",
//   Gree: "❄️",
//   Haier: "🌬️",
//   Midea: "🏠",
//   QCY: "🎧",
//   OnePlus: "📟",
//   realme: "📡",
//   Amazfit: "⌚",
//   default: "📦",
// };

// export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
//   const hasDiscount = product.regularPrice && product.regularPrice > product.salePrice;
//   const discountAmt = hasDiscount && product.regularPrice ? getDiscount(product.regularPrice, product.salePrice) : 0;
//   const icon = BRAND_ICONS[product.brand] ?? BRAND_ICONS.default;

//   return (
//     <div className="product-card">
//       {product.badge === "TBA" ? (
//         <span className="product-badge tba">TBA</span>
//       ) : hasDiscount ? (
//         <span className="product-badge">৳{discountAmt.toLocaleString()} OFF</span>
//       ) : null}

//       <div className="product-img">{icon}</div>

//       <p className="product-name">{product.name}</p>

//       <div className="product-prices">
//         {product.badge === "TBA" ? (
//           <span className="price-tba">TBA</span>
//         ) : (
//           <>
//             <span className="price-sale">{formatPrice(product.salePrice)}</span>
//             {hasDiscount && product.regularPrice && (
//               <span className="price-regular">{formatPrice(product.regularPrice)}</span>
//             )}
//           </>
//         )}
//       </div>

//       <button className="add-cart-btn" onClick={onAddToCart}>
//         Add to Cart
//       </button>
//     </div>
//   );
// }


// "use client";

// import Image from "next/image";
// import Link from "next/link";
// // import { a } from "@/types";
// import { Product } from "@/lib/backend_type";

// interface ProductCardProps {
//   product: Product;
//   onAddToCart: () => void;
// }

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// export default function ProductCard({
//   product,
//   onAddToCart,
// }: ProductCardProps) {

//   const sellPrice = Number(product.sell_price);
//   const regularPrice = Number(product.regular_price);

//   const hasDiscount =
//     regularPrice && regularPrice > sellPrice;

//   const discount =
//     hasDiscount
//       ? regularPrice - sellPrice
//       : 0;

//   return (
//     <div className="product-card">

//       {/* DISCOUNT BADGE */}
//       {hasDiscount && (
//         <span className="product-badge">
//           ৳{discount} OFF
//         </span>
//       )}

//       <Link href={`/product/${product.slug}`} className="product-card-link" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
//         <div className="product-image-wrapper">
//           {product.image ? (
//             <Image
//               src={product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`}
//               alt={product.name}
//               width={250}
//               height={200}
//               className="product-image"
//               unoptimized
//             />
//           ) : (
//             <div className="no-image">No Image</div>
//           )}
//         </div>

//         {/* PRODUCT NAME */}
//         <h3 className="product-name">
//           {product.name}
//         </h3>

//         {/* CATEGORY */}
//         <p className="product-category">
//           {product.category.name}
//         </p>

//         {/* PRICE */}
//         <div className="product-prices">

//           <span className="product-detail-sell-price">
//             ৳{sellPrice}
//           </span>

//           {hasDiscount && (

//             <span className="product-detail-regular-price">
//               ৳{regularPrice}
//             </span>
//           )}

//         </div>


//         {/* STOCK */}
//         <p className="stock">
//           Stock: {product.stock}
//         </p>
//       </Link>

//       {/* BUTTON */}
//       <button
//         className="add-cart-btn"
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           onAddToCart();
//         }}
//       >
//         Add to Cart
//       </button>

//     </div>
//   );
// }




"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/backend_type";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {

  // ✅ ইমেজ ইউআরএল ঠিক করার লজিক (যা হোম পেজে ইমেজ ফিরিয়ে আনবে)
  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image // ক্লাউডিনারি হলে সরাসরি লিঙ্ক বসবে
      : `${BASE_URL}${product.image}` // লোকালহোস্টের মিডিয়া ফাইল হলে ব্যাকএন্ড URL যুক্ত হবে
    : "/placeholder.png"; // ইমেজ না থাকলে একটি ডিফল্ট ইমেজ দেখাবে

  // প্রোডাক্টের ডিটেইলস পেজের লিঙ্ক (স্লাগ অনুযায়ী)
  const productLink = `/product/${product.slug || product.id}/`;

  return (
    <div className="product-card" style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius)", padding: "16px", background: "var(--bg-white)", display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>

      {/* PRODUCT IMAGE */}
      <Link href={productLink} className="product-card-image-wrap" style={{ display: "block", position: "relative", width: "100%", height: "200px", overflow: "hidden", borderRadius: "var(--radius-sm)" }}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          style={{ objectFit: "contain" }}
          unoptimized // ক্লাউডিনারি এবং এক্সটার্নাল ইমেজ যাতে কোনো বাধা ছাড়া লোড হয়
          className="product-img"
        />
      </Link>

      {/* PRODUCT INFO */}
      <div className="product-card-info" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="product-card-category" style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>
          {product.category?.name || "Gadget"}
        </span>

        <Link href={productLink}>
          <h3 className="product-card-title" style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", margin: 0, lineHeight: "1.4", height: "42px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="product-card-price-row" style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
          <span className="current-price" style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary)" }}>
            ৳{product.sell_price}
          </span>
          {product.regular_price && Number(product.regular_price) > Number(product.sell_price) && (
            <span className="old-price" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "line-through" }}>
              ৳{product.regular_price}
            </span>
          )}
        </div>
      </div>

      {/* ADD TO CART BUTTON */}
      <button
        onClick={onAddToCart}
        className="add-to-cart-btn"
        style={{ width: "100%", padding: "10px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "background 0.2s" }}
      >
        🛒 Add to Cart
      </button>

    </div>
  );
}