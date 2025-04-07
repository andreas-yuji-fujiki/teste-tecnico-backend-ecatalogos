import { Product, Variant, Sku, Brand, Category, Subcategory, ProductGender, ProductType } from '@prisma/client';

export type ProductWithVariantsTypes = {
  id: number;
  name: string;
  reference: string;
  gender: string;
  category: string | null;
  subcategory: string | null;
  prompt_delivery: boolean;
  description: string | null;
  type: string | null;
  variants: {
    variant_name: string;
    hex_code: string | null;
    skus: {
      id: number;
      size: string;
      price: number;
      stock: number;
      open_grid: boolean;
      min_quantity: number;
    }[];
  }[];
  companies: {
    key: number;
  };
  brand: string;
};

  