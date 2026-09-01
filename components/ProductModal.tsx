"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/types/products";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (product?.variants) {
      const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
      const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));

      setSelectedSize(sizes.length === 1 ? (sizes[0] ?? null) : null);
      setSelectedColor(colors.length === 1 ? (colors[0] ?? null) : null);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const displayPrice = product.basePrice ?? product.price ?? 0;

  const uniqueSizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean)));
  const uniqueColors = Array.from(new Set(product.variants?.map((v) => v.color).filter(Boolean)));

  const variantForColor = product.variants?.find((v) => v.color === selectedColor);  
  const DEFAULT_IMAGE = "/logo-default.png";

  // Obtenemos la imagen de la variante o del producto, evitando "noImages"
  const rawImage = (variantForColor?.image && variantForColor.image.trim() !== "" && variantForColor.image !== "noImages")
    ? variantForColor.image 
    : (product.images?.[0] && product.images[0].trim() !== "" && product.images[0] !== "noImages" ? product.images[0] : DEFAULT_IMAGE);

  // Forzamos una ruta absoluta que comience con "/" para prevenir errores en subcarpetas
  const displayImage = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
  
  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const isStockAvailable = selectedVariant && (selectedVariant.stock ?? 0) > 0;

  // Manejador de animaciones diferenciadas
  const handleAddToCartWithAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedVariant || !isStockAvailable) return;

    setIsAnimating(true);
    const buttonElement = e.currentTarget;
    const rect = buttonElement.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // MÓVIL: Círculo que viaja hacia el carrito de compras superior
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
      // COMPUTADORA: Efecto "Splash" de destellos/chispitas flotantes hacia afuera
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Creamos 6 destellos que salen disparados en diferentes direcciones
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement("div");
        spark.className = "fixed z-60 h-4 w-4 rounded-full bg-covati-brown shadow-sm transition-all duration-800 ease-out pointer-events-none";
        spark.style.left = `${centerX}px`;
        spark.style.top = `${centerY}px`;
        document.body.appendChild(spark);

        // Ángulos y distancias aleatorias para simular la explosión del splash
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

        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-covati-cream/80 p-2 text-covati-brown hover:bg-covati-sand shadow-sm transition-transform active:scale-95"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Contenedor principal con scroll interno */}
        <div className="overflow-y-auto p-5 sm:p-6 max-h-[90vh] min-h-0 flex-1">
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 items-start">

            {/* Imagen de la prenda */}
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

            {/* Detalles e información */}
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

                {/* Grid para Talles y Cantidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Selector de Talles */}
                  {uniqueSizes.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-covati-brown mb-2">Talles:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {uniqueSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size || null)}
                            className={`rounded-xl px-2.5 py-1.5 text-xs font-medium border transition-colors ${
                              selectedSize === size
                                ? "bg-covati-brown text-white border-covati-brown"
                                : "border-covati-sand text-covati-brown hover:border-covati-brown"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selector de Cantidad */}
                  <div>
                    <p className="text-xs font-medium text-covati-brown mb-2">Cantidad:</p>
                    <div className="inline-flex items-center rounded-xl border border-covati-sand bg-covati-cream/20 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-covati-brown shadow-sm hover:bg-covati-sand transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-covati-brown">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-covati-brown shadow-sm hover:bg-covati-sand transition-colors"
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
                      {uniqueColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color || null)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors ${
                            selectedColor === color
                              ? "bg-covati-brown text-white border-covati-brown"
                              : "border-covati-sand text-covati-brown hover:border-covati-brown"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de compra y validaciones */}
              <div className="mt-6">
                {!selectedSize || !selectedColor ? (
                  <p className="text-xs text-amber-700 mb-2 text-center font-medium">
                    Por favor, selecciona un talle y un color.
                  </p>
                ) : !isStockAvailable ? (
                  <p className="text-xs text-red-600 mb-2 text-center font-medium">
                    No hay stock disponible para esta combinación.
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleAddToCartWithAnimation}
                  disabled={!isStockAvailable || isAnimating}
                  className="relative overflow-hidden w-full rounded-full bg-covati-brown py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-covati-taupe active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-md"
                >
                  {isAnimating ? "¡Agregando..." : (isStockAvailable ? "Agregar al carrito" : "Seleccioná talle y color")}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}