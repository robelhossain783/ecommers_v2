"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, Minus, Plus, AlertCircle } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

export default function AddToCarts() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [cartErrors, setCartErrors] = useState<{ [productId: number]: string }>({});

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.product.sell_price) * item.quantity,
    0
  );

  const handleQuantityChange = (productId: number, newQty: number) => {
    const res = updateQuantity(productId, newQty);
    if (res && !res.success) {
      setCartErrors((prev) => ({
        ...prev,
        [productId]: res.message || "Limit exceeded"
      }));
      setTimeout(() => {
        setCartErrors((prev) => ({
          ...prev,
          [productId]: ""
        }));
      }, 4000);
    } else {
      setCartErrors((prev) => ({
        ...prev,
        [productId]: ""
      }));
    }
  };

  return (
    <>
      <Header />

      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart-view">
            <div className="empty-cart-icon">
              <ShoppingBag size={56} strokeWidth={1.2} />
            </div>
            <h2 className="empty-cart-title">Your Cart is Empty</h2>
            <p className="empty-cart-desc">
              Looks like you haven&apos;t added anything to your cart yet. Explore our awesome products!
            </p>
            <Link href="/" className="continue-shopping">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <h1 className="cart-title">Shopping Cart ({cart.length} item{cart.length > 1 ? "s" : ""})</h1>

            <div className="cart-layout">
              {/* LEFT SIDE: PRODUCTS */}
              <div className="cart-items-panel">
                {cart.map((item) => {
                  const itemPrice = Number(item.product.sell_price);
                  const imageSrc = item.product.image
                    ? item.product.image.startsWith("http")
                      ? item.product.image
                      : `${BASE_URL}${item.product.image}`
                    : null;

                  return (
                    <div key={item.product.id} className="cart-item-row">
                      <div className="cart-item-image-wrap">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="cart-item-image"
                            unoptimized
                          />
                        ) : (
                          <div style={{ fontSize: "12px", color: "#ccc" }}>No Image</div>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.product.name}</h3>
                        <p className="cart-item-category">{item.product.category?.name || "Gadget"}</p>
                        {cartErrors[item.product.id] && (
                          <div className="cart-item-error">
                            <AlertCircle size={12} />
                            <span>{cartErrors[item.product.id]}</span>
                          </div>
                        )}
                      </div>

                      {/* QTY CONTROL */}
                      <div className="quantity-control">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="quantity-control-btn"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="quantity-input"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="quantity-control-btn"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>

                      {/* PRICE calculation */}
                      <div className="cart-item-price-sec">
                        <span className="cart-item-price">৳{itemPrice * item.quantity}</span>
                        <div className="cart-item-each">৳{itemPrice} each</div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="cart-item-delete"
                        title="Remove product"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT SIDE: SUMMARY */}
              <div className="cart-summary-panel">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>৳{subtotal}</strong>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="shipping-note">Calculated at checkout</span>
                </div>

                <div className="summary-row total">
                  <span>Estimated Total</span>
                  <strong style={{ color: "var(--primary)" }}>৳{subtotal}</strong>
                </div>

                <Link
                  href="/checkout/cart"
                  className="cart-drawer-checkout-btn"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="cart-drawer-shop-btn"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
