"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  generateWhatsAppLink,
  type CustomerData,
} from "@/lib/whatsapp";

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-AR")}`;

const initialCustomerData: CustomerData = {
  name: "",
  delivery: "",
  paymentMethod: "Transferencia (10% OFF)",
  notes: "",
};

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    closeCart,
  } = useCart();

  const [customerData, setCustomerData] =
    useState<CustomerData>(initialCustomerData);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) return;

    const whatsappLink = generateWhatsAppLink(cartItems, customerData);

    window.open(whatsappLink, "_blank", "noopener,noreferrer");
    clearCart();
    closeCart();
    setCustomerData(initialCustomerData);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className={`absolute inset-0 bg-stone-950/30 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
              Tu selección
            </p>
            <h2 className="mt-1 text-xl font-medium text-stone-950">
              Carrito
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-stone-100 p-4 text-stone-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path d="M3 3h2l2.2 11.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L20 7H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>

            <h3 className="mt-5 text-lg font-medium text-stone-950">
              Tu carrito está vacío
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Descubrí nuestra colección y agregá tus favoritos.
            </p>

            <button
              type="button"
              onClick={closeCart}
              className="mt-6 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
            >
              Seguir navegando
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-5">
                {cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-4 border-b border-stone-100 pb-5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-16 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-stone-950">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm text-stone-600">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-stone-500 underline underline-offset-4 transition-colors hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-stone-200">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label={`Restar una unidad de ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center text-stone-700 hover:bg-stone-100"
                          >
                            −
                          </button>

                          <span className="w-7 text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label={`Sumar una unidad de ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center text-stone-700 hover:bg-stone-100"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-medium text-stone-950">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-7 border-t border-stone-200 pt-5">
                <div className="flex items-center justify-between text-lg font-medium text-stone-950">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-base font-medium text-stone-950">
                  Datos para tu pedido
                </h3>

                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm text-stone-700">
                      Nombre completo
                    </span>
                    <input
                      required
                      value={customerData.name}
                      onChange={(event) =>
                        setCustomerData((data) => ({
                          ...data,
                          name: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none transition focus:border-stone-950"
                      placeholder="Tu nombre"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm text-stone-700">
                      Entrega / Dirección o retiro
                    </span>
                    <input
                      required
                      value={customerData.delivery}
                      onChange={(event) =>
                        setCustomerData((data) => ({
                          ...data,
                          delivery: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none transition focus:border-stone-950"
                      placeholder="Dirección o 'Retiro en tienda'"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm text-stone-700">
                      Método de pago preferido
                    </span>
                    <select
                      value={customerData.paymentMethod}
                      onChange={(event) =>
                        setCustomerData((data) => ({
                          ...data,
                          paymentMethod: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-stone-950"
                    >
                      <option>Transferencia (10% OFF)</option>
                      <option>Efectivo</option>
                      <option>Mercado Pago</option>
                      <option>Otro / Consultar</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm text-stone-700">
                      Notas adicionales
                    </span>
                    <textarea
                      value={customerData.notes}
                      onChange={(event) =>
                        setCustomerData((data) => ({
                          ...data,
                          notes: event.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none transition focus:border-stone-950"
                      placeholder="Ej.: horario de entrega preferido"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 bg-white px-5 py-5 sm:px-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <span aria-hidden="true">◔</span>
                Enviar pedido por WhatsApp
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}