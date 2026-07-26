"use client";

import * as React from "react";

interface ShopContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  cartCount: number;
  setCartCount: (count: number) => void;
  wishlistCount: number;
  setWishlistCount: (count: number) => void;
}

const ShopContext = React.createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  
  // Set default mockup count values so badges are visible and layout looks premium immediately
  const [cartCount, setCartCount] = React.useState(2);
  const [wishlistCount, setWishlistCount] = React.useState(1);

  return (
    <ShopContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        cartCount,
        setCartCount,
        wishlistCount,
        setWishlistCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = React.useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
