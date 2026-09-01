"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  generateWhatsAppLink,
  type CustomerData,
} from "@/lib/whatsapp";
import type { ProductVariant } from "@/types/products";

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
    updateCartItem,
  } = useCart();

  const [customerData, setCustomerData] = useState<CustomerData>(initialCustomerData);
  
  // Estado para controlar qué ítem se está editando actualmente
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editSize, setEditSize] = useState<string>("");
  const [editColor, setEditColor] = useState<string>("");
  const [editQty, setEditQty] = useState<number>(1);

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setEditSize(item.variant.size);
    setEditColor(item.variant.color);
    setEditQty(item.quantity);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    // Buscamos la variante correspondiente al nuevo talle y color elegidos
    const matchedVariant = editingItem.variants?.find(
      (v: ProductVariant) => v.size === editSize && v.color === editColor
    ) || editingItem.variant;

    updateCartItem(editingItem.id, matchedVariant, editQty);
    setEditingItem(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cartItems.length === 0) return;

    const whatsappLink = generateWhatsAppLink(cartItems, customerData);
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
    clearCart();
    closeCart();
    setCustomerData(initialCustomerData);
  };

  // Extraer talles y colores únicos del producto en edición
  const uniqueSizes = editingItem ? Array.from(new Set(editingItem.variants?.map((v: ProductVariant) => v.size).filter(Boolean))) : [];
  const uniqueColors = editingItem ? Array.from(new Set(editingItem.variants?.map((v: ProductVariant) => v.color).filter(Boolean))) : [];

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
        <div className="flex items-center justify-between border-b border-covati-sand/70 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
              Tu selección
            </p>
            <h2 className="mt-1 text-xl font-medium text-covati-brown">
              Carrito ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="rounded-full bg-covati-brown p-2.5 text-white transition-colors hover:bg-covati-taupe"
          >
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <h3 className="mt-5 text-lg font-medium text-covati-brown">
              Tu carrito está vacío
            </h3>
            <button
              type="button"
              onClick={closeCart}
              className="mt-4 rounded-full bg-covati-brown px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-covati-taupe"
            >
              Seguir navegando
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-5">
                {cartItems.map((item) => {
                  const itemImage = item.image && item.image.trim() !== "" ? item.image : "/logo-default.PNG";

                  return (
                    <article
                      key={item.id}
                      className="flex gap-4 border-b border-covati-sand/40 pb-5 items-center"
                    >
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="h-20 w-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/logo-default.PNG";
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-covati-brown">
                              {item.name}
                            </p>
                            <p className="text-xs text-covati-taupe mt-0.5">
                              Talle: {item.variant.size} | Color: {item.variant.color}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-covati-brown">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          {/* Botones de Editar (Lápiz) y Eliminar (Basura) */}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              aria-label="Editar producto"
                              className="text-covati-taupe hover:text-covati-brown transition-colors"
                            >
                              {/* Ícono de Lápiz */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Eliminar producto"
                              className="text-stone-400 hover:text-red-600 transition-colors"
                            >
                              {/* Ícono de Basura */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Control de cantidad directo */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-covati-sand/70">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-covati-taupe hover:bg-covati-cream/50"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-covati-taupe hover:bg-covati-cream/50"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs text-covati-taupe">Cant: {item.quantity} un.</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Total y Formulario de Cliente (igual que antes) */}
              <div className="mt-7 rounded-xl bg-covati-cream/50 p-4">
                <div className="flex items-center justify-between text-lg font-medium text-covati-brown">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* CAMPOS DE DATOS DE CLIENTE */}
              <div className="mt-8 space-y-4">
                <h3 className="text-base font-medium text-covati-brown">Datos para tu pedido</h3>
                <input
                  required
                  placeholder="Nombre completo"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-covati-brown"
                />
                <input
                  required
                  placeholder="Dirección o retiro en tienda"
                  value={customerData.delivery}
                  onChange={(e) => setCustomerData({ ...customerData, delivery: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-covati-brown"
                />
                <select
                  value={customerData.paymentMethod}
                  onChange={(e) => setCustomerData({ ...customerData, paymentMethod: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-covati-brown"
                >
                  <option>Transferencia (10% OFF)</option>
                  <option>Efectivo</option>
                  <option>Mercado Pago</option>
                </select>
              </div>
            </div>

            <div className="border-t border-covati-sand/70 bg-white px-5 py-5">
              <button
                type="submit"
                className="w-full rounded-full bg-covati-brown py-3 text-sm font-medium text-white transition-colors hover:bg-covati-taupe"
              >
                Enviar pedido por WhatsApp
              </button>
            </div>
          </form>
        )}
      </aside>

      {/* --- MODAL DE EDICIÓN FLOTANTE --- */}
      {editingItem && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-covati-brown">Editar producto</h3>
              <button 
                type="button" 
                onClick={() => setEditingItem(null)} 
                className="text-stone-500 hover:text-covati-brown transition-colors"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Imagen de la variante seleccionada actualmente en el modal */}
              <div className="flex justify-center mb-2">
                <img
                  src={
                    editingItem.variants?.find((v: ProductVariant) => v.color === editColor)?.image || 
                    editingItem.image || 
                    "/logo-default.PNG"
                  }
                  alt={editingItem.name}
                  className="h-52 w-39 rounded-xl object-cover shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = "/logo-default.PNG";
                  }}
                />
              </div>

              <p className="text-base font-medium text-covati-brown">{editingItem.name}</p>

              {/* Selector de Color */}
              {uniqueColors.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-covati-taupe mb-1.5">Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map((col: any) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setEditColor(col)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all border ${
                          editColor === col
                            ? "bg-covati-brown text-white border-covati-brown shadow-sm"
                            : "border-stone-300 text-covati-brown hover:border-covati-taupe"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de Talle */}
              {uniqueSizes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-covati-taupe mb-1.5">Talle:</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((sz: any) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setEditSize(sz)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all border ${
                          editSize === sz
                            ? "bg-covati-brown text-white border-covati-brown shadow-sm"
                            : "border-stone-300 text-covati-brown hover:border-covati-taupe"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de Cantidad */}
              <div>
                <p className="text-xs font-medium text-covati-taupe mb-1.5">Cantidad:</p>
                <div className="flex items-center w-32 rounded-full border border-stone-300 px-2 py-1">
                  <button 
                    type="button" 
                    onClick={() => setEditQty(Math.max(1, editQty - 1))} 
                    className="w-8 py-1 text-center text-covati-tauvpe hover:text-covati-brown"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-medium text-covati-brown">{editQty}</span>
                  <button 
                    type="button" 
                    onClick={() => setEditQty(editQty + 1)} 
                    className="w-8 py-1 text-center text-covati-tauvpe hover:text-covati-brown"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="w-full mt-6 rounded-full bg-covati-brown py-3 text-sm font-medium text-white transition-colors hover:bg-covati-taupe shadow-md"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}