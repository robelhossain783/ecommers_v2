"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";

interface QuickAddModalProps {
  product: Product;
  onClose: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const sizeList = product.size
    ? product.size.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`
    : null;

  const sellPrice = Number(product.sell_price || 0);
  const regularPrice = Number(product.regular_price || 0);
  const hasDiscount = regularPrice && regularPrice > sellPrice;

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAdd = () => {
    if (sizeList.length > 0 && !selectedSize) {
      setError("Please select a size");
      return;
    }
    const res = addToCart(product, 1, selectedSize || undefined);
    if (res && !res.success) {
      setError(res.message || "Failed to add");
      return;
    }
    setAdded(true);
    setTimeout(() => onClose(), 900);
  };

  return (
    <div className="qam-overlay" onClick={onClose}>
      <div className="qam-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="qam-close" onClick={onClose} title="Close">
          <X size={18} strokeWidth={2} />
        </button>

        {/* Product info row */}
        <div className="qam-product-row">
          <div className="qam-img-wrap">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name}
                width={90}
                height={90}
                className="qam-img"
                unoptimized
              />
            ) : (
              <div className="qam-img-placeholder">No Image</div>
            )}
          </div>

          <div className="qam-info">
            <p className="qam-category">{product.category?.name || "Product"}</p>
            <h3 className="qam-name">{product.name}</h3>
            <div className="qam-prices">
              <span className="qam-sell-price">৳{sellPrice}</span>
              {hasDiscount && (
                <span className="qam-regular-price">৳{regularPrice}</span>
              )}
            </div>
          </div>
        </div>

        {/* Size selection */}
        {sizeList.length > 0 && (
          <div className="qam-size-section">
            <p className="qam-size-label">
              Select Size
              {selectedSize && <span className="qam-size-selected-val"> — {selectedSize}</span>}
            </p>
            <div className="qam-size-chips">
              {sizeList.map((sz) => (
                <button
                  key={sz}
                  className={`qam-size-chip${selectedSize === sz ? " active" : ""}`}
                  onClick={() => {
                    setSelectedSize(sz);
                    setError("");
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
            {error && <p className="qam-error">{error}</p>}
          </div>
        )}

        {/* Add button */}
        <button
          className={`qam-add-btn${added ? " qam-added" : ""}`}
          onClick={handleAdd}
          disabled={added}
        >
          {added ? (
            "✓ Added to Cart!"
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
