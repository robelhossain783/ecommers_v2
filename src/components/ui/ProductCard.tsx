"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
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

  if (!product) return null;

  const sellPrice = Number(product.sell_price || 0);
  const regularPrice = Number(product.regular_price || 0);

  const hasDiscount = regularPrice && regularPrice > sellPrice;
  const discount = hasDiscount ? regularPrice - sellPrice : 0;

  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`
    : null;

  return (
    <div className="product-card">

      {hasDiscount && (
        <span className="product-badge">
          ৳{discount} OFF
        </span>
      )}

      <Link href={`/product/${product.slug || product.id}`} className="product-card-link-inner">
        <div className="product-card-image-wrapper">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name || "Product Image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
              className="product-card-image"
              unoptimized
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        <div className="product-card-info">
          <p className="product-card-category">
            {product.category?.name || "Gadget"}
          </p>

          <h3 className="product-card-name">
            {product.name || "Unnamed Product"}
          </h3>

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

          <p className={`product-card-stock ${product.stock && product.stock > 0 ? "" : "out-of-stock"}`}>
            {product.stock && product.stock > 0 ? `In Stock` : "Stock Out"}
          </p>
        </div>
      </Link>

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
        {product.stock && product.stock > 0 ? (
          <>
            <ShoppingCart size={14} />
            <span>Add to Cart</span>
          </>
        ) : (
          "Stock Out"
        )}
      </button>

    </div>
  );
}
