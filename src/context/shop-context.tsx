"use client";

import * as React from "react";

export interface CartItem {
  slug: string;
  variantId: string;
  quantity: number;
}

interface ShopContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (slug: string, variantId: string, quantity?: number) => void;
  updateCartQuantity: (slug: string, variantId: string, quantity: number) => void;
  removeFromCart: (slug: string, variantId: string) => void;
  clearCart: () => void;
  wishlistCount: number;
  setWishlistCount: (count: number) => void;
}

const ShopContext = React.createContext<ShopContextType | undefined>(undefined);
const CART_STORAGE_KEY = "koshi-fresh-cart";

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [wishlistCount, setWishlistCount] = React.useState(0);
  const [cartLoaded, setCartLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed.filter((item): item is CartItem =>
            item && typeof item.slug === "string" && typeof item.variantId === "string" &&
            Number.isInteger(item.quantity) && item.quantity > 0
          ));
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
    setCartLoaded(true);
  }, []);

  React.useEffect(() => {
    if (cartLoaded) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, cartLoaded]);

  const addToCart = React.useCallback((slug: string, variantId: string, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCartItems((items) => {
      const found = items.find((item) => item.slug === slug && item.variantId === variantId);
      if (!found) return [...items, { slug, variantId, quantity }];
      return items.map((item) => item === found ? { ...item, quantity: item.quantity + quantity } : item);
    });
  }, []);

  const updateCartQuantity = React.useCallback((slug: string, variantId: string, quantity: number) => {
    setCartItems((items) => quantity < 1
      ? items.filter((item) => item.slug !== slug || item.variantId !== variantId)
      : items.map((item) => item.slug === slug && item.variantId === variantId ? { ...item, quantity } : item));
  }, []);

  const removeFromCart = React.useCallback((slug: string, variantId: string) => {
    setCartItems((items) => items.filter((item) => item.slug !== slug || item.variantId !== variantId));
  }, []);
  const clearCart = React.useCallback(() => setCartItems([]), []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const contextValue = React.useMemo(() => ({
    isCartOpen, setIsCartOpen, isSearchOpen, setIsSearchOpen, isWishlistOpen, setIsWishlistOpen,
    cartCount, cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart,
    wishlistCount, setWishlistCount,
  }), [isCartOpen, isSearchOpen, isWishlistOpen, cartCount, cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart, wishlistCount]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = React.useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
}
