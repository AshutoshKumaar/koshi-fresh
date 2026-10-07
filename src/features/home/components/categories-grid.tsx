"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

const CATEGORIES = [
  {
    title: "Premium Makhana",
    subtitle: "Sun-dried 9mm+ jumbo foxnuts sourced straight from Mithila",
    slug: "makhana",
    image: "/hero-makhana-bowl.jpg",
    span: "lg:col-span-7",
    tag: "✨ Best Seller",
    itemsCount: "12 Pack Sizes",
    badgeBg: "bg-gold/20 text-gold-light border-gold/40",
  },
  {
    title: "California Almonds",
    subtitle: "Raw jumbo crunchy almonds, rich in Vitamin E & antioxidants",
    slug: "dry-fruits",
    image: "/almonds-seeds-collection.jpg",
    span: "lg:col-span-5",
    tag: "🌰 Jumbo Grade",
    itemsCount: "8 Varieties",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  },
  {
    title: "Organic Seeds",
    subtitle: "Unrefined chia, flax & pumpkin seeds for smoothie bowls",
    slug: "seeds",
    image: "/hero-gourmet-spices-bg.jpg",
    span: "lg:col-span-4",
    tag: "⚡ Superfood",
    itemsCount: "6 Selections",
    badgeBg: "bg-sky-500/20 text-sky-300 border-sky-400/30",
  },
  {
    title: "Dry Fruits & Nuts",
    subtitle: "Hand-sorted cashews, walnuts & Iranian pistachios",
    slug: "dry-fruits",
    image: "/hero-golden-harvest-bg.jpg",
    span: "lg:col-span-4",
    tag: "🌾 100% Organic",
    itemsCount: "10 Varieties",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  },
  {
    title: "Curated Gift Boxes",
    subtitle: "Handcrafted luxury festive hampers & organic corporate gifts",
    slug: "gift-boxes",
    image: "/gift-box-collection.jpg",
    span: "lg:col-span-4",
    tag: "🎁 Festive Collection",
    itemsCount: "5 Gift Sets",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/30",
  },
];

export function CategoriesGrid() {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const FILTERS = [
    { id: "all", label: "All Categories" },
    { id: "makhana", label: "Makhana" },
    { id: "dry-fruits", label: "Almonds & Nuts" },
    { id: "seeds", label: "Chia Seeds" },
    { id: "gift-boxes", label: "Gift Boxes" },
  ];

  return (
    <section id="categories" className="w-full bg-white py-8 md:py-24 border-t border-sand/50">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-5 md:mb-12 gap-4 md:gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-sans font-bold uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Curated Wellness Catalog
            </span>
            <h2 className="font-section-title text-forest text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Featured Categories
            </h2>
            <p className="hidden md:block font-body-premium text-charcoal/80 mt-3 text-base font-light leading-relaxed">
              Hand-harvested in the pristine wetlands of Bihar, processed naturally, and delivered fresh to your kitchen.
            </p>
          </div>

          {/* Quick Filter Bar */}
          <div className="-mx-4 flex w-[calc(100%+2rem)] snap-x gap-2 overflow-x-auto px-4 pb-2 pt-1 md:mx-0 md:w-auto md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-xs font-sans font-semibold transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                  activeFilter === f.id
                    ? "bg-forest text-ivory shadow-premium-sm"
                    : "bg-sand/30 border border-sand hover:bg-sand/60 text-charcoal"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Category Cards Grid */}
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-12">
          {CATEGORIES.filter((c) => activeFilter === "all" || c.slug === activeFilter).map((cat, idx) => (
            <Link
              key={idx}
              href={`/shop/${cat.slug}`}
              className={`group relative h-[230px] w-[82vw] max-w-[340px] shrink-0 snap-start rounded-2xl overflow-hidden shadow-premium-md border border-sand/60 sm:h-[300px] md:h-[320px] md:w-auto md:max-w-none md:rounded-3xl ${cat.span} block transition-all duration-300 hover:shadow-2xl hover:border-forest/40`}
            >
              {/* Category Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover object-center transition-transform duration-500 md:group-hover:scale-105"
              />

              {/* Rich Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest-dark/50 to-black/20 group-hover:from-forest-dark transition-colors duration-500" />

              {/* Top Card Header */}
              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 md:top-5 md:left-5 md:right-5">
                <span className={`inline-flex items-center px-3.5 py-1 rounded-full backdrop-blur-md text-xs font-sans font-bold uppercase tracking-wider border ${cat.badgeBg}`}>
                  {cat.tag}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[11px] font-sans font-medium border border-white/20">
                  {cat.itemsCount}
                </span>
              </div>

              {/* Bottom Card Footer */}
              <div className="absolute bottom-4 left-4 right-4 z-10 md:bottom-6 md:left-6 md:right-6">
                <div className="flex items-end justify-between gap-4">
                  <div className="max-w-[80%]">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-gold-light transition-colors leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-sans text-white/80 mt-1.5 line-clamp-2 leading-relaxed font-light">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-gold group-hover:text-obsidian group-hover:border-gold transition-all duration-300 shadow-premium-sm shrink-0">
                    <ArrowUpRight className="h-6 w-6 stroke-[2]" />
                  </div>
                </div>

                {/* Subtle Hover Reveal CTA */}
                <div className="hidden mt-4 pt-3 border-t border-white/15 md:flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-sans font-semibold text-gold-light uppercase tracking-wider flex items-center gap-1.5">
                    Explore Collection <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[10px] font-sans text-white/60 uppercase tracking-widest">
                    Fast Delivery
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
