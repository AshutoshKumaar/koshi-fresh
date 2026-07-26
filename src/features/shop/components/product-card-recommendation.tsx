"use client";

import * as React from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/shop";
import { cn } from "@/utils/cn";
import { Price } from "./price";
import { Rating } from "./rating";
import { toast } from "@/components/ui/toast";
import { useShop } from "@/context/shop-context";
import Image from "next/image";

export interface ProductCardRecommendationProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  disabled?: boolean;
}

export function ProductCardRecommendation({
  className,
  product,
  disabled = false,
  ...props
}: ProductCardRecommendationProps) {
  const { cartCount, setCartCount } = useShop();
  const [isChecked, setIsChecked] = React.useState(false);
  const selectedVariant = product.variants[0];

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    if (checked) {
      setCartCount(cartCount + 1);
      toast({
        variant: "success",
        title: "Frequently Bought Together",
        description: `Added 1x ${product.name} to bundle.`,
      });
    } else {
      setCartCount(Math.max(0, cartCount - 1));
      toast({
        variant: "info",
        title: "Bundle Updated",
        description: `Removed ${product.name} from bundle.`,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border border-sand bg-white rounded-2xl shadow-premium-sm transition-all hover:border-forest/20",
        isChecked && "border-forest/30 bg-forest/[0.01]",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Bundle Selection Checkbox */}
      <Checkbox
        id={`rec-${product.slug}`}
        checked={isChecked}
        onCheckedChange={handleCheckboxChange}
        className="shrink-0"
      />

      {/* Visual Thumbnail */}
      <Link href={`/product/${product.slug}`} className="h-16 w-16 bg-sand/30 rounded-xl flex items-center justify-center shrink-0 select-none overflow-hidden">
        {product.images[0].startsWith("/") ? (
          <Image src={product.images[0]} alt={product.name} width={100} height={100} className="w-full h-full object-contain p-2" />
        ) : (
          <span className="text-3xl">{product.images[0]}</span>
        )}
      </Link>

      {/* Info details */}
      <div className="flex-1 min-w-0">
        <span className="text-[9px] uppercase tracking-wider text-gold font-semibold font-sans block">
          Add-on Treat
        </span>
        <Link href={`/product/${product.slug}`} className="block hover:underline">
          <h4 className="text-sm font-serif font-medium text-obsidian truncate">
            {product.name}
          </h4>
        </Link>
        <Rating rating={product.rating} showText={false} className="mt-1" />
      </div>

      {/* Pricing display */}
      <div className="text-right shrink-0">
        <span className="text-[10px] font-sans text-stone block">{selectedVariant.weight}</span>
        <Price price={selectedVariant.price} size="sm" showDiscount={false} className="justify-end mt-0.5" />
      </div>
    </div>
  );
}
