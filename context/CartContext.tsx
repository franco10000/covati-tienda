"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setCartItems([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider.");
  }

  return context;
}