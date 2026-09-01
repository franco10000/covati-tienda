"use client";

import { useState } from "react";
import type { Product } from "@/types/products";

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
};

// Función auxiliar para convertir el texto del color en un color visual de CSS
const getColorCode = (colorName: string) => {
  const name = colorName.toLowerCase().trim();
  if (name.includes("negro")) return "#111111";
  if (name.includes("blanco")) return "#FFFFFF";
  if (name.includes("crema") || name.includes("beige")  || name.includes("hueso")) return "#F5F0EB";
  if (name.includes("gris")) return "#9CA3AF";
  if (name.includes("azul") || name.includes("marino")) return "#1E3A8A";
  if (name.includes("verde") || name.includes("olivo")) return "#3F6212";
  if (name.includes("rojo")) return "#DC2626";
  if (name.includes("marron") || name.includes("chocolate")) return "#78350F";
  if (name.includes("celeste")) return "#BAE6FD";
  return "#D1D5DB"; // Color por defecto si no lo reconoce
};

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  // Extraemos los colores únicos de las variantes
  const availableColors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  ) as string[];

  // Estado para controlar qué color está seleccionado en la tarjeta (por defecto el primero)
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "");

  // Buscamos si hay una imagen específica para esta variante de color
  // (Si en tus variantes guardas imagen por color, la toma; si no, usa la principal del producto)
  const currentVariant = product.variants?.find((v) => v.color === selectedColor);

  // Si la variante no tiene imagen, busca la principal del producto, 
  // y si tampoco hay, muestra el logo o imagen por defecto de Cobatti
  const DEFAULT_IMAGE = "logo-default.png"; // <--- Ajusta esta ruta según la ubicación de tu logo
  const displayImage = currentVariant?.image && currentVariant.image.trim() !== ""
    ? currentVariant.image
    : (product.images?.[0] && product.images[0].trim() !== "" ? product.images[0] : DEFAULT_IMAGE);

  const displayPrice = product.basePrice ?? product.price ?? 0;

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el círculo de color
    setSelectedColor(color);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group cursor-pointer rounded-2xl border border-covati-sand/70 bg-white p-3 transition-all hover:shadow-md"
    >
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-covati-cream/40">
        {displayImage ? (
          <img
            src={displayImage}
            alt={`${product.name} - ${selectedColor}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Si la imagen falla al cargar (porque el archivo no existe), pone el logo por defecto
              e.currentTarget.src = "/logo-default.png"; // O la ruta exacta de tu logo
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-covati-taupe">
            Sin imagen
          </div>
        )}
      </div>

      {/* Información del Producto y Selector de Colores */}
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-covati-taupe">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-covati-brown mt-0.5 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-covati-brown mt-1">
            ${displayPrice.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Círculos de Colores Disponibles */}
        {availableColors.length > 0 && (
          <div className="flex flex-col items-end gap-1.5 pt-1">
            <div className="flex items-center gap-1.5">
              {availableColors.map((color) => {
                const isSelected = selectedColor === color;
                const hexColor = getColorCode(color);
                const isWhiteOrLight = hexColor === "#FFFFFF" || hexColor === "#F5F0EB";

                return (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={(e) => handleColorClick(e, color)}
                    style={{ backgroundColor: hexColor }}
                    className={`h-4 w-4 rounded-full transition-transform ${
                      isWhiteOrLight ? "border border-covati-sand" : ""
                    } ${
                      isSelected 
                        ? "scale-125 ring-2 ring-covati-brown ring-offset-1" 
                        : "hover:scale-110 opacity-80 hover:opacity-100"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}