"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { Product } from "@/lib/backend_type";
import QuickAddModal from "@/components/ui/QuickAddModal";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Helper mapping for common color names to CSS hex
const COLOR_MAP: Record<string, string> = {
  black: "#18181b",
  brown: "#78350f",
  chocolate: "#451a03",
  green: "#15803d",
  blue: "#1d4ed8",
  navy: "#0f172a",
  red: "#dc2626",
  white: "#f8fafc",
  grey: "#64748b",
  gray: "#64748b",
  gold: "#d97706",
  tan: "#d97706",
  maroon: "#881337",
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const sellPrice = Number(product.sell_price || 0);
  const regularPrice = Number(product.regular_price || 0);

  const hasDiscount = regularPrice > 0 && regularPrice > sellPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - sellPrice) / regularPrice) * 100)
    : 0;
  const savingsAmount = hasDiscount ? regularPrice - sellPrice : 0;

  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`
    : null;

  const sizeList = product.size
    ? product.size.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const colorList = product.color
    ? product.color.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean)
    : [];

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : typeof product.category === "string" && product.category
      ? product.category
      : "Ryor Official";

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.stock || product.stock <= 0) return;

    if (sizeList.length > 0) {
      setShowModal(true);
    } else {
      addToCart(product);
      onAddToCart?.();
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const isAvailable = product.stock && product.stock > 0;
  const reviewCount = product.reviews?.length || ((product.id % 6) + 4);

  return (
    <>
      <div className="product-card">
        {/* Discount / Status Badge */}
        {hasDiscount && (
          <span className="product-card-discount-badge">
            -{discountPercent}% OFF
          </span>
        )}

        {!hasDiscount && product.badge && (
          <span className="product-card-discount-badge custom">
            {product.badge}
          </span>
        )}

        {/* Link Wrapper */}
        <Link href={`/product/${product.slug || product.id}`} className="product-card-link">
          {/* Main Image Showcase */}
          <div className="product-card-image-box">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name || "Product Image"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                className="product-card-img"
                unoptimized
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>

          {/* Details Section */}
          <div className="product-card-content">
            {/* Category / Brand Name */}
            <span className="product-card-category">{categoryName}</span>

            {/* Product Title */}
            <h3 className="product-card-title" title={product.name}>
              {product.name || "Unnamed Product"}
            </h3>

            {/* Stock status row */}
            <div className="product-card-meta-row">
              <span className={`stock-indicator ${isAvailable ? "in-stock" : "out-stock"}`}>
                <span className="stock-dot" />
                {isAvailable ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Price Row */}
            <div className="product-card-price-row">
              <span className="sell-price">
                ৳{sellPrice.toLocaleString("en-BD")}
              </span>

              {hasDiscount && (
                <>
                  <span className="regular-price">
                    ৳{regularPrice.toLocaleString("en-BD")}
                  </span>
                  <span className="savings-badge">
                    Save ৳{savingsAmount.toLocaleString("en-BD")}
                  </span>
                </>
              )}
            </div>


          </div>
        </Link>

        {/* Action Button */}
        <div className="product-card-button-wrapper">
          <button
            className={`product-card-add-btn ${!isAvailable ? "disabled" : ""} ${isAdded ? "added" : ""}`}
            disabled={!isAvailable}
            onClick={handleAddToCartClick}
          >
            {!isAvailable ? (
              "Stock Out"
            ) : isAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick size-select modal */}
      {showModal && (
        <QuickAddModal
          product={product}
          onClose={() => {
            setShowModal(false);
            onAddToCart?.();
          }}
        />
      )}
    </>
  );
}
