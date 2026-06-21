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

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/backend_type";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {

  // সেফটি চেক: যদি কোনো কারণে প্রোডাক্ট অবজেক্টই না থাকে
  if (!product) return null;

  const sellPrice = Number(product.sell_price || 0);
  const regularPrice = Number(product.regular_price || 0);

  const hasDiscount = regularPrice && regularPrice > sellPrice;
  const discount = hasDiscount ? regularPrice - sellPrice : 0;

  // ব্যাকএন্ড থেকে আসা ইমেজ ক্লাউডিনারি নাকি লোকালহোস্ট তা চেক করার নিরাপদ লজিক
  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`
    : null;

  return (
    <div className="product-card">

      {/* DISCOUNT BADGE */}
      {hasDiscount && (
        <span className="product-badge">
          ৳{discount} OFF
        </span>
      )}

      <Link href={`/product/${product.slug || product.id}`} className="product-card-link" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="product-card-image-wrapper">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name || "Product Image"}
              width={250}
              height={200}
              className="product-card-image"
              unoptimized
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        {/* CATEGORY */}
        <p className="product-card-category">
          {product.category?.name || "Gadget"}
        </p>

        {/* PRODUCT NAME */}
        <h3 className="product-card-name">
          {product.name || "Unnamed Product"}
        </h3>

        {/* PRICE */}
        <div className="product-card-prices">
          <span className="product-card-sell-price">
            ৳{sellPrice}
          </span>

          {hasDiscount && (
            <span className="product-card-regular-price">
              ৳{regularPrice}
            </span>
          )}
        </div>

        {/* STOCK */}
        <p className={`product-card-stock ${product.stock && product.stock > 0 ? "" : "out-of-stock"}`}>
          {product.stock && product.stock > 0 ? `Stock: ${product.stock}` : "Stock Out"}
        </p>
      </Link>

      {/* BUTTON */}
      <button
        className={`add-cart-btn ${product.stock && product.stock > 0 ? "" : "out-of-stock"}`}
        disabled={!product.stock || product.stock <= 0}
        onClick={(e) => {
          if (!product.stock || product.stock <= 0) return;
          e.preventDefault();
          e.stopPropagation();
          onAddToCart();
        }}
      >
        {product.stock && product.stock > 0 ? "Add to Cart" : "Stock Out"}
      </button>

    </div>
  );
}