export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Buzo Rustico",
    price: 38500,
    category: "Indumentaria",
    description: "Rústico peinado premium - Estampa de alta calidad - Calce oversize",
    image:"buzo.JPG",
  },
  {
    id: 2,
    name: "Bolso Minimal",
    price: 38900,
    category: "Accesorios",
    description: "Bolso versátil de diseño limpio para acompañarte todos los días.",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Vela Ámbar",
    price: 12900,
    category: "Hogar",
    description: "Vela aromática para crear una atmósfera cálida y relajante.",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Set de Cerámica",
    price: 28500,
    category: "Hogar",
    description: "Set de piezas de cerámica de líneas suaves y acabados artesanales.",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Serum Facial",
    price: 19700,
    category: "Belleza",
    description: "Serum de textura ligera para una rutina de cuidado simple y efectiva.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Zapatillas Urbanas",
    price: 64900,
    category: "Indumentaria",
    description: "Zapatillas cómodas de estética urbana y minimalista.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
];