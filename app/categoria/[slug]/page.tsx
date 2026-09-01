"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { products } from "@/data/products";
import type { Product } from "@/types/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Reconstruimos el nombre de la categoría a partir del slug de la URL
  const formattedCategoryName = slug
    ? decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase())
    : "";

  // Estado para el modal de detalles de la prenda
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtramos los productos que pertenecen a esta categoría o categoría secundaria
  const filteredProducts = products.filter((product) => {
    const matchesMain = product.category?.toLowerCase() === formattedCategoryName.toLowerCase();
    const matchesSecondary = product.secondaryCategories?.some(
      (cat) => cat.toLowerCase() === formattedCategoryName.toLowerCase()
    );
    return matchesMain || matchesSecondary;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 pt-8 w-full">
        {/* Botón para volver */}
        <Link
          href="/#productos"
          className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-covati-taupe hover:text-covati-brown transition-colors mb-6"
        >
          ← Volver a categorías
        </Link>

        {/* Encabezado de la Categoría */}
        <div className="mb-12 border-b border-covati-sand/40 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-covati-taupe mb-2">
            Colección Covati
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-covati-brown capitalize">
            {formattedCategoryName}
          </h1>
          <p className="text-sm text-covati-taupe mt-2">
            Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? "prenda disponible" : "prendas disponibles"}
          </p>
        </div>

        {/* Grilla de Productos filtrados */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-covati-taupe text-sm">
              Pronto habrá nuevas prendas disponibles en esta categoría.
            </p>
          </div>
        )}
      </main>

      {/* Modal de detalles y compra */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Footer />
    </div>
  );
}