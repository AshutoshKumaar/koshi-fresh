"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";

const CATEGORIES = [
  {
    title: "Koshi Fresh Makhana",
    subtitle: "Koshi Fresh brand · Renuka Enterprises",
    slug: "koshi-fresh",
    group: "makhana",
    brand: "Koshi Fresh",
    image: "/brand-koshi-fresh-makhana.webp",
    tag: "Koshi Fresh",
    badgeBg: "bg-amber-950/20 text-amber-50 border-amber-100/40",
  },
  {
    title: "Madhur Phool Makhana",
    subtitle: "Madhur Phool Makhana brand · Renuka Enterprises",
    slug: "madhur-phool-makhana",
    group: "makhana",
    brand: "Madhur Phool Makhana",
    image: "/brand-madhur-phool-makhana.webp",
    tag: "Madhur Phool",
    badgeBg: "bg-rose-900/20 text-rose-50 border-rose-100/40",
  },
  {
    title: "Krishna Phool Makhana",
    subtitle: "Krishna Phool Makhana brand · Renuka Enterprises",
    slug: "krishna-phool-makhana",
    group: "makhana",
    brand: "Krishna Phool Makhana",
    image: "/brand-krishna-phool-makhana.webp",
    tag: "Krishna Phool",
    badgeBg: "bg-indigo-950/20 text-indigo-50 border-indigo-100/40",
  },
  {
    title: "Flour & Powder",
    subtitle: "Makhana Powder · Makhana and Wheat Mix Powder",
    slug: "flour",
    group: "flour",
    image: "/category-flour-powder.webp",
    tag: "2 Product Types",
    badgeBg: "bg-amber-500/20 text-amber-100 border-amber-300/40",
  },
  {
    title: "Chocolate",
    subtitle: "Four homemade chocolate brand concepts coming soon",
    slug: "chocolate",
    group: "chocolate",
    image: "/category-chocolate.webp",
    tag: "Homemade · 4 Brand Ideas",
    badgeBg: "bg-amber-100/20 text-amber-50 border-amber-100/40",
  },
  {
    title: "Nuts and Dry Fruits",
    subtitle: "Kaju, kishmish, almonds, pistachios, walnuts, dates and more",
    slug: "dry-fruits",
    group: "dry-fruits",
    image: "/category-nuts-dry-fruits.webp",
    tag: "Nuts and Dry Fruits",
    badgeBg: "bg-orange-500/20 text-orange-100 border-orange-300/40",
  },
];

const FILTERS = [
  { id: "all", label: "All Categories" },
  { id: "makhana", label: "Makhana" },
  { id: "flour", label: "Flour & Powder" },
  { id: "chocolate", label: "Chocolate" },
  { id: "dry-fruits", label: "Nuts and Dry Fruits" },
];

export function CategoriesGrid() {
  const [activeFilter, setActiveFilter] = React.useState("all");
  const visibleCategories = CATEGORIES.filter((category) => activeFilter === "all" || category.group === activeFilter);

  return (
    <section id="categories" className="w-full border-t border-sand/50 bg-white py-8 md:py-24">
      <Container>
        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:mb-12 md:gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Renuka Enterprises
            </span>
            <h2 className="font-section-title text-2xl font-bold leading-tight text-forest sm:text-4xl lg:text-5xl">
              Featured Categories
            </h2>
            <p className="mt-3 hidden font-body-premium text-base font-light leading-relaxed text-charcoal/80 md:block">
              Makhana, flour and powder, homemade chocolate, nuts and dry fruits from Renuka Enterprises.
            </p>
          </div>

          <div className="-mx-4 flex w-[calc(100%+2rem)] snap-x gap-2 overflow-x-auto px-4 pb-2 pt-1 md:mx-0 md:w-auto md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={activeFilter === filter.id}
                className={`min-h-10 shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${activeFilter === filter.id ? "bg-forest text-ivory shadow-premium-sm" : "border border-sand bg-sand/30 text-charcoal hover:bg-sand/60"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="-mx-4 grid snap-x grid-flow-col auto-cols-[82vw] gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid-flow-row md:auto-cols-auto md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-12">
          {visibleCategories.map((category) => {
            const itemCount = category.brand
              ? PRODUCTS.filter((product) => product.brand === category.brand).length
              : PRODUCTS.filter((product) => product.category === category.group).length;

            return (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group relative block h-[230px] overflow-hidden rounded-2xl border border-sand/60 shadow-premium-md transition-all duration-300 hover:border-forest/40 hover:shadow-2xl sm:h-[300px] md:h-[320px] md:rounded-3xl lg:col-span-4"
              >
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 767px) 82vw, (max-width: 1279px) 45vw, 30vw" className="object-cover object-center transition-transform duration-500 md:group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest-dark/50 to-black/20 transition-colors duration-500 group-hover:from-forest-dark" />

                <div className="absolute left-3 right-3 top-3 z-10 flex items-center justify-between gap-2 md:left-5 md:right-5 md:top-5">
                  <span className={`inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md ${category.badgeBg}`}>
                    {category.tag}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                    {itemCount ? `${itemCount} ${itemCount === 1 ? "Product" : "Products"}` : "Coming Soon"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 md:bottom-6 md:left-6 md:right-6">
                  <div className="flex items-end justify-between gap-4">
                    <div className="max-w-[80%]">
                      <h3 className="font-serif text-2xl font-bold leading-tight text-white transition-colors group-hover:text-gold-light sm:text-3xl">{category.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-xs font-light leading-relaxed text-white/80">{category.subtitle}</p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-premium-sm backdrop-blur-md transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-obsidian">
                      <ArrowUpRight className="h-6 w-6 stroke-[2]" />
                    </div>
                  </div>
                  <div className="mt-4 hidden items-center justify-between border-t border-white/15 pt-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-light">Explore Collection <ArrowRight className="h-3.5 w-3.5" /></span>
                    <span className="text-[10px] uppercase tracking-widest text-white/60">Renuka Enterprises</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
