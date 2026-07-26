"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "@/components/ui/toast";

// Commerce elements
import { PRODUCTS } from "@/data/products";
import { Price } from "@/features/shop/components/price";
import { Rating } from "@/features/shop/components/rating";
import { VariantSelector } from "@/features/shop/components/variant-selector";
import { QuantitySelector } from "@/features/shop/components/quantity-selector";
import {
  OfferBadge,
  StockBadge,
  DeliveryBadge,
  TrustBadge,
  CouponBadge,
} from "@/features/shop/components/commerce-badges";

// Product Card variants
import { ProductCardGrid } from "@/features/shop/components/product-card-grid";
import { ProductCardCompact } from "@/features/shop/components/product-card-compact";
import { ProductCardFeatured } from "@/features/shop/components/product-card-featured";
import { ProductCardHorizontal } from "@/features/shop/components/product-card-horizontal";
import { ProductCardRecommendation } from "@/features/shop/components/product-card-recommendation";

export default function CommercePreviewPage() {
  const mockProduct = PRODUCTS[0];
  const secondaryProduct = PRODUCTS[1];
  const [selectedVariantId, setSelectedVariantId] = React.useState(mockProduct.variants[0].id);
  const [qty, setQty] = React.useState(2);
  const [horizontalQty, setHorizontalQty] = React.useState(1);

  return (
    <Section size="md" className="bg-ivory min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="mb-12 border-b border-sand pb-6">
          <span className="font-label-premium text-gold mb-2 block">
            Koshi Fresh Showcase
          </span>
          <h1 className="text-4xl md:text-5xl text-forest font-serif leading-tight">
            Reusable Commerce UI
          </h1>
          <p className="font-body-premium text-charcoal/80 mt-2 max-w-xl">
            Previewing all product displays, variant selectors, price formats, and status labels.
          </p>
        </div>

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="mb-8 w-full justify-start overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="cards">Product Card Variants</TabsTrigger>
            <TabsTrigger value="ui">Commerce UI Primitives</TabsTrigger>
          </TabsList>

          {/* ================= PRODUCT CARDS TAB ================= */}
          <TabsContent value="cards" className="space-y-12">
            
            {/* 1. Grid Cards */}
            <Card>
              <CardHeader>
                <CardTitle>ProductCardGrid</CardTitle>
                <CardDescription>
                  Standard 1:1 display card with hover-reveal Quick Add triggers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans text-stone font-semibold uppercase">Default State</span>
                    <ProductCardGrid product={mockProduct} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans text-stone font-semibold uppercase">Disabled State</span>
                    <ProductCardGrid product={mockProduct} disabled />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans text-stone font-semibold uppercase">Loading / Skeleton State</span>
                    <div className="rounded-2xl border border-sand bg-white p-4 space-y-4 shadow-premium-sm">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-6 w-[80px]" />
                        <Skeleton className="h-5 w-[50px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Featured Cards */}
            <Card>
              <CardHeader>
                <CardTitle>ProductCardFeatured</CardTitle>
                <CardDescription>
                  Split layout suitable for homepage hero highlights and best sellers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Default State</span>
                  <ProductCardFeatured product={mockProduct} />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Disabled State</span>
                  <ProductCardFeatured product={mockProduct} disabled />
                </div>
              </CardContent>
            </Card>

            {/* 3. Compact & Recommendation Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>ProductCardCompact</CardTitle>
                  <CardDescription>
                    Small display used inside header search rows and mini drawers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Default State</span>
                    <ProductCardCompact product={mockProduct} onRemove={() => toast({ title: "Removed", description: "Item removed from favorites." })} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Disabled State</span>
                    <ProductCardCompact product={mockProduct} disabled />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ProductCardRecommendation</CardTitle>
                  <CardDescription>
                    Recommendation add-ons with quick checkbox triggers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Default State</span>
                    <ProductCardRecommendation product={secondaryProduct} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Disabled State</span>
                    <ProductCardRecommendation product={secondaryProduct} disabled />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 4. Horizontal Cards */}
            <Card>
              <CardHeader>
                <CardTitle>ProductCardHorizontal</CardTitle>
                <CardDescription>
                  Cart checklist rows supporting interactive quantity selectors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Default State</span>
                  <ProductCardHorizontal
                    product={mockProduct}
                    quantity={horizontalQty}
                    onQuantityChange={setHorizontalQty}
                    onRemove={() => toast({ title: "Remove Triggered", description: "Mock item deleted." })}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-sans text-stone font-semibold uppercase block">Disabled State</span>
                  <ProductCardHorizontal
                    product={mockProduct}
                    quantity={1}
                    onQuantityChange={() => {}}
                    onRemove={() => {}}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* ================= COMMERCE UI TAB ================= */}
          <TabsContent value="ui" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Commerce Sub-Components</CardTitle>
                <CardDescription>
                  Formats, tags, variant buttons, and quantity selection widgets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 1. Price Formatter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-sans font-semibold text-obsidian">Price Primitives</h4>
                  <div className="flex flex-wrap gap-6 items-end">
                    <div className="space-y-1">
                      <span className="text-[9px] font-sans text-stone uppercase block">Small Size</span>
                      <Price price={299} originalPrice={349} size="sm" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-sans text-stone uppercase block">Medium Size</span>
                      <Price price={549} originalPrice={699} size="md" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-sans text-stone uppercase block">Large Size</span>
                      <Price price={999} originalPrice={1299} size="lg" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 2. Rating Star Display */}
                <div className="space-y-3">
                  <h4 className="text-sm font-sans font-semibold text-obsidian">Ratings & Review Metrics</h4>
                  <div className="flex flex-wrap gap-8 items-center">
                    <div className="space-y-1">
                      <span className="text-[9px] font-sans text-stone uppercase block">Display With Count</span>
                      <Rating rating={4.8} reviewsCount={142} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-sans text-stone uppercase block">Stars Only</span>
                      <Rating rating={4.5} showText={false} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 3. Variant Selectors */}
                <div className="space-y-3">
                  <h4 className="text-sm font-sans font-semibold text-obsidian">Variant Selection Pills</h4>
                  <VariantSelector
                    variants={mockProduct.variants}
                    selectedVariantId={selectedVariantId}
                    onChange={setSelectedVariantId}
                  />
                  <VariantSelector
                    variants={mockProduct.variants}
                    selectedVariantId={selectedVariantId}
                    onChange={setSelectedVariantId}
                    disabled
                    className="opacity-50 pt-2"
                  />
                </div>

                <Separator />

                {/* 4. Quantity Adjusters */}
                <div className="space-y-3">
                  <h4 className="text-sm font-sans font-semibold text-obsidian">Quantity Selector Fields</h4>
                  <div className="flex flex-wrap gap-6 items-center">
                    <QuantitySelector quantity={qty} onChange={setQty} />
                    <QuantitySelector quantity={1} onChange={() => {}} disabled className="opacity-50" />
                  </div>
                </div>

                <Separator />

                {/* 5. Commerce Badges */}
                <div className="space-y-4">
                  <h4 className="text-sm font-sans font-semibold text-obsidian">Commerce Badges</h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-sans text-stone uppercase block">Offer Tag</span>
                      <OfferBadge>Save 15%</OfferBadge>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-sans text-stone uppercase block">Stock Indicator</span>
                      <StockBadge inStock={true} stockCount={3} />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-sans text-stone uppercase block">Delivery Standard</span>
                      <DeliveryBadge />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-sans text-stone uppercase block">Trust Certifications</span>
                      <TrustBadge>Gluten Free</TrustBadge>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-sans text-stone uppercase block">Promo Coupon</span>
                      <CouponBadge code="KOSHIFRESH" />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dynamic global Toaster overlay notifications */}
        <Toaster />
      </Container>
    </Section>
  );
}
