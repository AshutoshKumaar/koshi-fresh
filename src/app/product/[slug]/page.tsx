"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";
import { Price } from "@/features/shop/components/price";
import { Rating } from "@/features/shop/components/rating";
import { VariantSelector } from "@/features/shop/components/variant-selector";
import { QuantitySelector } from "@/features/shop/components/quantity-selector";
import { TrustBadge, DeliveryBadge } from "@/features/shop/components/commerce-badges";
import { ProductCardRecommendation } from "@/features/shop/components/product-card-recommendation";
import { useShop } from "@/context/shop-context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { ShieldCheck, Award, Heart, ArrowLeft, Truck, RefreshCw, CheckCircle2 } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const { cartCount, setCartCount, wishlistCount, setWishlistCount, setIsCartOpen } = useShop();

  const [selectedVariant, setSelectedVariant] = React.useState(product.variants[0]);
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [product]);

  const handleAddToCart = () => {
    setCartCount(cartCount + quantity);
    toast({
      title: "Added to Bag",
      description: `${quantity}x ${product.name} (${selectedVariant.weight}) added to your shopping bag.`,
    });
  };

  const handleBuyNow = () => {
    setCartCount(cartCount + quantity);
    router.push("/checkout");
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      setIsWishlisted(false);
      setWishlistCount(Math.max(0, wishlistCount - 1));
      toast({ title: "Removed from Favorites" });
    } else {
      setIsWishlisted(true);
      setWishlistCount(wishlistCount + 1);
      toast({ title: "Added to Favorites", description: `${product.name} saved.` });
    }
  };

  const relatedProducts = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="pt-24 pb-20 bg-sand/10 min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-sans text-stone hover:text-forest transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop Catalog
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="bg-white rounded-3xl border border-sand/60 shadow-premium-md p-6 sm:p-10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left Column: Product Image & Badges */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl bg-sand/30 overflow-hidden border border-sand/50 shadow-premium-sm">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.badges && product.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {product.badges.map((badge) => (
                      <span key={badge} className="px-3 py-1 rounded-full bg-forest/90 text-ivory text-[10px] font-sans font-bold uppercase tracking-wider backdrop-blur-xs shadow-premium-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sourcing Guarantee Card */}
              <div className="p-4 rounded-xl bg-forest/5 border border-forest/15 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                <div className="text-xs font-sans">
                  <span className="font-bold text-forest block mb-0.5">100% Sourcing Authenticity</span>
                  <p className="text-stone/80 font-light leading-relaxed">{product.sourcing}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Price, Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest font-sans font-bold text-forest">
                    {product.category}
                  </span>
                  <Rating rating={product.rating} reviewsCount={product.reviewsCount} />
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-stone text-sm sm:text-base font-light leading-relaxed">
                  {product.subtitle}
                </p>
              </div>

              {/* Price & Savings */}
              <div className="py-2 border-y border-sand/50 flex items-center justify-between">
                <Price price={selectedVariant.price} originalPrice={selectedVariant.originalPrice} size="lg" />
                {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                  <span className="text-xs font-sans font-bold text-feedback-success bg-feedback-success/10 px-2.5 py-1 rounded-full">
                    Save ₹{selectedVariant.originalPrice - selectedVariant.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-charcoal/90 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Weight Variant Selector */}
              <div className="space-y-2">
                <VariantSelector
                  variants={product.variants}
                  selectedVariantId={selectedVariant.id}
                  onChange={(id) => setSelectedVariant(product.variants.find((v) => v.id === id) || product.variants[0])}
                />
              </div>

              {/* Quantity Picker & Primary Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-32 shrink-0">
                    <QuantitySelector quantity={quantity} onChange={setQuantity} />
                  </div>
                  <button
                    onClick={toggleWishlist}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      isWishlisted
                        ? "border-feedback-error bg-feedback-error/10 text-feedback-error"
                        : "border-sand bg-white hover:bg-sand/30 text-stone"
                    }`}
                    aria-label="Wishlist product"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-feedback-error" : ""}`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    size="lg"
                    className="w-full font-sans font-bold h-12 text-sm rounded-xl border-forest text-forest hover:bg-forest/5 cursor-pointer"
                  >
                    Add to Shopping Bag
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="primary"
                    size="lg"
                    className="w-full font-sans font-bold h-12 text-sm rounded-xl bg-forest hover:bg-forest-light text-white shadow-premium-md cursor-pointer"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Commerce Features & Delivery Guarantee */}
              <div className="pt-4 border-t border-sand/50 flex flex-wrap gap-2">
                <TrustBadge>NABL Lab Tested</TrustBadge>
                <DeliveryBadge>Free Delivery Across India</DeliveryBadge>
              </div>
            </div>
          </div>

          {/* Nutritional Breakdown Table */}
          {product.nutritionalInfo && (
            <div className="mt-12 pt-8 border-t border-sand/60">
              <h3 className="font-serif text-xl font-bold text-obsidian mb-4">
                Nutritional Profile (per 100g)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-sand/20 border border-sand/50 text-center">
                  <span className="text-xs text-stone font-sans block mb-1">Calories</span>
                  <span className="text-base font-sans font-bold text-forest">{product.nutritionalInfo.calories}</span>
                </div>
                <div className="p-4 rounded-2xl bg-sand/20 border border-sand/50 text-center">
                  <span className="text-xs text-stone font-sans block mb-1">Protein</span>
                  <span className="text-base font-sans font-bold text-forest">{product.nutritionalInfo.protein}</span>
                </div>
                <div className="p-4 rounded-2xl bg-sand/20 border border-sand/50 text-center">
                  <span className="text-xs text-stone font-sans block mb-1">Healthy Fat</span>
                  <span className="text-base font-sans font-bold text-forest">{product.nutritionalInfo.fat}</span>
                </div>
                <div className="p-4 rounded-2xl bg-sand/20 border border-sand/50 text-center">
                  <span className="text-xs text-stone font-sans block mb-1">Dietary Fiber</span>
                  <span className="text-base font-sans font-bold text-forest">{product.nutritionalInfo.fiber}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Products */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian mb-6">
            You Might Also Enjoy
          </h2>
          <div className="space-y-4">
            {relatedProducts.map((relProduct) => (
              <ProductCardRecommendation key={relProduct.slug} product={relProduct} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
