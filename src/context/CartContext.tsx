"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/backend_type";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  cartCount: number;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage when it changes (only after initializing)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity = 1): { success: boolean; message?: string } => {
    if (product.stock !== undefined && product.stock !== null && product.stock <= 0) {
      return { success: false, message: "Stock Out" };
    }

    const maxAllowed = Math.max(1, Math.floor((product.stock || 0) * 0.7));
    const existingItem = cart.find((item) => item.product.id === product.id);
    const existingQty = existingItem ? existingItem.quantity : 0;
    const newQty = existingQty + quantity;

    if (newQty > maxAllowed) {
      return {
        success: false,
        message: `Limit exceeded. You cannot order more than 70% of available stock (Limit: ${maxAllowed} items)`
      };
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });

    setCartDrawerOpen(true);
    return { success: true };
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const item = cart.find((i) => i.product.id === productId);
    if (item && item.product.stock !== undefined && item.product.stock !== null) {
      const maxAllowed = Math.max(1, Math.floor(item.product.stock * 0.7));
      if (quantity > maxAllowed) {
        return {
          success: false,
          message: `Limit exceeded. You cannot order more than 70% of available stock (Limit: ${maxAllowed} items)`
        };
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    return { success: true };
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isCartDrawerOpen,
        setCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
