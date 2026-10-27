import { Product } from "@/types/shop";

const FLIPKART_MAKHANA_LISTINGS = [
  { name: "Koshi Fresh 3 Suta Small Handpicked Makhana | Ideal for Roasting & Snacking Fox Nut (1 x 500 g)", sku: "KF-3SUTA-RAW-500G", mrp: 599, price: 400, grams: 500, stock: 2189 },
  { name: "Koshi Fresh Premium Raw Makhana Combo 1kg (500g × 2) Fox Nut (2 x 0.5 kg)", sku: "KOSHI-MAKHANA-500X2-1KG", mrp: 1699, price: 1000, grams: 1000, stock: 1538 },
  { name: "Koshi Fresh Makhana Powder | Fox Nut Powder | Healthy Diet Fox Nut (1 x 400 g)", sku: "KFM-POWDER-400G", mrp: 549, price: 170, grams: 400, stock: 1978 },
  { name: "Koshi Fresh Elite Makhana | Shahi Dana | Organic Fox Nuts | Made for Premium Tastes (1 x 500 g)", sku: "KOSHI-F-MAKHANA-500", mrp: 1099, price: 767, grams: 500, stock: 4997 },
  { name: "Koshi Fresh 3 Suta Small Handpicked Makhana | Ideal for Roasting & Snacking Fox Nut (1 x 200 g)", sku: "KF-3SUTA-RAW-200G", mrp: 299, price: 219, grams: 200, stock: 981 },
  { name: "Koshi Fresh Medium Size Raw Makhana | Fresh Bihar Fox Nuts (1 x 1 kg)", sku: "MAKHANA_MEDIUM_1KG_V1", mrp: 1999, price: 795, grams: 1000, stock: 4759 },
  { name: "Koshi Fresh Raw Makhana Fox Nut (1 x 200 g)", sku: "KOSHI-MAKHANA-RAW-200G", mrp: 699, price: 280, grams: 200, stock: 203 },
  { name: "Koshi Fresh Medium Makhana Raw 2kg Combo Fox Nut (1 x 2 kg)", sku: "MEDIUM-MAKHANA-RAW-2KG", mrp: 3999, price: 1681, grams: 2000, stock: 1097 },
  { name: "Koshi Fresh Medium Size Raw Makhana | Plain Phool Makhana | Vrat Snack (1 kg)", sku: "KF-PURE-4-SUTA", mrp: 1184, price: 751, grams: 1000, stock: 4996 },
  { name: "Koshi Fresh Premium Raw Makhana Fox Nut (1 x 500 g)", sku: "KOSHIMAKHANARAW500", mrp: 1299, price: 500, grams: 500, stock: 481 },
  { name: "Koshi Fresh Raw Makhana 100g Combo Fox Nut (2 x 50 g)", sku: "KF-RAW-100X2", mrp: 599, price: 250, grams: 100, stock: 500 },
  { name: "Koshi Fresh Medium Raw Makhana 250g Fox Nut (1 x 250 g)", sku: "KFM-MEDIUM-250G", mrp: 699, price: 238, grams: 250, stock: 1995 },
  { name: "Koshi Fresh Medium Handpicked Raw Makhana 500g Fox Nut (1 x 500 g)", sku: "MEDIUM_MAKHANA_500G", mrp: 999, price: 420, grams: 500, stock: 925 },
  { name: "Koshi Fresh Raw Makhana Fox Nuts (2 x 200 g) Pack of 2", sku: "KF-RAW-200X2", mrp: 899, price: 534, grams: 400, stock: 100 },
  { name: "Koshi Fresh Premium Raw Makhana 100g Fox Nut (1 x 100 g)", sku: "KOSHI-MAKHANA-100G", mrp: 399, price: 145, grams: 100, stock: 492 },
  { name: "Koshi Fresh Puffed Fox Nut (1 x 250 g)", sku: "MAKHANA001", mrp: 899, price: 295, grams: 250, stock: 4900 },
  { name: "Koshi Fresh Premium Big Size Makhana | Jumbo Fox Nuts | Bihar Special (1 x 1 kg)", sku: "KOSHI_PREMIUM_MAKHANA_1KG_BIG", mrp: 2999, price: 1000, grams: 1000, stock: 4886 },
  { name: "Koshi Fresh Premium Raw Makhana Combo 500g (250g × 2) Fox Nut", sku: "MAKHANA-250G-COMBO", mrp: 899, price: 587, grams: 500, stock: 389 },
  { name: "Koshi Fresh Premium Pure 6 Suta Jumbo Raw Makhana (1 x 1 kg)", sku: "KF-6SUTA-RAW-1KG", mrp: 1999, price: 1424, grams: 1000, stock: 4980 },
  { name: "Koshi Fresh Premium Makhana Raw 2kg Combo Fox Nut (1 x 2 kg)", sku: "PREMIUM-MAKHANA-RAW-2KG", mrp: 5999, price: 2083, grams: 2000, stock: 197 },
  { name: "Koshi Fresh Raw Makhana 50g Fox Nut (1 x 50 g)", sku: "KOSHI-MAKHANA-RAW-50G", mrp: 299, price: 142, grams: 50, stock: 288 },
  { name: "Koshi Fresh Puffed Fox Nut (250 g)", sku: "MAKHANA001SH", mrp: 899, price: 286, grams: 250, stock: 660 },
  { name: "Koshi Fresh Elite Makhana | Shahi Dana | Organic Fox Nuts | Made for Premium Tastes (1 x 1 kg)", sku: "KOSHI-F-MAKHANA-1000G", mrp: 2100, price: 1463, grams: 1000, stock: 1000 },
] as const;

