"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";
import { ProductCardGrid } from "@/features/shop/components/product-card-grid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.category as string;

  const categoryTitle =
    categorySlug === "raw-makhana" || categorySlug === "makhana"
      ? "Raw & Roasted Makhana"
      : categorySlug === "dry-fruits"
      ? "Premium Dry Fruits"
      : categorySlug === "seeds"
      ? "Nutrient Rich Seeds"
      : "Organic Collection";

  const categoryProducts = PRODUCTS.filter((p) => {
    if (categorySlug === "raw-makhana" || categorySlug === "roasted-makhana" || categorySlug === "makhana") {
      return p.category === "makhana";
    }
    return p.category === categorySlug;
  });

  const displayProducts = categoryProducts.length > 0 ? categoryProducts : PRODUCTS;

  return (
    <div className="pt-24 pb-16 bg-sand/10 min-h-screen">
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-900 text-ivory py-12 md:py-16 mb-10">
        <Container>
          <div className="max-w-3xl">
            <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-sans text-gold-light hover:underline mb-4">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Products
            </Link>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              {categoryTitle}
            </h1>
            <p className="text-ivory/80 text-sm sm:text-base font-light leading-relaxed">
              Handpicked 100% organic produce directly from wetland farming co-ops in Bihar. Tested for purity and nutrient retention.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {displayProducts.map((product) => (
            <ProductCardGrid key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
