"use client";

import * as React from "react";
import { useShop } from "@/context/shop-context";
import { AnnouncementBar } from "./announcement-bar";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, ShoppingBag, Heart, Trash2 } from "lucide-react";
import Link from "next/link";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const {
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
  } = useShop();

  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="relative min-h-screen flex flex-col bg-ivory text-obsidian">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Header Navigation */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* ================= GLOBAL SEARCH OVERLAY ================= */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Search Koshi Fresh</DialogTitle>
            <DialogDescription>
              Find premium foxnuts, dry fruits, seeds, and healthy snacks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-stone/60" />
              <Input
                placeholder="Search for roasted makhana, flax seeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mock Popular Searches */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {["Roasted Makhana", "Raw Foxnuts", "Dry Fruits", "Seeds", "Organic Spices"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs font-sans bg-sand/40 border border-sand hover:bg-sand hover:text-forest px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= GLOBAL WISHLIST DRAWER ================= */}
      <Drawer open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
        <DrawerContent side="right" className="flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Favorites ({wishlistCount})</DrawerTitle>
            <DrawerDescription>Your saved organic snacks.</DrawerDescription>
          </DrawerHeader>

          {wishlistCount > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-4">
              {/* Mock Wishlist Item */}
              <div className="flex gap-4 p-4 border border-sand bg-sand/10 rounded-xl items-center relative">
                <div className="h-16 w-16 bg-sand/30 rounded-lg flex items-center justify-center shrink-0 text-2xl font-serif text-forest">
                  🌰
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-serif font-medium text-obsidian truncate">
                    Premium Raw Makhana
                  </h4>
                  <p className="text-xs text-stone font-sans">250g pack</p>
                  <span className="text-sm font-sans font-medium text-forest block mt-1">₹299</span>
                </div>
                <button
                  onClick={() => setWishlistCount(wishlistCount - 1)}
                  className="p-1.5 text-stone hover:text-feedback-error transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <Heart className="h-12 w-12 text-stone/40 mb-3 stroke-[1.2]" />
              <span className="text-stone font-sans font-light block mb-1">No Saved Favorites</span>
              <p className="text-xs text-stone/80 font-light max-w-[200px] mx-auto">
                Tap the heart icon on product cards to build your custom collection.
              </p>
            </div>
          )}

          <DrawerFooter className="border-t border-sand/50 pt-4 mt-auto">
            <Button onClick={() => setIsWishlistOpen(false)} className="w-full">
              Continue Shopping
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ================= GLOBAL CART DRAWER ================= */}
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerContent side="right" className="flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Your Shopping Bag ({cartCount})</DrawerTitle>
            <DrawerDescription>Ready to check out?</DrawerDescription>
          </DrawerHeader>

          {cartCount > 0 ? (
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 py-4">
              {/* Mock Cart Item 1 */}
              <div className="flex gap-4 p-4 border border-sand bg-sand/10 rounded-xl items-center relative">
                <div className="h-16 w-16 bg-sand/30 rounded-lg flex items-center justify-center shrink-0 text-2xl font-serif text-forest">
                  🍿
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-serif font-medium text-obsidian truncate">
                    Premium Roasted Makhana
                  </h4>
                  <p className="text-xs text-stone font-sans">150g pack</p>
                  <span className="text-sm font-sans font-medium text-forest block mt-1">₹349</span>
                </div>
                <button
                  onClick={() => setCartCount(cartCount - 1)}
                  className="p-1.5 text-stone hover:text-feedback-error transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Mock Cart Item 2 */}
              <div className="flex gap-4 p-4 border border-sand bg-sand/10 rounded-xl items-center relative">
                <div className="h-16 w-16 bg-sand/30 rounded-lg flex items-center justify-center shrink-0 text-2xl font-serif text-forest">
                  🌰
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-serif font-medium text-obsidian truncate">
                    Premium Raw Makhana
                  </h4>
                  <p className="text-xs text-stone font-sans">250g pack</p>
                  <span className="text-sm font-sans font-medium text-forest block mt-1">₹299</span>
                </div>
                <button
                  onClick={() => setCartCount(cartCount - 1)}
                  className="p-1.5 text-stone hover:text-feedback-error transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <ShoppingBag className="h-12 w-12 text-stone/40 mb-3 stroke-[1.2]" />
              <span className="text-stone font-sans font-light block mb-1">Your bag is empty</span>
              <p className="text-xs text-stone/80 font-light max-w-[200px] mx-auto">
                Add premium foxnuts or snacks to get started on your health journey.
              </p>
            </div>
          )}

          {cartCount > 0 && (
            <div className="border-t border-sand/50 p-4 space-y-4 bg-sand/10 rounded-2xl mb-4 mt-auto">
              <div className="flex justify-between text-sm font-sans text-charcoal">
                <span>Subtotal</span>
                <span className="font-semibold text-obsidian">₹648</span>
              </div>
              <div className="flex justify-between text-xs font-sans text-stone">
                <span>Shipping</span>
                <span className="text-feedback-success font-medium">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-sans font-medium text-obsidian">
                <span>Total Est.</span>
                <span className="text-forest font-bold">₹648</span>
              </div>
            </div>
          )}

          <DrawerFooter className="border-t border-sand/50 pt-4">
            {cartCount > 0 ? (
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 bg-forest text-ivory hover:bg-forest-light shadow-premium-sm h-11 px-6 text-sm w-full cursor-pointer select-none text-center"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <Button onClick={() => setIsCartOpen(false)} className="w-full">
                Continue Shopping
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
