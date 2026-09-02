"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import type { ProductCategory, Product } from "@/types/products";

// Lista de categorías de tu tienda
const categoriesList: { label: string; value: ProductCategory }[] = [
  { label: "Buzos y sweaters", value: "Buzos y sweaters" },
  { label: "Remeras y chombas", value: "Remeras y chombas" },
  { label: "Shorts y bermudas", value: "Shorts y bermudas" },
  { label: "Pantalones", value: "Pantalones" },
  { label: "Línea de lino y urbana", value: "Línea de lino y urbana" },
  { label: "Accesorios", value: "Accesorios" },
  { label: "Conjuntos", value: "Conjuntos" },
];

// Componente para cada Tarjeta de Categoría con carrusel automático
function CategoryCard({
  categoryLabel,
  categoryValue,
  allProducts,
}: {
  categoryLabel: string;
  categoryValue: ProductCategory;
  allProducts: Product[];
}) {
  // 1. Buscamos todas las prendas que pertenecen a esta categoría
  const categoryProducts = allProducts.filter(
    (p) => p.category === categoryValue || p.secondaryCategories?.includes(categoryValue)
  );

  // 2. Extraemos y limpiamos las imágenes disponibles de esas prendas
  const rawImages = categoryProducts.flatMap((p) => {
    const variantImages = p.variants?.map((v) => v.image).filter(Boolean) as string[];
    if (variantImages && variantImages.length > 0) return variantImages;
    return p.images && p.images.length > 0 ? p.images : [];
  });

  // Normalizamos las rutas para asegurarnos de que comiencen con "/" y filtramos vacías o "noImages"
  const images = rawImages
    .filter((img) => img && img.trim() !== "" && img !== "noImages")
    .map((img) => (img.startsWith("/") ? img : `/${img}`));

  // Si no hay imágenes válidas, usamos la por defecto
  const displayImages = images.length > 0 ? Array.from(new Set(images)) : ["/logo-default.png"];

  // 3. Estado para la transición de imágenes cada 5 segundos
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 5000); // 5000 ms = 5 segundos

    return () => clearInterval(interval);
  }, [displayImages.length]);

  // Generamos una URL limpia para la categoría (ej: /categoria/buzos-y-sweaters)
  const categorySlug = encodeURIComponent(
    categoryValue.toLowerCase().replace(/\s+/g, "-")
  );

  return (
    <Link
      href={`/categoria/${categorySlug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Marco de la imagen en formato 3/4 igual que las tarjetas de productos */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-covati-cream/40">
        {displayImages.map((imgSrc, idx) => (
          <img
            key={`${imgSrc}-${idx}`}
            src={imgSrc}
            alt={categoryLabel}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out group-hover:scale-105 ${
              idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-100"
            }`}
            onError={(e) => {
              e.currentTarget.src = "/logo-default.png";
            }}
          />
        ))}

        {/* Capa decorativa sutil al pasar el cursor */}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Nombre de la categoría abajo de la tarjeta */}
      <div className="p-5 text-center bg-white">
        <h3 className="text-lg font-medium text-covati-brown transition-colors group-hover:text-covati-taupe">
          {categoryLabel}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-covati-taupe font-medium">
          Ver prendas →
        </p>
      </div>
    </Link>
  );
}

export default function ProductGrid() {
  return (
    <section id="productos" className="scroll-mt-24 py-16 sm:py-24">
      {/* Encabezado original de la sección */}
      <div className="mb-10 flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-covati-taupe">
          Colección
        </p>
        <h2 className="text-3xl font-medium tracking-tight text-covati-brown sm:text-4xl">
          Elegidos para vos
        </h2>
      </div>

      {/* Grilla de Categorías (misma cantidad de columnas que los productos) */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoriesList.map((cat) => (
          <CategoryCard
            key={cat.value}
            categoryLabel={cat.label}
            categoryValue={cat.value}
            allProducts={products}
          />
        ))}
      </div>
    </section>
  );
}