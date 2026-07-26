"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";
import { ProductCardGrid } from "@/features/shop/components/product-card-grid";
import { Sparkles, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<string>("featured");

  const categories = [
    { id: "all", label: "All Products" },
    { id: "makhana", label: "Foxnuts & Makhana" },
    { id: "dry-fruits", label: "Premium Dry Fruits" },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.variants[0].price - b.variants[0].price;
    if (sortBy === "price-high") return b.variants[0].price - a.variants[0].price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="bg-sand/10 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-900 text-ivory pt-28 md:pt-32 pb-12 md:pb-16 mb-10">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" /> 100% Certified Organic Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Explore Superfood Collections
            </h1>
            <p className="text-ivory/80 text-sm sm:text-base font-light leading-relaxed">
              Sourced directly from certified wetland farming cooperatives in Mithilanchal, Bihar. Hand-sorted 9mm+ jumbo foxnuts & premium dry fruits.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-sand/60 shadow-premium-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone/60" />
              <Input
                type="text"
                placeholder="Search raw makhana, cashews, almonds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-sand/20 border-sand/60 text-obsidian rounded-xl text-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="h-4 w-4 text-stone shrink-0" />
              <span className="text-xs text-stone font-sans font-medium uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-sand/20 border border-sand/60 rounded-xl px-3 py-2 text-xs font-sans font-medium text-obsidian focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-sand/40">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-forest text-white shadow-premium-sm"
                    : "bg-sand/30 text-charcoal hover:bg-sand/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {sortedProducts.map((product) => (
              <ProductCardGrid key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-sand/60 p-8">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="text-lg font-serif font-bold text-obsidian mb-2">No Products Found</h3>
            <p className="text-stone text-xs sm:text-sm max-w-sm mx-auto mb-6">
              We couldn't find any products matching "{searchQuery}". Try searching for makhana or almonds.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-sans font-bold hover:bg-forest-light transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
