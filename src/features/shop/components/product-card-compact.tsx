"use client";

import * as React from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Product, ProductVariant } from "@/types/shop";
import { cn } from "@/utils/cn";
import { Price } from "./price";
import Image from "next/image";

export interface ProductCardCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  variant?: ProductVariant;
  onRemove?: () => void;
  disabled?: boolean;
}

export function ProductCardCompact({
  className,
  product,
  variant,
  onRemove,
  disabled = false,
  ...props
}: ProductCardCompactProps) {
  const selectedVariant = variant || product.variants[0];

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 p-3 rounded-xl border border-sand bg-white shadow-premium-sm transition-all duration-200 hover:border-forest/30",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Small Visual Thumbnail */}
      <Link href={`/product/${product.slug}`} className="h-14 w-14 rounded-lg bg-sand/30 flex items-center justify-center shrink-0 select-none overflow-hidden">
        {product.images[0].startsWith("/") ? (
          <Image src={product.images[0]} alt={product.name} width={80} height={80} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-3xl">{product.images[0]}</span>
        )}
      </Link>

      {/* Product Information */}
      <div className="flex-1 min-w-0">
        <Link href={`/product/${product.slug}`} className="block hover:underline">
          <h4 className="text-sm font-serif font-medium text-obsidian truncate">
            {product.name}
          </h4>
        </Link>
        <span className="text-[10px] font-sans text-stone font-light block">
          Pack: {selectedVariant.weight}
        </span>
        <Price price={selectedVariant.price} originalPrice={selectedVariant.originalPrice} size="sm" className="mt-1" />
      </div>

      {/* Optional removal button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1.5 rounded text-stone hover:text-feedback-error hover:bg-feedback-error/5 transition-colors cursor-pointer shrink-0"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
