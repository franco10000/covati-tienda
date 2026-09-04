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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const updateCartItem = (cartItemId: string, newVariant: ProductVariant, newQuantity: number) => {
    const product = cartItems.find((item) => item.id === cartItemId);
    if (!product) return;

    const maxStock = newVariant.stock ?? 0;
    const clampedQuantity = Math.min(Math.max(1, newQuantity), maxStock);
    const newUniqueId = `${product.id.split("-")[0]}-${newVariant.id ?? "default"}-${Date.now()}`;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              id: newUniqueId,
              variant: newVariant,
              quantity: clampedQuantity,
              image: newVariant.image || product.images?.[0] || "",
            }
          : item
      )
    );
  };

  const addToCart = (product: Product, variant: ProductVariant) => {
    const cartItemId = `${product.id}-${variant.id ?? "default"}`;
    const itemPrice = product.basePrice ?? product.price ?? 0;
    const maxStock = variant.stock ?? 0;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === cartItemId);

      if (existingItem) {
        // Evitamos que supere el stock máximo al sumar en el carrito
        const newQuantity = Math.min(existingItem.quantity + 1, maxStock);
        return currentItems.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item,
        );
      }

      if (maxStock <= 0) return currentItems;

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
      currentItems.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.variant.stock ?? 999;
          // Limitamos para que el botón '+' del carrito nunca supere el stock disponible
          const clampedQuantity = Math.min(quantity, maxStock);
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      }),
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