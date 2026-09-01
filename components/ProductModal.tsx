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

  // Cada vez que cambia el producto, reseteamos o autoseleccionamos si hay una sola opción
  useEffect(() => {
    if (product?.variants) {
      const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
      const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));

      // Si hay una única opción de talle, la marcamos por defecto
      setSelectedSize(sizes.length === 1 ? (sizes[0] ?? null) : null);
      // Si hay una única opción de color, la marcamos por defecto
      setSelectedColor(colors.length === 1 ? (colors[0] ?? null) : null);
    }
  }, [product]);

  if (!product) return null;

  const displayPrice = product.basePrice ?? product.price ?? 0;

  const uniqueSizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean)));
  const uniqueColors = Array.from(new Set(product.variants?.map((v) => v.color).filter(Boolean)));

  // 1. Buscamos la variante que coincida con el color seleccionado para mostrar su foto específica
  const variantForColor = product.variants?.find((v) => v.color === selectedColor);  
  const DEFAULT_IMAGE = "/logo-default.png";
  const displayImage = variantForColor?.image && variantForColor.image.trim() !== "" 
      ? variantForColor.image 
      : (product.images?.[0] && product.images[0].trim() !== "" ? product.images[0] : DEFAULT_IMAGE);
  
  // Buscar la variante exacta que coincida con el talle y color elegidos para el carrito
  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const isStockAvailable = selectedVariant && (selectedVariant.stock ?? 0) > 0;

  const handleAddToCart = () => {
    if (selectedVariant && isStockAvailable) {
      addToCart(product, selectedVariant);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden">
        
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-covati-cream/60 p-2 text-covati-brown hover:bg-covati-sand"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <div className="grid gap-6 md:grid-cols-2 p-6 overflow-y-auto max-h-[90vh]">
          {/* Imagen de la prenda (Dinámica según el color seleccionado) */}
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-covati-cream/40">
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
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-covati-taupe">
                {product.category}
              </p>
              <h2 className="text-2xl font-medium text-covati-brown mt-1">
                {product.name}
              </h2>
              <p className="text-lg font-semibold text-covati-brown mt-2">
                ${displayPrice.toLocaleString("es-AR")}
              </p>
              <p className="text-sm text-covati-taupe mt-3">
                {product.description || "Sin descripción detallada."}
              </p>

              {/* Selector de Talles */}
              {uniqueSizes.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-covati-brown mb-2">Talles:</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size || null)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors ${
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
                onClick={handleAddToCart}
                disabled={!isStockAvailable}
                className="w-full rounded-full bg-covati-brown py-3 text-sm font-medium text-white transition-colors hover:bg-covati-taupe disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStockAvailable ? "Agregar al carrito" : "Seleccioná talle y color"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}