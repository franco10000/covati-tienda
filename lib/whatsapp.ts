import type { CartItem } from "@/context/CartContext";

export type CustomerData = {
  name: string;
  delivery: string;
  paymentMethod: string;
  notes?: string;
};

export const PHONE_NUMBER = "5492284539404";

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-AR")}`;

export function generateWhatsAppLink(
  cartItems: CartItem[],
  customerData: CustomerData,
) {
  const orderDetails = cartItems
    .map((item) => {
      const subtotal = item.price * item.quantity;

      return `• ${item.quantity}x ${item.name} (${formatPrice(
        item.price,
      )} c/u) - ${formatPrice(subtotal)}`;
    })
    .join("\n");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const message = `🛍️ *NUEVO PEDIDO - COVATI*

👤 *Cliente:* ${customerData.name}
📍 *Entrega/Retiro:* ${customerData.delivery}
💳 *Pago:* ${customerData.paymentMethod}
📝 *Notas:* ${customerData.notes?.trim() || "Sin notas"}
-------------------

📦 *DETALLE DEL PEDIDO:*
${orderDetails}
---------------------------------------

💰 *TOTAL:* ${formatPrice(total)}`;

  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}