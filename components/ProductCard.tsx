"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
        />
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.16em] text-stone-500">
            {product.category}
          </p>
          <h3 className="text-base font-medium text-stone-950">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            ${product.price.toLocaleString("es-AR")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`Agregar ${product.name} al carrito`}
          className="shrink-0 rounded-full border border-stone-300 px-3 py-2 text-xs font-medium text-stone-800 transition-colors hover:border-stone-950 hover:bg-stone-950 hover:text-white"
        >
          Agregar
        </button>
      </div>
    </article>
  );
}