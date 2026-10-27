"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowRight, Grid, CheckCircle2 } from "lucide-react";
import { PRODUCTS } from "@/data/products";

export default function CategoriesPage() {
  const categoriesList = [
    {
      id: "makhana",
      title: "Makhana",
      subtitle: "Koshi Fresh Makhana, Madhur Phool Makhana, and Krishna Phool Makhana",
      badge: "3 Renuka Enterprises Brands",
      image: "/category-makhana.webp",
      placeholder: "🌾",
      href: "/shop/makhana",
      highlights: ["Koshi Fresh Makhana", "Madhur Phool Makhana", "Krishna Phool Makhana", "Raw & roasted options"]
    },
    {
      id: "flour",
      title: "Flour & Powder",
      subtitle: "Makhana Powder and Makhana and Wheat Mix Powder",
      badge: "Makhana Powder",
      image: "/category-flour-powder.webp",
      placeholder: "🥣",
      href: "/shop/flour",
      highlights: ["Makhana Powder", "Makhana and Wheat Mix Powder", "Flour products", "From Renuka Enterprises"]
    },
    {
      id: "chocolate",
      title: "Chocolate",
      subtitle: "Homemade chocolate concepts from Renuka Enterprises",
      badge: "Homemade · Coming Soon",
      image: "/category-chocolate.webp",
      placeholder: "🍫",
      href: "/shop/chocolate",
      highlights: ["Mithila Cocoa", "Koshi Choco Bites", "Makhana Crunch", "Renuka Homemade · concept names"]
    },
    {
      id: "dry-fruits",
      title: "Nuts and Dry Fruits",
      subtitle: "Kaju, kishmish, almonds, pistachios, walnuts, dates and more",
      badge: "More Products Coming Soon",
      image: "/category-nuts-dry-fruits.webp",
      placeholder: "🥜",
      href: "/shop/dry-fruits",
      highlights: ["Kaju / Cashews", "Kishmish / Raisins", "Almonds & pistachios", "Walnuts, dates and more"]
    }
  ];

  return (
    <div className="bg-sand/10 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory pt-20 md:pt-32 pb-8 md:pb-20 mb-5 md:mb-12">
        <Container>
          <div className="max-w-3xl text-center mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              <Grid className="h-3.5 w-3.5" /> Product Categories
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Shop by Category
            </h1>
            <p className="text-ivory/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Shop three makhana brands, flour and makhana powder, homemade chocolate, and dry fruits from Renuka Enterprises.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categoriesList.map((cat) => {
            const itemCount = PRODUCTS.filter((product) => product.category === cat.id).length;
            return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-sand/60 overflow-hidden shadow-premium-sm hover:shadow-premium-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/9 w-full bg-sand/30 overflow-hidden">
                  {cat.image ? <Image src={cat.image} alt={cat.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="grid h-full place-items-center bg-gradient-to-br from-forest/10 via-sand/40 to-gold/10 text-6xl" aria-hidden="true">{cat.placeholder}</div>}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-forest/90 text-ivory text-[10px] font-sans font-bold uppercase tracking-wider backdrop-blur-xs">
                      {itemCount ? cat.badge : "Coming Soon"}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-sans font-medium backdrop-blur-md">
                      {itemCount ? `${itemCount} ${itemCount === 1 ? "product" : "products"}` : "Coming soon"}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-obsidian group-hover:text-forest transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-stone text-xs sm:text-sm font-light leading-relaxed mt-1">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sand/40">
                    {cat.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-charcoal font-sans font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-forest shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                <Link
                  href={cat.href}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-forest hover:bg-forest-light text-white font-sans font-bold text-xs rounded-xl shadow-premium-sm transition-all"
                >
                  {itemCount ? `Explore ${cat.title}` : `View ${cat.title}`} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
