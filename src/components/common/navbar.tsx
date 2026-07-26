"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { useShop } from "@/context/shop-context";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/recipes", label: "Recipes" },
  { href: "/health-benefits", label: "Health Benefits" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { setIsCartOpen, setIsSearchOpen, setIsWishlistOpen, cartCount, wishlistCount } = useShop();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const isTransparentDark = isHomePage && !isScrolled;

  return (
    <header
      className={cn(
        "fixed left-0 w-full z-30 transition-all duration-300 rounded-none px-4 sm:px-8 flex items-center justify-between border-b",
        isTransparentDark
          ? "top-9 h-16 bg-transparent border-white/20 text-white backdrop-blur-xs"
          : isScrolled
          ? "top-0 h-16 bg-white/95 backdrop-blur-xl shadow-premium-sm border-sand/60 text-obsidian"
          : "top-9 h-16 bg-white/95 backdrop-blur-xl shadow-premium-sm border-sand/60 text-obsidian"
      )}
    >
      <div className="mx-auto max-w-[1280px] w-full flex items-center justify-between">
        {/* Mobile Navigation Drawer Trigger */}
        <div className="flex md:hidden items-center">
          <Drawer>
            <DrawerTrigger asChild>
              <button
                className={cn(
                  "p-2 -ml-2 transition-colors cursor-pointer",
                  isTransparentDark ? "text-white hover:text-gold-light" : "text-obsidian hover:text-forest"
                )}
                aria-label="Toggle Mobile Menu"
              >
                <Menu className="h-6 w-6 stroke-[1.5]" />
              </button>
            </DrawerTrigger>
            <DrawerContent side="left" className="w-[300px]">
              <DrawerHeader>
                <DrawerTitle className="font-serif text-forest text-2xl">Koshi Fresh</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col space-y-5 pt-6">
                {NAV_LINKS.map((link) => (
                  <DrawerClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-base font-sans font-medium text-obsidian hover:text-forest transition-colors",
                        pathname === link.href && "text-forest font-semibold"
                      )}
                    >
                      {link.label}
                    </Link>
                  </DrawerClose>
                ))}
              </div>
              <div className="mt-auto border-t border-sand/50 pt-6">
                <span className="text-xs text-stone font-sans font-light block mb-4">
                  Pure Sourced Foxnuts & Superfoods
                </span>
                <DrawerClose asChild>
                  <Button className="w-full" variant="primary" size="sm">
                    Shop Collections
                  </Button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Brand Logo */}
        <div className="flex-1 md:flex-initial text-center md:text-left">
          <Link
            href="/"
            className={cn(
              "font-serif text-xl sm:text-2xl font-bold tracking-tight transition-colors",
              isTransparentDark ? "text-white hover:text-gold-light" : "text-forest hover:opacity-90"
            )}
          >
            Koshi Fresh
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-widest font-sans font-bold transition-colors relative py-1",
                  isTransparentDark
                    ? isActive ? "text-gold-light" : "text-white/90 hover:text-gold-light"
                    : isActive ? "text-forest font-extrabold border-b-2 border-forest" : "text-charcoal hover:text-forest"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls Triggers */}
        <div className="flex items-center space-x-1.5 md:space-x-3">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "p-2 transition-colors cursor-pointer rounded-full",
              isTransparentDark ? "text-white hover:text-gold-light hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30"
            )}
            aria-label="Search Catalog"
          >
            <Search className="h-5 w-5 stroke-[1.75]" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className={cn(
              "p-2 transition-colors cursor-pointer relative rounded-full",
              isTransparentDark ? "text-white hover:text-gold-light hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30"
            )}
            aria-label="Favorites List"
          >
            <Heart className="h-5 w-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-obsidian text-[9px] font-sans font-bold h-4 w-4 rounded-full flex items-center justify-center scale-90 border border-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={cn(
              "p-2 transition-colors cursor-pointer relative rounded-full",
              isTransparentDark ? "text-white hover:text-gold-light hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30"
            )}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-obsidian text-[9px] font-sans font-bold h-4 w-4 rounded-full flex items-center justify-center scale-90 border border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => toast({ title: "Account Portal", description: "Profile details view coming in later phases." })}
            className={cn(
              "p-2 transition-colors cursor-pointer rounded-full hidden sm:block",
              isTransparentDark ? "text-white hover:text-gold-light hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30"
            )}
            aria-label="User Account"
          >
            <User className="h-5 w-5 stroke-[1.75]" />
          </button>
        </div>
      </div>
    </header>
  );
}
