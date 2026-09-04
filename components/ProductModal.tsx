"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/types/products";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, cartItems } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // 1. REGLA DE REACT: Los hooks van SIEMPRE antes de cualquier condicional de salida (return)
  const selectedVariant = product?.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const totalStock = selectedVariant?.stock ?? 0;

  // Calculamos cuánto hay ya de esta variante en el carrito para descontarlo del stock real
  const cartItemId = product && selectedVariant ? `${product.id}-${selectedVariant.id ?? "default"}` : "";
  const existingCartItem = cartItems.find((item) => item.id === cartItemId);
  const quantityInCart = existingCartItem ? existingCartItem.quantity : 0;

  // Stock real disponible para agregar (Stock físico total menos lo que ya está en el carrito)
  const currentStock = Math.max(0, totalStock - quantityInCart);

  useEffect(() => {
    if (quantity > currentStock && currentStock > 0) {
      setQuantity(currentStock);
    } else if (quantity < 1 && currentStock > 0) {
      setQuantity(1);
    }
  }, [currentStock, quantity]);

  useEffect(() => {
    if (product?.variants) {
      const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
      const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));

      setSelectedSize(sizes.length === 1 ? (sizes[0] ?? null) : null);
      setSelectedColor(colors.length === 1 ? (colors[0] ?? null) : null);
      setQuantity(1);
    }
  }, [product]);

  // 2. AHORA SÍ, el return condicional va después de todos los Hooks
  if (!product) return null;

  const displayPrice = product.basePrice ?? product.price ?? 0;

  const uniqueSizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean)));
  const uniqueColors = Array.from(new Set(product.variants?.map((v) => v.color).filter(Boolean)));

  const availableColorsForSelectedSize = selectedSize
    ? product.variants?.filter((v) => v.size === selectedSize && (v.stock ?? 0) > 0).map((v) => v.color)
    : uniqueColors;

  const availableSizesForSelectedColor = selectedColor
    ? product.variants?.filter((v) => v.color === selectedColor && (v.stock ?? 0) > 0).map((v) => v.size)
    : uniqueSizes;

  const variantForColor = product.variants?.find((v) => v.color === selectedColor);  
  const DEFAULT_IMAGE = "/logo-default.png";

  const rawImage = (variantForColor?.image && variantForColor.image.trim() !== "" && variantForColor.image !== "noImages")
    ? variantForColor.image 
    : (product.images?.[0] && product.images[0].trim() !== "" && product.images[0].trim() !== "noImages" ? product.images[0] : DEFAULT_IMAGE);

  const displayImage = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
  
  const isStockAvailable = selectedVariant && currentStock > 0;

  const handleAddToCartWithAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedVariant || !isStockAvailable) return;

    setIsAnimating(true);
    const buttonElement = e.currentTarget;
    const rect = buttonElement.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const flyingCircle = document.createElement("div");
      flyingCircle.className = "fixed z-50 h-5 w-5 rounded-full bg-covati-brown shadow-md transition-all duration-700 ease-in-out pointer-events-none";
      flyingCircle.style.left = `${rect.left + rect.width / 2}px`;
      flyingCircle.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(flyingCircle);

      const cartIcon = document.querySelector("#cart-icon-nav") || document.querySelector("header svg") || document.body;
      const cartRect = cartIcon.getBoundingClientRect();

      setTimeout(() => {
        flyingCircle.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingCircle.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingCircle.style.transform = "scale(0.3)";
        flyingCircle.style.opacity = "0.4";
      }, 15);

      setTimeout(() => {
        flyingCircle.remove();
        finishAddToCart();
      }, 700);

    } else {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 6; i++) {
        const spark = document.createElement("div");
        spark.className = "fixed z-60 h-4 w-4 rounded-full bg-covati-brown shadow-sm transition-all duration-800 ease-out pointer-events-none";
        spark.style.left = `${centerX}px`;
        spark.style.top = `${centerY}px`;
        document.body.appendChild(spark);

        const angle = (i * 60) * (Math.PI / 180);
        const distance = 70 + Math.random() * 30;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;

        setTimeout(() => {
          spark.style.left = `${targetX}px`;
          spark.style.top = `${targetY}px`;
          spark.style.transform = "scale(0)";
          spark.style.opacity = "0";
        }, 20);

        setTimeout(() => {
          spark.remove();
        }, 550);
      }

      setTimeout(() => {
        finishAddToCart();
      }, 580);
    }
  };

  const finishAddToCart = () => {
    setIsAnimating(false);
    if (selectedVariant) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedVariant);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scaleUp">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-covati-cream/80 p-2 text-covati-brown hover:bg-covati-sand shadow-sm transition-transform active:scale-95"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <div className="overflow-y-auto p-5 sm:p-6 max-h-[90vh] min-h-0 flex-1">
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 items-start">

            <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl bg-covati-cream/40 mb-4 md:mb-0">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={`${product.name} - ${selectedColor}`}
                  className="h-full w-full object-cover transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/logo-default.png";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-covati-taupe">
                  Sin imagen disponible
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between w-full">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-covati-taupe">
                  {product.category}
                </p>
                <h2 className="text-2xl font-medium text-covati-brown mt-1">
                  {product.name}
                </h2>
                <p className="text-lg font-semibold text-covati-brown mt-2">
                  ${(displayPrice * quantity).toLocaleString("es-AR")}
                </p>
                <p className="text-sm text-covati-taupe mt-3">
                  {product.description || "Sin descripción detallada."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Selector de Talles */}
                  {uniqueSizes.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-covati-brown mb-2">Talles:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {uniqueSizes.map((size) => {
                          const isAvailableForColor = availableSizesForSelectedColor?.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSelectedSize(size || null)}
                              className={`rounded-xl px-2.5 py-1.5 text-xs font-medium border transition-colors ${
                                selectedSize === size
                                  ? "bg-covati-brown text-white border-covati-brown"
                                  : isAvailableForColor === false
                                  ? "border-covati-sand/40 text-covati-taupe/40 bg-covati-cream/10 line-through cursor-not-allowed"
                                  : "border-covati-sand text-covati-brown hover:border-covati-brown"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selector de Cantidad limitado por stock real (incluyendo el carrito) */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-medium text-covati-brown">Cantidad:</p>
                      {selectedVariant && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-covati-cream text-covati-brown">
                          Disponibles: {currentStock} {quantityInCart > 0 && `(Ya tenés ${quantityInCart} en el carrito)`}
                        </span>
                      )}
                    </div>
                    <div className="inline-flex items-center rounded-xl border border-covati-sand bg-covati-cream/20 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={!selectedVariant || currentStock <= 0}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-covati-brown shadow-sm hover:bg-covati-sand transition-colors disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-covati-brown">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                        disabled={!selectedVariant || quantity >= currentStock}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-covati-brown shadow-sm hover:bg-covati-sand transition-colors disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selector de Colores */}
                {uniqueColors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-covati-brown mb-2">Colores:</p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueColors.map((color) => {
                        const isAvailableForSize = availableColorsForSelectedSize?.includes(color);
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color || null)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors ${
                              selectedColor === color
                                ? "bg-covati-brown text-white border-covati-brown"
                                : isAvailableForSize === false
                                ? "border-covati-sand/40 text-covati-taupe/40 bg-covati-cream/10 line-through cursor-not-allowed"
                                : "border-covati-sand text-covati-brown hover:border-covati-brown"
                            }`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {!selectedSize || !selectedColor ? (
                  <p className="text-xs text-amber-700 mb-2 text-center font-medium">
                    Por favor, selecciona un talle y un color.
                  </p>
                ) : !isStockAvailable ? (
                  <p className="text-xs text-red-600 mb-2 text-center font-medium">
                    {quantityInCart > 0 ? "Ya agregaste todo el stock disponible de esta variante al carrito." : "No hay stock disponible para esta combinación."}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleAddToCartWithAnimation}
                  disabled={!isStockAvailable || isAnimating}
                  className="relative overflow-hidden w-full rounded-full bg-covati-brown py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-covati-taupe active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-md"
                >
                  {isAnimating ? "¡Agregando..." : (isStockAvailable ? "Agregar al carrito" : "Sin stock disponible")}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}