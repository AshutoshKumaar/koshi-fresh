"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/shop-context";
import { AnnouncementBar } from "./announcement-bar";
import { Navbar } from "./navbar";
import { MobileBottomNav } from "@/components/common/mobile-bottom-nav";
import { StorefrontLoading } from "@/components/common/storefront-loading";

const StorefrontOverlays = dynamic(() => import("./storefront-overlays"), { ssr: false });

export function LayoutWrapper({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const navigationStartedAt = React.useRef(0);
  const navigationFromPath = React.useRef(pathname);
  const { isCartOpen, isSearchOpen, isWishlistOpen } = useShop();

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
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow pb-0">
        {isNavigating ? <StorefrontLoading label="Taking you to your next fresh find…" /> : children}
      </main>
      {footer}
      <MobileBottomNav />
      {(isCartOpen || isSearchOpen || isWishlistOpen) && <StorefrontOverlays />}
    </div>
  );
}
