"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types/shop";
import { cn } from "@/utils/cn";
import { Price } from "./price";
import { Rating } from "./rating";
import { toast } from "@/components/ui/toast";
import { useShop } from "@/context/shop-context";
import Image from "next/image";

export interface ProductCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  disabled?: boolean;
}

export function ProductCardGrid({
  className,
  product,
  disabled = false,
  ...props
}: ProductCardGridProps) {
  const { cartCount, setCartCount, wishlistCount, setWishlistCount } = useShop();
  const [selectedVariantIdx, setSelectedVariantIdx] = React.useState(0);
  const selectedVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const [isFavorite, setIsFavorite] = React.useState(false);

  const discountPercent = selectedVariant.originalPrice
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : null;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setWishlistCount(isFavorite ? Math.max(0, wishlistCount - 1) : wishlistCount + 1);
    toast({
      variant: "success",
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${product.name} has been updated in your wishlist.`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCartCount(cartCount + 1);
    toast({
      variant: "success",
      title: "Added to Cart",
      description: `Added 1x ${product.name} (${selectedVariant.weight}) for ₹${selectedVariant.price}.`,
    });
  };

  return (
    <div
      className={cn(
        "group relative rounded-3xl border border-sand/70 bg-white shadow-premium-sm overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:border-forest/30 hover:-translate-y-1.5",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Product Image Showcase Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full bg-ivory/50 overflow-hidden">
        {/* Favorite Icon Toggle */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md shadow-premium-sm text-obsidian hover:text-feedback-error transition-all scale-90 group-hover:scale-100 cursor-pointer flex items-center justify-center border border-white/40",
            isFavorite && "text-red-500 fill-red-500"
          )}
          aria-label="Toggle favorite"
        >
          <Heart className="h-4 w-4 stroke-[1.8]" />
        </button>

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute left-3 top-3 z-10">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-gold text-obsidian px-2.5 py-1 rounded-full shadow-premium-sm">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* High Resolution Product Studio Photo */}
        <div className="absolute inset-0 flex items-center justify-center select-none group-hover:scale-108 transition-transform duration-700">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant.inStock}
            className="flex-1 h-10 bg-forest text-ivory hover:bg-forest-light text-xs font-sans font-bold rounded-xl shadow-premium-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toast({ title: "Quick View", description: `Viewing details for ${product.name}` });
            }}
            className="h-10 w-10 bg-white/90 backdrop-blur-md text-obsidian hover:bg-white text-xs rounded-xl shadow-premium-md flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/40"
            aria-label="Quick View"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </Link>

      {/* Card Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold font-bold font-sans">
              {product.category}
            </span>
            {product.badges[0] && (
              <span className="text-[9px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                {product.badges[0]}
              </span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-base font-serif font-bold text-obsidian line-clamp-1 group-hover:text-forest transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-stone font-sans font-light line-clamp-2 leading-relaxed mt-0.5">
              {product.subtitle}
            </p>
          </Link>
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <Rating rating={product.rating} showText={false} />
            <span className="text-[11px] font-sans text-stone">({product.reviewsCount} reviews)</span>
          </div>

          {/* Interactive Weight Selector Pills */}
          <div className="flex items-center gap-1.5 mb-3">
            {product.variants.map((variant, vIdx) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantIdx(vIdx)}
                className={cn(
                  "text-[10px] font-sans font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer",
                  selectedVariantIdx === vIdx
                    ? "bg-forest text-ivory border-forest shadow-premium-sm"
                    : "bg-sand/20 border-sand text-charcoal hover:bg-sand/50"
                )}
              >
                {variant.weight}
              </button>
            ))}
          </div>

          {/* Price Tag */}
          <div className="flex items-center justify-between pt-2 border-t border-sand/40">
            <Price price={selectedVariant.price} originalPrice={selectedVariant.originalPrice} size="md" />
            <span className="text-[10px] font-sans font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
