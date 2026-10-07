export interface ProductVariant {
  id: string;
  weight: string; // e.g. "100g", "250g", "500g"
  /** Net product weight from the packaged variant, in grams. Packaging allowance is added server-side later. */
  weightGrams: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  category: 'makhana' | 'dry-fruits' | 'nuts' | 'seeds' | 'snacks' | 'superfoods' | 'spices' | 'gifts';
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
