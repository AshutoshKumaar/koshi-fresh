export interface ProductVariant {
  id: string;
  weight: string; // e.g. "100g", "250g", "500g"
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