const LISTING_IMAGES: Record<string, string> = {
  "KF-3SUTA-RAW-500G": "/product-makhana-small.webp",
  "KF-3SUTA-RAW-200G": "/product-makhana-small.webp",
  "KOSHI-MAKHANA-500X2-1KG": "/product-makhana-combo.webp",
  "KFM-POWDER-400G": "/product-makhana-powder.webp",
  "KOSHI-F-MAKHANA-500": "/product-makhana-jumbo.webp",
  "MAKHANA_MEDIUM_1KG_V1": "/product-makhana-medium.webp",
  "KOSHI-MAKHANA-RAW-200G": "/product-makhana-raw.webp",
  "MEDIUM-MAKHANA-RAW-2KG": "/product-makhana-medium.webp",
  "KF-PURE-4-SUTA": "/product-makhana-medium.webp",
  KOSHIMAKHANARAW500: "/product-makhana-raw.webp",
  "KF-RAW-100X2": "/product-makhana-combo.webp",
  "KFM-MEDIUM-250G": "/product-makhana-medium.webp",
  MEDIUM_MAKHANA_500G: "/product-makhana-medium.webp",
  "KF-RAW-200X2": "/product-makhana-combo.webp",
  "KOSHI-MAKHANA-100G": "/product-makhana-raw.webp",
  MAKHANA001: "/product-makhana-raw.webp",
  KOSHI_PREMIUM_MAKHANA_1KG_BIG: "/product-makhana-jumbo.webp",
  "MAKHANA-250G-COMBO": "/product-makhana-combo.webp",
  "KF-6SUTA-RAW-1KG": "/product-makhana-jumbo.webp",
  "PREMIUM-MAKHANA-RAW-2KG": "/product-makhana-combo.webp",
  "KOSHI-MAKHANA-RAW-50G": "/product-makhana-raw.webp",
  MAKHANA001SH: "/product-makhana-raw.webp",
  "KOSHI-F-MAKHANA-1000G": "/product-makhana-jumbo.webp",
};

