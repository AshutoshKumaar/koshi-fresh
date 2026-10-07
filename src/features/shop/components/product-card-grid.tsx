"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types/shop";
import { cn } from "@/utils/cn";
import { Price } from "./price";
import { Rating } from "./rating";
import { toast } from "@/components/ui/toast";
import { useShop } from "@/context/shop-context";

export interface ProductCardGridProps extends React.HTMLAttributes<HTMLDivElement> { product: Product; disabled?: boolean }

export function ProductCardGrid({ className, product, disabled = false, ...props }: ProductCardGridProps) {
  const { addToCart, wishlistCount, setWishlistCount } = useShop();
  const [selectedVariantIdx, setSelectedVariantIdx] = React.useState(0);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const selectedVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const discountPercent = selectedVariant.originalPrice ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100) : null;

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.preventDefault(); event.stopPropagation();
    setIsFavorite(!isFavorite);
    setWishlistCount(isFavorite ? Math.max(0, wishlistCount - 1) : wishlistCount + 1);
    toast({ variant: "success", title: isFavorite ? "Removed from Favorites" : "Added to Favorites", description: `${product.name} has been updated in your wishlist.` });
  };
  const handleAddToCart = () => {
    addToCart(product.slug, selectedVariant.id);
    toast({ variant: "success", title: "Added to Cart", description: `Added 1x ${product.name} (${selectedVariant.weight}) for ₹${selectedVariant.price}.` });
  };

  return <article className={cn("group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-sand/70 bg-white shadow-premium-sm transition-all duration-300 md:rounded-3xl md:hover:-translate-y-1 md:hover:border-forest/30 md:hover:shadow-premium-md", disabled && "pointer-events-none opacity-50", className)} {...props}>
    <div className="relative aspect-square w-full overflow-hidden bg-ivory/50">
      <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={`View ${product.name}`}>
        <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 767px) 45vw, (max-width: 1279px) 30vw, 280px" className="object-contain p-2 transition-transform duration-500 lg:object-cover lg:p-0 lg:group-hover:scale-105" />
      </Link>
      <button type="button" onClick={handleToggleFavorite} aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`} aria-pressed={isFavorite} className={cn("absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-obsidian shadow-premium-sm transition-colors hover:text-feedback-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest md:right-3 md:top-3", isFavorite && "fill-red-500 text-red-500")}><Heart className="h-4 w-4" /></button>
      {discountPercent !== null && discountPercent > 0 && <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-obsidian shadow-premium-sm md:left-3 md:top-3 md:px-2.5 md:text-[10px]">{discountPercent}% OFF</span>}
      <button type="button" onClick={handleAddToCart} disabled={!selectedVariant.inStock} className="absolute bottom-2 left-2 right-2 z-10 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-forest text-[11px] font-bold text-white shadow-premium-md transition-colors hover:bg-forest-light active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40 md:bottom-3 md:left-3 md:right-3 md:h-11 md:text-xs lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100"><ShoppingBag className="h-4 w-4" />Add to Cart</button>
    </div>
    <div className="flex flex-1 flex-col justify-between gap-2 p-3 md:gap-3 md:p-5">
      <div className="min-w-0"><div className="mb-1 flex items-center justify-between gap-1"><span className="truncate text-[9px] font-bold uppercase tracking-wider text-gold md:text-[10px] md:tracking-widest">{product.category}</span>{product.badges[0] && <span className="hidden shrink-0 rounded-full border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-emerald-700 sm:inline-flex">{product.badges[0]}</span>}</div>
        <Link href={`/product/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"><h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-obsidian transition-colors group-hover:text-forest md:text-base">{product.name}</h3><p className="mt-0.5 hidden line-clamp-2 text-xs leading-relaxed text-stone sm:block">{product.subtitle}</p></Link>
      </div>
      <div><div className="mb-2 flex items-center gap-1.5 md:mb-3 md:gap-2"><Rating rating={product.rating} showText={false} /><span className="text-[10px] text-stone">{product.rating.toFixed(1)} ({product.reviewsCount})</span></div>
        <div className="-mx-1 mb-2 flex items-center gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:mb-3 md:gap-1.5 md:overflow-visible md:px-0">{product.variants.map((variant, index) => <button key={variant.id} type="button" onClick={() => setSelectedVariantIdx(index)} aria-pressed={selectedVariantIdx === index} className={cn("min-h-9 shrink-0 rounded-lg border px-2 text-[10px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest md:min-h-8 md:px-2.5", selectedVariantIdx === index ? "border-forest bg-forest text-white shadow-premium-sm" : "border-sand bg-sand/20 text-charcoal hover:bg-sand/50")}>{variant.weight}</button>)}</div>
        <div className="flex min-w-0 items-center justify-between gap-1 border-t border-sand/40 pt-2"><Price price={selectedVariant.price} originalPrice={selectedVariant.originalPrice} size="sm" className="min-w-0" /><span className="hidden shrink-0 rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 sm:inline-flex">In Stock</span></div>
      </div>
    </div>
  </article>;
}
