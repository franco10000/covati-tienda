"use client";

import { useCart } from "@/context/CartContext";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/#productos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Header() {
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-covati-sand/70 bg-covati-bg/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="/"
          className="text-xl font-semibold tracking-[0.28em] text-covati-brown sm:text-2xl"
        >
          <img 
            src="/logo.png" 
            alt="Covati" 
            className="h-8 sm:h-10 w-auto object-contain" 
          />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-covati-taupe transition-colors hover:text-covati-brown"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          id="cart-icon-nav"
          type="button"
          onClick={openCart}
          aria-label="Abrir carrito"
          className="relative rounded-full p-2 text-covati-brown transition-colors hover:bg-covati-cream"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M3 3h2l2.2 11.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L20 7H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>

          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-covati-brown px-1 text-xs font-semibold text-white">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <nav className="flex gap-5 overflow-x-auto border-t border-covati-sand/50 px-5 py-3 md:hidden">
        {navigation.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="shrink-0 text-sm text-stone-600"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}