const importedListings: Product[] = FLIPKART_MAKHANA_LISTINGS.map((listing) => ({
  slug: `flipkart-${listing.sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  name: listing.name,
  subtitle: `Seller SKU: ${listing.sku}`,
  brand: "Koshi Fresh",
  seller: "Renuka Enterprises",
  category: listing.sku === "KFM-POWDER-400G" ? "flour" : "makhana",
  description: listing.name,
  nutritionalInfo: { calories: "Not provided", protein: "Not provided", fat: "Not provided", fiber: "Not provided" },
  sourcing: "Manufacturer: RENUKA Enterprises, Katihar, Bihar, India.",
  images: [LISTING_IMAGES[listing.sku] ?? "/product-makhana-raw.webp"],
  rating: 0,
  reviewsCount: 0,
  badges: [],
  variants: [{ id: listing.sku, weight: `${listing.grams}g`, weightGrams: listing.grams, price: listing.price, originalPrice: listing.mrp, inStock: listing.stock > 0 }],
}));

export const PRODUCTS: Product[] = [
  {
    slug: "premium-raw-makhana",
    name: "Premium Raw Makhana",
    subtitle: "Organic sun-dried Foxnuts sourced straight from Mithila",
    brand: "Koshi Fresh",
    seller: "Renuka Enterprises",
    category: "makhana",
    description: "Handpicked, naturally harvested, and sun-dried raw foxnuts of the highest size grade (9mm+). High in antioxidants, calcium, and protein, these raw makhanas are perfect for home roasting.",
    nutritionalInfo: {
      calories: "347 kcal",
      protein: "9.7 g",
      fat: "0.1 g",
      fiber: "14.5 g"
    },
    sourcing: "Harvested sustainably by local farming cooperatives in Madhubani, Bihar.",
    images: ["/product-makhana-raw.webp"],
    rating: 4.9,
    reviewsCount: 124,
    badges: ["Best Seller", "9mm+ Jumbo"],
    variants: [
      { id: "raw-250", weight: "250g", weightGrams: 250, price: 299, originalPrice: 349, inStock: true },
      { id: "raw-500", weight: "500g", weightGrams: 500, price: 549, originalPrice: 649, inStock: true },
      { id: "raw-1000", weight: "1kg Pack", weightGrams: 1000, price: 999, originalPrice: 1199, inStock: false }
    ]
  },
  {
    slug: "roasted-salted-cashews",
    name: "Roasted Whole Cashews",
    subtitle: "Slow-roasted jumbo cashews with pink Himalayan sea salt",
    brand: "Koshi Fresh",
    seller: "Renuka Enterprises",
    category: "dry-fruits",
    description: "Hand-sorted jumbo W240 grade whole cashew nuts slow roasted to golden perfection with a light pinch of Himalayan pink sea salt.",
    nutritionalInfo: {
      calories: "553 kcal",
      protein: "18.2 g",
      fat: "43.8 g",
      fiber: "3.3 g"
    },
    sourcing: "Handpicked from organic cashew groves in Mangalore, India.",
    images: ["/product-cashews.webp"],
    rating: 4.9,
    reviewsCount: 142,
    badges: ["AI Studio Quality", "W240 Jumbo"],
    variants: [
      { id: "cashew-250", weight: "250g", weightGrams: 250, price: 449, originalPrice: 549, inStock: true },
      { id: "cashew-500", weight: "500g", weightGrams: 500, price: 849, originalPrice: 999, inStock: true }
    ]
  },
  {
    slug: "premium-california-almonds",
    name: "Premium California Almonds",
    subtitle: "Jumbo sized crunch almonds, rich in Vitamin E & antioxidants",
    brand: "Koshi Fresh",
    seller: "Renuka Enterprises",
    category: "dry-fruits",
    description: "Hand-sorted jumbo sized California almonds, packed raw to preserve nutritional density. Rich in heart-healthy monounsaturated fats, protein, and dietary fiber.",
    nutritionalInfo: {
      calories: "579 kcal",
      protein: "21.2 g",
      fat: "49.9 g",
      fiber: "12.5 g"
    },
    sourcing: "Imported directly from certified growers in California, USA.",
    images: ["/product-almonds.webp"],
    rating: 4.8,
    reviewsCount: 204,
    badges: ["High Fiber", "100% Natural"],
    variants: [
      { id: "almond-250", weight: "250g", weightGrams: 250, price: 399, originalPrice: 499, inStock: true },
      { id: "almond-500", weight: "500g", weightGrams: 500, price: 749, originalPrice: 949, inStock: true }
    ]
  },
  {
    slug: "premium-roasted-makhana",
    name: "Premium Roasted Makhana",
    subtitle: "Slow-roasted crispy foxnuts in organic cold-pressed A2 ghee",
    brand: "Koshi Fresh",
    seller: "Renuka Enterprises",
    category: "makhana",
    description: "Slow-roasted to crispy perfection in pure A2 cow ghee, flavored lightly with sea salt and black pepper. A healthy, crunchy snack that satisfies cravings.",
    nutritionalInfo: {
      calories: "389 kcal",
      protein: "8.9 g",
      fat: "4.5 g",
      fiber: "12.8 g"
    },
    sourcing: "Roasted and packed under hygienic standards in Patna, Bihar.",
    images: ["/product-makhana-roasted.webp"],
    rating: 4.9,
    reviewsCount: 86,
    badges: ["Ghee Roasted", "Clean Label"],
    variants: [
      { id: "roasted-150", weight: "150g", weightGrams: 150, price: 349, originalPrice: 399, inStock: true },
      { id: "roasted-300", weight: "300g", weightGrams: 300, price: 629, originalPrice: 749, inStock: true }
    ]
  },
  ...importedListings,
];

export type Products = typeof PRODUCTS;
