"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/types/products";

export type CartItem = Product & {
  quantity: number;
  variant: ProductVariant;
  price: number;
  image?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  totalPrice: number;
  updateCartItem: (cartItemId: string, newVariant: ProductVariant, newQuantity: number) => void;
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const updateCartItem = (cartItemId: string, newVariant: ProductVariant, newQuantity: number) => {
    const product = cartItems.find((item) => item.id === cartItemId);
    if (!product) return;

    // Generamos un ID único basado en el tiempo o en la variante para que no se pisquen ni se sumen por fuerza bruta
    const newUniqueId = `${product.id.split("-")[0]}-${newVariant.id ?? "default"}-${Date.now()}`;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              id: newUniqueId,
              variant: newVariant,
              quantity: newQuantity,
              image: newVariant.image || product.images?.[0] || "",
            }
          : item
      )
    );
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, variant: ProductVariant) => {
    const cartItemId = `${product.id}-${variant.id ?? "default"}`;
    const itemPrice = product.basePrice ?? product.price ?? 0;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === cartItemId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          id: cartItemId,
          variant,
          quantity: 1,
          price: itemPrice,
          image: variant.image || product.images?.[0] || "",
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== cartItemId),
    );
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
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
        updateCartItem,
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
