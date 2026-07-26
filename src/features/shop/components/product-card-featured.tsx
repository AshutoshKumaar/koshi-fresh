"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types/shop";
import { cn } from "@/utils/cn";
import { Price } from "./price";
import { Rating } from "./rating";
import { VariantSelector } from "./variant-selector";
import { QuantitySelector } from "./quantity-selector";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useShop } from "@/context/shop-context";
import Image from "next/image";

export interface ProductCardFeaturedProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  disabled?: boolean;
}

export function ProductCardFeatured({
  className,
  product,
  disabled = false,
  ...props
}: ProductCardFeaturedProps) {
  const { cartCount, setCartCount } = useShop();
  const [selectedVariantId, setSelectedVariantId] = React.useState(product.variants[0].id);
  const [quantity, setQuantity] = React.useState(1);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const handleAddToCart = () => {
    setCartCount(cartCount + quantity);
    toast({
      variant: "success",
      title: "Added to Bag",
      description: `Added ${quantity}x ${product.name} (${selectedVariant.weight}) to your cart.`,
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-sand bg-white shadow-premium-md overflow-hidden grid md:grid-cols-12 gap-6 items-center p-6 md:p-8",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Editorial Sizing Column */}
      <div className="md:col-span-5 bg-sand/20 rounded-xl aspect-square flex items-center justify-center select-none md:h-full min-h-[250px] overflow-hidden">
        {product.images[0].startsWith("/") ? (
          <Image src={product.images[0]} alt={product.name} width={500} height={500} className="w-full h-full object-contain p-6" />
        ) : (
          <span className="text-[120px]">{product.images[0]}</span>
        )}
      </div>

      {/* Buying Module Column */}
      <div className="md:col-span-7 space-y-5">
        <div>
          <span className="font-label-premium text-gold block mb-2">
            Flagship Arrival
          </span>
          <Link href={`/product/${product.slug}`}>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-forest leading-tight hover:underline">
              {product.name}
            </h2>
          </Link>
          <p className="font-body-premium text-charcoal/80 mt-2">
            {product.description}
          </p>
        </div>

        <Rating rating={product.rating} reviewsCount={product.reviewsCount} />

        <Price price={selectedVariant.price} originalPrice={selectedVariant.originalPrice} size="lg" />

        <Separator />

        {/* Variant Selector */}
        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onChange={setSelectedVariantId}
        />

        {/* Quantity and Actions */}
        <div className="flex flex-wrap gap-4 items-end pt-2">
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
          
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant.inStock}
            className="flex-1 min-w-[200px]"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Bag
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsFavorite(!isFavorite)}
            className="h-11 w-11 p-0 shrink-0"
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-feedback-error text-feedback-error")} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Inline Separator mock helper to prevent undefined exports
function Separator() {
  return <div className="h-[1px] w-full bg-sand/80 my-4" />;
}
