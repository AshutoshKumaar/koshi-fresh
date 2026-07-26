"use client";

import * as React from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Product, ProductVariant } from "@/types/shop";
import { cn } from "@/utils/cn";
import { Price } from "./price";
import { QuantitySelector } from "./quantity-selector";
import Image from "next/image";

export interface ProductCardHorizontalProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ProductCardHorizontal({
  className,
  product,
  variant,
  quantity,
  onQuantityChange,
  onRemove,
  disabled = false,
  ...props
}: ProductCardHorizontalProps) {
  const selectedVariant = variant || product.variants[0];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-sand bg-white rounded-2xl shadow-premium-sm transition-all hover:border-forest/20",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        {/* Visual Thumbnail */}
        <Link href={`/product/${product.slug}`} className="h-20 w-20 bg-sand/30 rounded-xl flex items-center justify-center shrink-0 select-none overflow-hidden">
          {product.images[0].startsWith("/") ? (
            <Image src={product.images[0]} alt={product.name} width={100} height={100} className="w-full h-full object-contain p-2" />
          ) : (
            <span className="text-4xl">{product.images[0]}</span>
          )}
        </Link>

        {/* Product Details */}
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`} className="block hover:underline">
            <h4 className="text-base font-serif font-medium text-obsidian">
              {product.name}
            </h4>
          </Link>
          <span className="text-xs text-stone font-sans font-light block">
            Variant: {selectedVariant.weight}
          </span>
          <Price price={selectedVariant.price} originalPrice={selectedVariant.originalPrice} size="sm" />
        </div>
      </div>

      {/* Quantity & Price calculations */}
      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-sand/40">
        <QuantitySelector quantity={quantity} onChange={onQuantityChange} className="space-y-0" />
        
        {/* Calculated Total Price */}
        <div className="text-right min-w-[70px]">
          <span className="text-xs text-stone font-sans block">Total</span>
          <span className="text-base font-sans font-semibold text-forest">
            ₹{selectedVariant.price * quantity}
          </span>
        </div>

        {/* Remove Trigger */}
        <button
          onClick={onRemove}
          className="p-2 text-stone hover:text-feedback-error hover:bg-feedback-error/5 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
