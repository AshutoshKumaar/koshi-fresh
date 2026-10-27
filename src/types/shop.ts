export interface ProductVariant {
  id: string;
  weight: string; // e.g. "100g", "250g", "500g"
  /** Net product weight from the packaged variant, in grams. Packaging allowance is added server-side later. */
  weightGrams: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export const MAKHANA_BRANDS = ["Koshi Fresh", "Madhur Phool Makhana", "Krishna Phool Makhana"] as const;

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  /** Customer-facing product brand; the seller/manufacturer can own several brands. */
  brand: string;
  seller: 'Renuka Enterprises';
  category: 'makhana' | 'flour' | 'chocolate' | 'dry-fruits' | 'nuts' | 'seeds' | 'snacks' | 'superfoods' | 'spices' | 'gifts';
  description: string;
  nutritionalInfo: {
    calories: string;
    protein: string;
    fat: string;
    fiber: string;
  };
  sourcing: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  variants: ProductVariant[];
  badges: string[];
}
