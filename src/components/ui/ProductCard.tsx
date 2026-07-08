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
              width={250}
              height={200}
              className="product-card-image"
              unoptimized
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

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
          {product.stock && product.stock > 0 ? `Stock: ${product.stock}` : "Stock Out"}
        </p>
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
        {product.stock && product.stock > 0 ? "Add to Cart" : "Stock Out"}
      </button>

    </div>
  );
}
