import { Product } from "@/types/shop";

export const PRODUCTS: Product[] = [
  {
    slug: "premium-raw-makhana",
    name: "Premium Raw Makhana",
    subtitle: "Organic sun-dried Foxnuts sourced straight from Mithila",
    category: "makhana",
    description: "Handpicked, naturally harvested, and sun-dried raw foxnuts of the highest size grade (9mm+). High in antioxidants, calcium, and protein, these raw makhanas are perfect for home roasting.",
    nutritionalInfo: {
      calories: "347 kcal",
      protein: "9.7 g",
      fat: "0.1 g",
      fiber: "14.5 g"
    },
    sourcing: "Harvested sustainably by local farming cooperatives in Madhubani, Bihar.",
    images: ["/hero-makhana-bowl.jpg"],
    rating: 4.9,
    reviewsCount: 124,
    badges: ["Best Seller", "9mm+ Jumbo"],
    variants: [
      { id: "raw-250", weight: "250g", price: 299, originalPrice: 349, inStock: true },
      { id: "raw-500", weight: "500g", price: 549, originalPrice: 649, inStock: true },
      { id: "raw-1000", weight: "1kg Pack", price: 999, originalPrice: 1199, inStock: false }
    ]
  },
  {
    slug: "roasted-salted-cashews",
    name: "Roasted Whole Cashews",
    subtitle: "Slow-roasted jumbo cashews with pink Himalayan sea salt",
    category: "dry-fruits",
    description: "Hand-sorted jumbo W240 grade whole cashew nuts slow roasted to golden perfection with a light pinch of Himalayan pink sea salt.",
    nutritionalInfo: {
      calories: "553 kcal",
      protein: "18.2 g",
      fat: "43.8 g",
      fiber: "3.3 g"
    },
    sourcing: "Handpicked from organic cashew groves in Mangalore, India.",
    images: ["/roasted-cashews-studio.jpg"],
    rating: 4.9,
    reviewsCount: 142,
    badges: ["AI Studio Quality", "W240 Jumbo"],
    variants: [
      { id: "cashew-250", weight: "250g", price: 449, originalPrice: 549, inStock: true },
      { id: "cashew-500", weight: "500g", price: 849, originalPrice: 999, inStock: true }
    ]
  },
  {
    slug: "premium-california-almonds",
    name: "Premium California Almonds",
    subtitle: "Jumbo sized crunch almonds, rich in Vitamin E & antioxidants",
    category: "dry-fruits",
    description: "Hand-sorted jumbo sized California almonds, packed raw to preserve nutritional density. Rich in heart-healthy monounsaturated fats, protein, and dietary fiber.",
    nutritionalInfo: {
      calories: "579 kcal",
      protein: "21.2 g",
      fat: "49.9 g",
      fiber: "12.5 g"
    },
    sourcing: "Imported directly from certified growers in California, USA.",
    images: ["/almonds-seeds-collection.jpg"],
    rating: 4.8,
    reviewsCount: 204,
    badges: ["High Fiber", "100% Natural"],
    variants: [
      { id: "almond-250", weight: "250g", price: 399, originalPrice: 499, inStock: true },
      { id: "almond-500", weight: "500g", price: 749, originalPrice: 949, inStock: true }
    ]
  },
  {
    slug: "premium-roasted-makhana",
    name: "Premium Roasted Makhana",
    subtitle: "Slow-roasted crispy foxnuts in organic cold-pressed A2 ghee",
    category: "makhana",
    description: "Slow-roasted to crispy perfection in pure A2 cow ghee, flavored lightly with sea salt and black pepper. A healthy, crunchy snack that satisfies cravings.",
    nutritionalInfo: {
      calories: "389 kcal",
      protein: "8.9 g",
      fat: "4.5 g",
      fiber: "12.8 g"
    },
    sourcing: "Roasted and packed under hygienic standards in Patna, Bihar.",
    images: ["/hero-gourmet-spices-bg.jpg"],
    rating: 4.9,
    reviewsCount: 86,
    badges: ["Ghee Roasted", "Clean Label"],
    variants: [
      { id: "roasted-150", weight: "150g", price: 349, originalPrice: 399, inStock: true },
      { id: "roasted-300", weight: "300g", price: 629, originalPrice: 749, inStock: true }
    ]
  }
];

export type Products = typeof PRODUCTS;
