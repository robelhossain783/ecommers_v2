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


"use client";

import Image from "next/image";
// import { a } from "@/types";
import { Product } from "@/lib/backend_type";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const BASE_URL = "http://127.0.0.1:8000";

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {

  const sellPrice = Number(product.sell_price);
  const regularPrice = Number(product.regular_price);

  const hasDiscount =
    regularPrice && regularPrice > sellPrice;

  const discount =
    hasDiscount
      ? regularPrice - sellPrice
      : 0;

  return (
    <div className="product-card">

      {/* DISCOUNT BADGE */}
      {hasDiscount && (
        <span className="product-badge">
          ৳{discount} OFF
        </span>
      )}

      <div className="product-image-wrapper">
  {product.image ? (
    <Image
      src={`${BASE_URL}${product.image}`}
      alt={product.name}
      width={250}
      height={200}
      className="product-image"
      unoptimized
    />
  ) : (
    <div className="no-image">No Image</div>
  )}
</div>

      {/* PRODUCT NAME */}
      <h3 className="product-name">
        {product.name}
      </h3>

      {/* CATEGORY */}
      <p className="product-category">
        {product.category.name}
      </p>

      {/* PRICE */}
      <div className="product-prices">

        <span className="sale-price">
          ৳{sellPrice}
        </span>

        {hasDiscount && (
          <span className="regular-price">
            ৳{regularPrice}
          </span>
        )}

      </div>

      {/* STOCK */}
      <p className="stock">
        Stock: {product.stock}
      </p>

      {/* BUTTON */}
      <button
        className="add-cart-btn"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>

    </div>
  );
}