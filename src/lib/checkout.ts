import "server-only";
import { PRODUCTS } from "@/data/products";

export type PaymentMethod = "upi" | "cod" | "card";
export interface RequestedCartItem { slug: string; variantId: string; quantity: number }
export interface TrustedCartItem {
  slug: string;
  variantId: string;
  name: string;
  weight: string;
  weightGrams: number;
  price: number;
  quantity: number;
  sku: string;
  image: string;
}

export function validateCart(value: unknown): TrustedCartItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) throw new Error("Your cart is empty or invalid.");
  const result: TrustedCartItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") throw new Error("Invalid cart item.");
    const item = raw as Partial<RequestedCartItem>;
    if (typeof item.slug !== "string" || typeof item.variantId !== "string") throw new Error("Invalid cart item.");
    if (!Number.isInteger(item.quantity) || !item.quantity || item.quantity < 1 || item.quantity > 50) throw new Error("Quantity must be between 1 and 50.");
    const product = PRODUCTS.find((entry) => entry.slug === item.slug);
    const variant = product?.variants.find((entry) => entry.id === item.variantId);
    if (!product || !variant || !variant.inStock) throw new Error("A product in your cart is unavailable.");
    if (!Number.isFinite(variant.weightGrams) || variant.weightGrams <= 0) throw new Error(`Weight is missing for ${product.name} (${variant.weight}).`);
    result.push({ slug: product.slug, variantId: variant.id, name: product.name, weight: variant.weight, weightGrams: variant.weightGrams, price: variant.price, quantity: item.quantity, sku: variant.id, image: product.images[0] });
  }
  return result;
}

export function getDiscount(couponValue: unknown, subtotal: number) {
  if (typeof couponValue !== "string") return { code: "", amount: 0 };
  const code = couponValue.trim().toUpperCase();
  return code === "KOSHI15" || code === "FIRST15" ? { code, amount: Math.round(subtotal * 0.15) } : { code: "", amount: 0 };
}

export function getShipmentWeightKg(items: TrustedCartItem[]) {
  const grams = items.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
  const packageAllowance = Number(process.env.SHIPROCKET_PACKAGING_WEIGHT_GRAMS || "0");
  if (!Number.isFinite(packageAllowance) || packageAllowance < 0) throw new Error("Invalid packaging weight configuration.");
  return Number(((grams + packageAllowance) / 1000).toFixed(3));
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "upi" || value === "cod" || value === "card";
}
