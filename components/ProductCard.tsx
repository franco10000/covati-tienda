"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="group rounded-2xl border border-covati-sand/70 bg-white p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-covati-cream/40">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
        />
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.16em] text-covati-taupe">
            {product.category}
          </p>

          <h3 className="text-base font-medium text-covati-brown">
            {product.name}
          </h3>

          <p className="mt-1 text-sm font-medium text-covati-taupe">
            ${product.price.toLocaleString("es-AR")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`Agregar ${product.name} al carrito`}
          className="shrink-0 rounded-full bg-covati-brown px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-covati-taupe"
        >
          Agregar
        </button>
      </div>
    </article>
  );
}