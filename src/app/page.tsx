"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { PRODUCTS } from "@/data/products";

// Feature Components
import { Hero } from "@/features/home/components/hero";
import { TrustSection } from "@/features/home/components/trust-section";
import { CategoriesGrid } from "@/features/home/components/categories-grid";
import { ProductCardGrid } from "@/features/shop/components/product-card-grid";
import { FeaturesGrid } from "@/features/home/components/features-grid";
import { NutritionComparison } from "@/features/home/components/nutrition-comparison";
import { HealthBenefits } from "@/features/home/components/health-benefits";
import { ReviewsSection } from "@/features/home/components/reviews-section";
import { InstagramGallery } from "@/features/home/components/instagram-gallery";

// UI Components
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export default function HomePage() {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      variant: "success",
      title: "Successfully Joined",
      description: "Welcome to Koshi Fresh inner circle. Check your inbox for wellness guides.",
    });
    setEmail("");
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. TRUST BADGES SECTION */}
      <TrustSection />

      {/* 3. FEATURED CATEGORIES GRID */}
      <CategoriesGrid />

      {/* 4. BEST SELLERS GRID */}
      <Section id="shop" size="sm" className="bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="font-label-premium text-gold block mb-2">
                Proven Favorites
              </span>
              <h2 className="font-section-title text-forest">
                Best Seller Superfoods
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center text-sm font-sans font-semibold text-forest hover:text-forest-light tracking-wide cursor-pointer group"
            >
              View All Products
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <ProductCardGrid key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. WHY KOSHI FRESH (Our Core Standards & Trust) */}
      <Section size="sm" className="bg-ivory/40 border-t border-sand/50">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-700/10 border border-emerald-700/30 text-emerald-800 text-xs font-sans font-bold uppercase tracking-widest mb-3">
              🛡️ Lab Tested & FSSAI Certified
            </span>
            <h2 className="font-section-title text-forest text-xl sm:text-3xl lg:text-4xl font-bold leading-tight sm:whitespace-nowrap tracking-wider">
              Uncompromising Quality & Trust
            </h2>
            <p className="font-body-premium text-charcoal/80 mt-3 text-base font-light leading-relaxed">
              Every single batch is NABL lab tested, pesticide checked, and harvested directly from certified wetland farming cooperatives in Mithila.
            </p>
          </div>
          <FeaturesGrid />
        </Container>
      </Section>

      {/* 6. NUTRITION COMPARISON TABLE */}
      <NutritionComparison />

      {/* 7. HEALTH BENEFITS INFOGRAPHIC */}
      <HealthBenefits />

      {/* 8. OUR STORY & HERITAGE */}
      <Section id="story" size="md" className="bg-ivory/50 border-y border-sand/50 py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Studio Photo Showcase */}
            <div className="lg:col-span-5 h-[380px] md:h-[480px] rounded-3xl overflow-hidden relative shadow-2xl border border-sand/80 group">
              <Image
                src="/mithila-sourcing-harvest.jpg"
                alt="Mithila Organic Harvest Sourcing"
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-gold-light text-xs font-sans font-bold uppercase tracking-wider border border-white/20">
                  📍 Madhubani & Darbhanga, Bihar
                </span>
              </div>

              {/* Photo Description Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-sans">
                <span className="font-bold text-gold-light block text-sm mb-0.5">Direct Wetland Harvesting</span>
                Preserving ancient 100-year-old pond lotus farming techniques in Mithila.
              </div>
            </div>

            {/* Right Column: Editorial Copy & 3 Sourcing Pillars */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-sans font-bold uppercase tracking-widest mb-3 shadow-premium-sm">
                  🌾 Sourcing Heritage & Farm Cooperatives
                </span>
                <h2 className="font-section-title text-forest text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-wide">
                  Grown in wetlands. <br />
                  Sourced straight from Mithila.
                </h2>
                <p className="font-body-premium text-charcoal/90 mt-4 text-base font-light leading-relaxed">
                  Mithilanchal, Bihar is the historic global origin of premium Foxnuts (Makhana). The unique wetland ecosystem and mineral-rich pond beds produce seeds with nutrition density found nowhere else on earth. We eliminate middleman exploitation to bring pure, unadulterated superfoods straight to your doorstep.
                </p>
              </div>

              {/* 3 Sourcing Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-sand/70 shadow-premium-sm hover:shadow-md transition-all">
                  <span className="text-xl block mb-1">🏛️</span>
                  <h4 className="font-serif text-sm font-bold text-obsidian">Ancient Lotus Ponds</h4>
                  <p className="text-[11px] font-sans text-stone mt-1">Preserved across generations in Madhubani.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-sand/70 shadow-premium-sm hover:shadow-md transition-all">
                  <span className="text-xl block mb-1">🤝</span>
                  <h4 className="font-serif text-sm font-bold text-obsidian">Fair-Trade Co-ops</h4>
                  <p className="text-[11px] font-sans text-stone mt-1">Direct profits to 500+ soil keeper families.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-sand/70 shadow-premium-sm hover:shadow-md transition-all">
                  <span className="text-xl block mb-1">☀️</span>
                  <h4 className="font-serif text-sm font-bold text-obsidian">Natural Sun-Drying</h4>
                  <p className="text-[11px] font-sans text-stone mt-1">Zero chemical sulfur; dried on bamboo mats.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center font-sans font-bold rounded-xl transition-all duration-300 bg-forest text-ivory hover:bg-forest-light shadow-premium-md h-12 px-7 text-sm cursor-pointer select-none text-center"
                >
                  Explore Our Sourcing Story
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 9. CUSTOMER REVIEWS */}
      <ReviewsSection />

      {/* 10. INSTAGRAM GALLERY */}
      <InstagramGallery />

      {/* 11. NEWSLETTER SUBSCRIPTION (Full-Width Edge-To-Edge) */}
      <section id="contact" className="w-full bg-gradient-to-br from-forest-dark via-forest to-emerald-950 text-ivory py-20 md:py-28 relative overflow-hidden border-t border-gold/30">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none" />

        <Container>
          <div className="max-w-3xl mx-auto space-y-7 z-10 relative text-center">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 inline-flex items-center justify-center mx-auto mb-1 shadow-premium-sm">
              <Mail className="h-6 w-6 text-gold-light" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-widest mb-3 shadow-premium-sm">
                ✨ Exclusive VIP Member Access
              </span>
              <h2 className="font-section-title text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight sm:whitespace-nowrap tracking-wider">
                Join the Koshi Fresh Circle
              </h2>
              <p className="font-body-premium text-ivory/90 mt-3 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                Subscribe to receive <strong className="font-semibold text-gold-light">15% OFF your first order</strong>, seasonal harvest updates, and healthy superfood recipes directly in your inbox.
              </p>
            </div>

            {/* 3 VIP Benefit Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1 text-xs font-sans text-ivory/80">
              <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/15">
                🏷️ 15% OFF First Order
              </span>
              <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/15">
                🌾 Fresh Harvest Drops
              </span>
              <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/15">
                📩 Zero Spam Promise
              </span>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/15 backdrop-blur-md border-white/25 text-white placeholder:text-white/60 hover:border-white/40 focus:border-white h-12 rounded-xl text-sm font-sans"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-gold-light via-gold to-amber-500 hover:from-amber-400 hover:to-gold text-obsidian font-sans font-bold h-12 px-7 rounded-xl shadow-premium-md shrink-0 cursor-pointer"
              >
                Claim 15% OFF
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
}
