"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/shop-context";
import { Home, LayoutGrid, Package, ShoppingBag, UserRound } from "lucide-react";

const NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/categories", label: "Categories", Icon: LayoutGrid },
  { href: "/account/orders", label: "Orders", Icon: Package },
  { href: "cart", label: "Cart", Icon: ShoppingBag },
  { href: "/account", label: "Account", Icon: UserRound },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useShop();
  if (pathname.startsWith("/admin")) return null;

  return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/70 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
    <ul className="mx-auto grid h-[62px] w-full max-w-lg list-none grid-cols-5 items-stretch p-0">
      {NAV.map(({ href, label, Icon }) => {
        const active = href === "cart" ? false : href === "/" ? pathname === "/" : href === "/categories" ? pathname.startsWith("/categories") || pathname.startsWith("/shop") : href === "/account" ? pathname === "/account" : pathname === href || pathname.startsWith(`${href}/`);
        const content = <><span className="relative"><Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />{href === "cart" && cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-obsidian">{cartCount > 9 ? "9+" : cartCount}</span>}</span><span className="text-[10px] font-semibold leading-none">{label}</span></>;
        const classes = `flex h-full w-full flex-col items-center justify-center gap-1 px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest ${active ? "text-forest" : "text-stone active:text-forest"}`;
        return <li key={label} className="min-w-0">{href === "cart" ? <button type="button" onClick={() => setIsCartOpen(true)} className={classes} aria-label={`Open cart, ${cartCount} items`}>{content}</button> : <Link href={href} className={classes} aria-current={active ? "page" : undefined}>{content}</Link>}</li>;
      })}
    </ul>
  </nav>;
}
