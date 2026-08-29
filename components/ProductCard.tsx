"use client";

import { useCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/types/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const availableVariant = product.variants?.find((variant: ProductVariant) => (variant.stock ?? 0) > 0);
  const image = product.images?.[0];
  const displayPrice = product.basePrice ?? product.price ?? 0;

  return (
    <article className="group rounded-2xl border border-covati-sand/70 bg-white p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-covati-cream/40">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-covati-taupe">
            Imagen próximamente
          </div>
        )}
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
            ${displayPrice.toLocaleString("es-AR")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => availableVariant && addToCart(product, availableVariant)}
          aria-label={`Agregar ${product.name} al carrito`}
          disabled={!availableVariant}
          className="shrink-0 rounded-full bg-covati-brown px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-covati-taupe disabled:cursor-not-allowed disabled:opacity-50"
        >
          {availableVariant ? "Agregar" : "Sin stock"}
        </button>
      </div>
    </article>
  );
}