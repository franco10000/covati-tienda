"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const categories = [
  "Todos",
  "Indumentaria",
  "Accesorios",
  "Hogar",
  "Belleza",
];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <section id="productos" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
            Colección
          </p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-stone-950 sm:text-4xl">
            Elegidos para vos
          </h2>
        </div>

        <div
          className="flex max-w-full gap-2 overflow-x-auto pb-1"
          aria-label="Filtrar por categoría"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-stone-950 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}