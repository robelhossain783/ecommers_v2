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

// Render backend URL
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "";

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {

  if (!product) return null;

  const sellPrice = Number(product.sell_price || 0);
  const regularPrice = Number(product.regular_price || 0);

  const hasDiscount =
    regularPrice > sellPrice;

  const discount = hasDiscount
    ? regularPrice - sellPrice
    : 0;

  // IMAGE FIX
  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`
    : "/no-image.png";

  return (
    <div className="product-card">

      {/* DISCOUNT BADGE */}
      {hasDiscount && (
        <span className="product-badge">
          ৳{discount} OFF
        </span>
      )}

      {/* PRODUCT LINK */}
      <Link
        href={`/product/${product.slug}`}
        className="product-card-link"
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >

        {/* IMAGE */}
        <div className="product-image-wrapper">

          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name || "Product"}
              width={250}
              height={200}
              className="product-image"
              unoptimized
            />
          ) : (
            <div className="no-image">
              No Image
            </div>
          )}

        </div>

        {/* PRODUCT NAME */}
        <h3 className="product-name">
          {product.name}
        </h3>

        {/* CATEGORY */}
        <p className="product-category">
          {product.category?.name || "Category"}
        </p>

        {/* PRICE */}
        <div className="product-prices">

          <span className="product-detail-sell-price">
            ৳{sellPrice}
          </span>

          {hasDiscount && (
            <span className="product-detail-regular-price">
              ৳{regularPrice}
            </span>
          )}

        </div>

        {/* STOCK */}
        <p className="stock">
          Stock: {product.stock ?? 0}
        </p>

      </Link>

      {/* ADD TO CART BUTTON */}
      <button
        className="add-cart-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart();
        }}
      >
        Add to Cart
      </button>

    </div>
  );
}