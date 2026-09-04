export type ProductCategory =
  | "Buzos y sweaters"
  | "Remeras y chombas"
  | "Shorts y bermudas"
  | "Pantalones"
  | "Línea de lino y urbana"
  | "Accesorios"
  | "Conjuntos";

export type AccessorySubcategory =
  | "Gorras"
  | "Cinturones"
  | "Medias"
  | "Ropa Interior"
  | "Carteras y Bolsos";

export interface ProductVariant {
  id?: string;
  color?: string;
  size?: string;
  stock?: number;
  image?: string;
  backImage?: string; // NUEVO: Imagen opcional de la espalda/dorso para esta variante
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  basePrice?: number;
  description?: string;
  images?: string[];
  category: ProductCategory;
  secondaryCategories?: ProductCategory[];
  accessorySubcategory?: AccessorySubcategory;
  variants?: ProductVariant[];
  colors?: string[];
  isLinenOrUrban?: boolean;
  [key: string]: any;
}