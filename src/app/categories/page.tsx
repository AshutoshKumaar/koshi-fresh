"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Sparkles, ArrowRight, Grid, Award, CheckCircle2 } from "lucide-react";

export default function CategoriesPage() {
  const categoriesList = [
    {
      id: "raw-makhana",
      title: "Raw Foxnuts & Makhana",
      subtitle: "Sun-dried 9mm+ jumbo foxnuts sourced straight from Mithila ponds",
      badge: "Direct Farm Co-op",
      image: "/hero-makhana-bowl.jpg",
      href: "/shop/raw-makhana",
      itemCount: "4 Products",
      highlights: ["9mm+ Jumbo Grade", "100% Sun-Dried", "Zero Bleach", "High Calcium & Protein"]
    },
    {
      id: "roasted-makhana",
      title: "Ghee Roasted Makhana",
      subtitle: "Slow-roasted crispy foxnuts in organic A2 cow ghee with pink salt",
      badge: "Clean Label",
      image: "/hero-gourmet-spices-bg.jpg",
      href: "/shop/roasted-makhana",
      itemCount: "6 Flavors",
      highlights: ["Pure A2 Cow Ghee", "Pink Himalayan Salt", "No Preservatives", "Zero Trans Fat"]
    },
    {
      id: "dry-fruits",
      title: "Premium Dry Fruits",
      subtitle: "Handpicked jumbo cashews, California almonds, and walnuts",
      badge: "AI Studio Quality",
      image: "/roasted-cashews-studio.jpg",
      href: "/shop/dry-fruits",
      itemCount: "8 Products",
      highlights: ["W240 Jumbo Cashews", "California Almonds", "Rich in Vitamin E", "Antioxidant Dense"]
    },
    {
      id: "seeds",
      title: "Nutrient Rich Seeds",
      subtitle: "Raw & roasted flax, chia, pumpkin, and sunflower seed blends",
      badge: "Superfood Blend",
      image: "/almonds-seeds-collection.jpg",
      href: "/shop/seeds",
      itemCount: "5 Blends",
      highlights: ["Omega-3 Fatty Acids", "High Fiber", "Plant Protein", "Keto Friendly"]
    }
  ];

  return (
    <div className="bg-sand/10 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory pt-28 md:pt-32 pb-16 md:pb-20 mb-12">
        <Container>
          <div className="max-w-3xl text-center mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              <Grid className="h-3.5 w-3.5" /> Product Categories
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Explore Our Organic Collections
            </h1>
            <p className="text-ivory/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Hand-sorted jumbo foxnuts, premium dry fruits, and nutrient-dense superfood seeds straight from Madhubani, Bihar.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categoriesList.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-sand/60 overflow-hidden shadow-premium-sm hover:shadow-premium-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/9 w-full bg-sand/30 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-forest/90 text-ivory text-[10px] font-sans font-bold uppercase tracking-wider backdrop-blur-xs">
                      {cat.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-sans font-medium backdrop-blur-md">
                      {cat.itemCount}
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
                  Explore {cat.title} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
