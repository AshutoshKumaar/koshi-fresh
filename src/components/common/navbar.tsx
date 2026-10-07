"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, User, UserRound, Settings, LogOut, LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/components/ui/toast";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

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
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { setIsCartOpen, setIsSearchOpen, setIsWishlistOpen, cartCount, wishlistCount } = useShop();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const accountMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isAccountMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !accountMenuRef.current?.contains(event.target)) setIsAccountMenuOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAccountMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsAccountMenuOpen(false);
      toast({ title: "Signed out", description: "You have been safely signed out of your account." });
      router.replace("/");
    } catch {
      toast({ title: "Could not sign out", description: "Please try again in a moment.", variant: "error" });
    } finally {
      setIsSigningOut(false);
    }
  };

  React.useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        frame = 0;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  const isHomePage = pathname === "/";
  const isTransparentDark = isHomePage && !isScrolled;

  return (
    <header
      className={cn(
        "fixed left-0 top-0 h-14 w-full overflow-x-clip z-30 transition-all duration-300 rounded-none px-3 sm:px-8 flex items-center justify-between border-b bg-white/95 backdrop-blur-xl shadow-premium-sm border-sand/60 text-obsidian md:px-8",
        isTransparentDark
          ? "md:top-9 md:h-16 md:bg-transparent md:border-white/20 md:text-white md:backdrop-blur-xs"
          : isScrolled
          ? "md:top-0 md:h-16 md:bg-white/95 md:backdrop-blur-xl md:shadow-premium-sm md:border-sand/60 md:text-obsidian"
          : "md:top-9 md:h-16 md:bg-white/95 md:backdrop-blur-xl md:shadow-premium-sm md:border-sand/60 md:text-obsidian"
      )}
    >
      <div className="relative mx-auto flex min-w-0 w-full max-w-[1280px] items-center justify-between">
        {/* Mobile Navigation Drawer Trigger */}
        <div className="flex shrink-0 items-center lg:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <button
                className={cn(
                  "flex h-11 w-11 -ml-2 items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
                  isTransparentDark ? "text-forest md:text-white md:hover:text-gold-light" : "text-obsidian hover:text-forest"
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
                        "flex min-h-11 items-center text-base font-sans font-medium text-obsidian hover:text-forest transition-colors",
                        pathname === link.href && "text-forest font-semibold"
                      )}
                    >
                      {link.label}
                    </Link>
                  </DrawerClose>
                ))}
                <DrawerClose asChild>
                  <Link
                    href={user ? "/account" : "/login"}
                    className={cn(
                      "text-base font-sans font-medium text-forest hover:underline transition-colors pt-2 border-t border-sand/40",
                      (pathname === "/account" || pathname === "/login") && "font-bold"
                    )}
                  >
                    {user ? "My Account" : "Sign In / Register"}
                  </Link>
                </DrawerClose>
              </div>
              <div className="mt-auto border-t border-sand/50 pt-6">
                <span className="text-xs text-stone font-sans font-light block mb-4">
                  Pure Sourced Foxnuts & Superfoods
                </span>
                <DrawerClose asChild>
                  <Link href="/shop" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-forest px-4 text-sm font-bold text-white">Shop Collections</Link>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Brand Logo */}
        <div className="min-w-0 flex-1 pr-20 text-left lg:flex-initial lg:pr-0">
          <Link
            href="/"
            className={cn(
              "whitespace-nowrap font-serif text-lg sm:text-2xl font-bold tracking-tight transition-colors",
              isTransparentDark ? "text-forest md:text-white md:hover:text-gold-light" : "text-forest hover:opacity-90"
            )}
          >
            Koshi Fresh
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-5 2xl:gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-[10px] xl:text-[11px] uppercase tracking-normal xl:tracking-wider font-sans font-bold transition-colors relative py-1",
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
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 shrink-0 items-center gap-0 md:static md:translate-y-0 md:gap-1.5 lg:gap-1 xl:gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
              isTransparentDark ? "text-forest md:text-white md:hover:text-gold-light md:hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30"
            )}
            aria-label="Search Catalog"
          >
            <Search className="h-5 w-5 stroke-[1.75]" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className={cn(
              "hidden lg:flex h-11 w-11 items-center justify-center transition-colors cursor-pointer relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
              isTransparentDark ? "md:text-white md:hover:text-gold-light md:hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30"
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
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
              isTransparentDark ? "text-forest md:text-white md:hover:text-gold-light md:hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30"
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

          {/* Account menu */}
          <div ref={accountMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((open) => !open)}
              disabled={authLoading}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest md:h-11 md:w-11",
                isTransparentDark ? "text-forest md:text-white md:hover:text-gold-light md:hover:bg-white/10" : "text-obsidian hover:text-forest hover:bg-sand/30",
                isAccountMenuOpen && "bg-sand/40 text-forest"
              )}
              aria-label={authLoading ? "Checking account" : user ? "Open account menu" : "Open sign in menu"}
              aria-haspopup="menu"
              aria-expanded={isAccountMenuOpen}
              title={user ? "My Account" : "Sign In"}
            >
              {authLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <User className="h-5 w-5 stroke-[1.75]" />}
            </button>

            {isAccountMenuOpen && !authLoading && (
              <div role="menu" aria-label="Account menu" className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-sand/70 bg-white p-2 text-obsidian shadow-premium-lg">
                {user ? (
                  <>
                    <div className="border-b border-sand/60 px-3 py-3">
                      <p className="truncate text-sm font-semibold">{profile?.name || user.displayName || "Welcome back"}</p>
                      <p className="mt-0.5 truncate text-xs text-stone">{profile?.email || user.email}</p>
                    </div>
                    <Link role="menuitem" href="/account" onClick={() => setIsAccountMenuOpen(false)} className="mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-sand/30 hover:text-forest">
                      <UserRound className="h-4 w-4 text-stone" /> My Profile
                    </Link>
                    <Link role="menuitem" href="/account#profile" onClick={() => setIsAccountMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-sand/30 hover:text-forest">
                      <Settings className="h-4 w-4 text-stone" /> Account Settings
                    </Link>
                    <div className="my-1 border-t border-sand/60" />
                    <button role="menuitem" type="button" onClick={() => void handleSignOut()} disabled={isSigningOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-feedback-error transition-colors hover:bg-feedback-error/5 disabled:opacity-60">
                      {isSigningOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                      {isSigningOut ? "Signing out…" : "Log out"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-3">
                      <p className="text-sm font-semibold">Welcome to Koshi Fresh</p>
                      <p className="mt-0.5 text-xs text-stone">Sign in to see your orders and saved favorites.</p>
                    </div>
                    <Link role="menuitem" href="/login" onClick={() => setIsAccountMenuOpen(false)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-forest px-3 text-sm font-semibold text-white transition-colors hover:bg-forest-light">
                      <UserRound className="h-4 w-4" /> Sign in
                    </Link>
                    <Link role="menuitem" href="/register" onClick={() => setIsAccountMenuOpen(false)} className="mt-1 flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold text-forest transition-colors hover:bg-forest/5">
                      Create an account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
