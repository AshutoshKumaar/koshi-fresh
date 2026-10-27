"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/shop-context";
import { AnnouncementBar } from "./announcement-bar";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Heart, Trash2, Minus, Plus, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { MobileBottomNav } from "@/components/common/mobile-bottom-nav";
import { StorefrontLoading } from "@/components/common/storefront-loading";

const SEARCHABLE_PRODUCTS = PRODUCTS.map((product) => ({
  product,
  searchText: `${product.name} ${product.brand} ${product.subtitle} ${product.description}`.toLowerCase(),
}));

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const navigationStartedAt = React.useRef(0);
  const navigationFromPath = React.useRef(pathname);
  const {
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    cartCount,
    cartItems,
    removeFromCart,
    updateCartQuantity,
    wishlistCount,
    setWishlistCount,
  } = useShop();

  const [searchQuery, setSearchQuery] = React.useState("");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const searchResults = React.useMemo(
    () => normalizedSearchQuery
      ? SEARCHABLE_PRODUCTS.filter(({ searchText }) => searchText.includes(normalizedSearchQuery)).slice(0, 6)
      : [],
    [normalizedSearchQuery],
  );

  React.useEffect(() => {
    const handleNavigationClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      navigationStartedAt.current = performance.now();
      navigationFromPath.current = window.location.pathname;
      setIsNavigating(true);
    };

    document.addEventListener("click", handleNavigationClick, true);
    return () => document.removeEventListener("click", handleNavigationClick, true);
  }, []);

  React.useEffect(() => {
    if (!isNavigating || pathname === navigationFromPath.current) return;
    const minimumVisibleMs = 350;
    const remainingMs = Math.max(0, minimumVisibleMs - (performance.now() - navigationStartedAt.current));
    const timer = window.setTimeout(() => setIsNavigating(false), remainingMs);
    return () => window.clearTimeout(timer);
  }, [pathname, isNavigating]);

  // Admin routes use their own login, navigation, and workspace shell.
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <div className="relative min-h-screen flex flex-col bg-ivory text-obsidian">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Header Navigation */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow pb-0">
        {isNavigating ? <StorefrontLoading label="Taking you to your next fresh find…" /> : children}
      </main>

      {/* Editorial Footer */}
      <Footer />
      <MobileBottomNav />

      {/* ================= GLOBAL SEARCH OVERLAY ================= */}
      <Dialog open={isSearchOpen} onOpenChange={(open) => { setIsSearchOpen(open); if (!open) setSearchQuery(""); }}>
        <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-xl overflow-hidden rounded-3xl border-sand/80 bg-white p-4 shadow-2xl sm:p-6 max-sm:top-auto max-sm:bottom-[calc(4.75rem+env(safe-area-inset-bottom))] max-sm:translate-y-0">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="text-xl font-bold text-forest sm:text-2xl">Find your fresh favorite</DialogTitle>
            <DialogDescription className="text-xs leading-relaxed sm:text-sm">
              Search makhana, dry fruits, and healthy snacks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-forest/70" />
              <Input
                autoFocus
                aria-label="Search products"
                placeholder="Try “roasted makhana” or “almonds”"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-2xl border-sand bg-ivory/70 pl-10 pr-11 text-base shadow-inner focus-visible:ring-forest"
              />
              {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full text-stone hover:bg-sand/50 focus-visible:ring-2 focus-visible:ring-forest" aria-label="Clear search"><X className="h-4 w-4" /></button>}
            </div>

            {normalizedSearchQuery ? (
              <div className="max-h-[42dvh] space-y-1 overflow-y-auto overscroll-contain" aria-live="polite">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-stone">{searchResults.length ? `${searchResults.length} matching ${searchResults.length === 1 ? "product" : "products"}` : "No exact matches"}</p>
                {searchResults.map(({ product }) => <Link key={product.slug} href={`/product/${product.slug}`} onClick={() => setIsSearchOpen(false)} className="flex min-h-16 items-center gap-3 rounded-2xl border border-transparent p-2 transition-colors hover:border-sand hover:bg-ivory/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand/30">{product.images[0].startsWith("/") ? <Image src={product.images[0]} alt="" fill sizes="48px" className="object-contain p-1" /> : <span className="grid h-full place-items-center text-xl">{product.images[0]}</span>}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-obsidian">{product.name}</span><span className="block truncate text-xs text-stone">{product.brand} · {product.subtitle}</span></span><ArrowRight className="mr-1 h-4 w-4 shrink-0 text-forest" /></Link>)}
                {!searchResults.length && <p className="rounded-xl bg-ivory/70 px-3 py-3 text-sm text-stone">Try a broader search, such as “makhana”, “dry fruits”, or “nuts”.</p>}
              </div>
            ) : (

              <div className="space-y-2">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone">Popular searches</span>
                <div className="flex flex-wrap gap-2">
                  {["Roasted Makhana", "Raw Foxnuts", "Dry Fruits", "Almonds", "Cashews"].map((tag) => (
                    <button key={tag} type="button" onClick={() => setSearchQuery(tag)} className="min-h-10 rounded-full border border-sand bg-ivory px-3.5 text-xs font-semibold text-charcoal transition-colors hover:border-forest/40 hover:bg-forest hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  ðŸŒ°
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
            <div className="flex-grow overflow-y-auto space-y-3 pr-1 py-2">
              {cartItems.map((item) => {
                const product = PRODUCTS.find((entry) => entry.slug === item.slug);
                const variant = product?.variants.find((entry) => entry.id === item.variantId);
                if (!product || !variant) return null;
                return (
                  <div key={`${item.slug}:${item.variantId}`} className="flex gap-3 p-3 border border-sand bg-white rounded-2xl items-center relative">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand/30">{product.images[0].startsWith("/") ? <Image src={product.images[0]} alt={product.name} fill sizes="64px" className="object-cover" /> : <span className="grid h-full place-items-center text-2xl">{product.images[0]}</span>}</div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-serif font-medium text-obsidian truncate">{product.name}</h4>
                      <p className="text-xs text-stone font-sans">{variant.weight} × {item.quantity}</p>
                      <span className="text-sm font-sans font-bold text-forest block mt-1">₹{variant.price * item.quantity}</span>
                      <div className="mt-2 inline-flex h-9 items-center rounded-lg border border-sand" aria-label={`Quantity ${item.quantity}`}><button type="button" onClick={() => updateCartQuantity(item.slug, item.variantId, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center rounded-l-lg text-forest hover:bg-forest/5 focus-visible:ring-2 focus-visible:ring-forest" aria-label={`Decrease ${product.name} quantity`}><Minus className="h-4 w-4" /></button><span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span><button type="button" onClick={() => updateCartQuantity(item.slug, item.variantId, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-r-lg text-forest hover:bg-forest/5 focus-visible:ring-2 focus-visible:ring-forest" aria-label={`Increase ${product.name} quantity`}><Plus className="h-4 w-4" /></button></div>
                    </div>
                    <button onClick={() => removeFromCart(item.slug, item.variantId)} className="flex h-10 w-10 items-center justify-center rounded-full text-stone hover:bg-red-50 hover:text-feedback-error transition-colors cursor-pointer" aria-label={`Remove ${product.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
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
            <div className="border-t border-sand/50 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-3 bg-white mt-auto">
              <div className="flex justify-between text-sm font-sans text-charcoal">
                <span>Subtotal</span>
                <span className="font-semibold text-obsidian">₹{cartItems.reduce((sum, item) => { const variant = PRODUCTS.find((product) => product.slug === item.slug)?.variants.find((entry) => entry.id === item.variantId); return sum + (variant?.price || 0) * item.quantity; }, 0)}</span>
              </div>
              <div className="flex justify-between text-xs font-sans text-stone">
                <span>Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
          )}

          <DrawerFooter className="border-t border-sand/50 pt-3 pb-[env(safe-area-inset-bottom)]">
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
