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

  const categoryTitles: Record<string, string> = {
    "raw-makhana": "Makhana",
    "roasted-makhana": "Makhana",
    makhana: "Makhana",
    flour: "Flour & Powder",
    chocolate: "Chocolate",
    "dry-fruits": "Nuts and Dry Fruits",
    "madhur-phool-makhana": "Madhur Phool Makhana",
    "krishna-phool-makhana": "Krishna Phool Makhana",
    "koshi-fresh": "Koshi Fresh Makhana",
  };
  const brandSlugs: Record<string, string> = {
    "madhur-phool-makhana": "Madhur Phool Makhana",
    "krishna-phool-makhana": "Krishna Phool Makhana",
    "koshi-fresh": "Koshi Fresh",
  };
  const categoryTitle = categoryTitles[categorySlug] || "Products";
  const selectedBrand = brandSlugs[categorySlug];

  const categoryProducts = PRODUCTS.filter((p) => {
    if (selectedBrand) return p.brand === selectedBrand;
    if (categorySlug === "raw-makhana" || categorySlug === "roasted-makhana" || categorySlug === "makhana") {
      return p.category === "makhana";
    }
    return p.category === categorySlug;
  });

  return (
    <div className="pt-16 pb-12 bg-sand/10 min-h-screen md:pt-24 md:pb-16">
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-900 text-ivory py-12 md:py-16 mb-10">
        <Container>
          <div className="max-w-3xl">
            <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-sans text-gold-light hover:underline mb-4">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Products
            </Link>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              {categoryTitle}
            </h1>
            <p className="text-ivory/80 text-sm sm:text-base font-light leading-relaxed">Products from Renuka Enterprises and its customer-facing brands.</p>
            {categorySlug === "makhana" && <div className="mt-5 flex flex-wrap gap-2">{[{ label: "Koshi Fresh Makhana", slug: "koshi-fresh" }, { label: "Madhur Phool Makhana", slug: "madhur-phool-makhana" }, { label: "Krishna Phool Makhana", slug: "krishna-phool-makhana" }].map((brand) => <Link key={brand.slug} href={`/shop/${brand.slug}`} className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20">{brand.label}</Link>)}</div>}
            {categorySlug === "chocolate" && <div className="mt-5 flex flex-wrap gap-2">{["Mithila Cocoa", "Koshi Choco Bites", "Makhana Crunch", "Renuka Homemade"].map((brand) => <span key={brand} className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">{brand} · coming soon</span>)}</div>}
          </div>
        </Container>
      </div>

      <Container>
        {categoryProducts.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {categoryProducts.map((product) => <ProductCardGrid key={product.slug} product={product} />)}
        </div> : <div className="rounded-2xl border border-sand/70 bg-white p-10 text-center"><p className="font-serif text-xl font-bold text-obsidian">Products coming soon</p><p className="mt-2 text-sm text-stone">We’re preparing this Renuka Enterprises collection.</p><Link className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-forest px-5 text-sm font-semibold text-white" href="/shop">Browse all products</Link></div>}
      </Container>
    </div>
  );
}
