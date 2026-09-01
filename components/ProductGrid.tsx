"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal"; // <--- 1. Importamos el modal
import { products } from "@/data/products";
import type { ProductCategory, Product } from "@/types/products"; // <--- Añadimos Product

const categories: { label: string; value: ProductCategory | "all" }[] = [
  { label: "Todas", value: "all" },
  { label: "Buzos y sweaters", value: "Buzos y sweaters" },
  { label: "Remeras y chombas", value: "Remeras y chombas" },
  { label: "Shorts y bermudas", value: "Shorts y bermudas" },
  { label: "Pantalones", value: "Pantalones" },
  { label: "Línea de lino y urbana", value: "Línea de lino y urbana" },
  { label: "Accesorios", value: "Accesorios" },
  { label: "Conjuntos", value: "Conjuntos" },
];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ProductCategory
  >("all");

  // Estado para saber qué producto se abrió en el modal de detalles
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true;
    if (product.category === selectedCategory) return true;
    if (product.secondaryCategories?.includes(selectedCategory)) return true;
    return false;
  });

  return (
    <section id="productos" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-covati-taupe">
            Colección
          </p>

          <h2 className="mt-2 text-3xl font-medium tracking-tight text-covati-brown sm:text-4xl">
            Elegidos para vos
          </h2>
        </div>

        <div
          className="flex max-w-full gap-2 overflow-x-auto pb-1"
          aria-label="Filtrar por categoría"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-covati-sand text-covati-brown"
                    : "bg-covati-cream/60 text-covati-brown hover:bg-covati-cream"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onSelect={(p) => setSelectedProduct(p)} // <--- Le pasamos la función para abrir el modal
          />
        ))}
      </div>

      {/* Modal de detalles de la prenda */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}