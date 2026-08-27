export type ProductCategory =
  | "buzos-sweaters"
  | "remeras"
  | "pantalones"
  | "accesorios";

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  basePrice: number;
  description: string;
  images: string[];
  variants: ProductVariant[];
  isFeatured?: boolean;
}