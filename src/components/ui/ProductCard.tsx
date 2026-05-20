"use client";

import { Product } from "@/types";
import { formatPrice, getDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const BRAND_ICONS: Record<string, string> = {
  Apple: "🍎",
  Samsung: "📱",
  Xiaomi: "📲",
  Sony: "🎵",
  JBL: "🔊",
  Anker: "🔋",
  Nothing: "⚪",
  Philips: "💡",
  Gree: "❄️",
  Haier: "🌬️",
  Midea: "🏠",
  QCY: "🎧",
  OnePlus: "📟",
  realme: "📡",
  Amazfit: "⌚",
  default: "📦",
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasDiscount = product.regularPrice && product.regularPrice > product.salePrice;
  const discountAmt = hasDiscount && product.regularPrice ? getDiscount(product.regularPrice, product.salePrice) : 0;
  const icon = BRAND_ICONS[product.brand] ?? BRAND_ICONS.default;

  return (
    <div className="product-card">
      {product.badge === "TBA" ? (
        <span className="product-badge tba">TBA</span>
      ) : hasDiscount ? (
        <span className="product-badge">৳{discountAmt.toLocaleString()} OFF</span>
      ) : null}

      <div className="product-img">{icon}</div>

      <p className="product-name">{product.name}</p>

      <div className="product-prices">
        {product.badge === "TBA" ? (
          <span className="price-tba">TBA</span>
        ) : (
          <>
            <span className="price-sale">{formatPrice(product.salePrice)}</span>
            {hasDiscount && product.regularPrice && (
              <span className="price-regular">{formatPrice(product.regularPrice)}</span>
            )}
          </>
        )}
      </div>

      <button className="add-cart-btn" onClick={onAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
