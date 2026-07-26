"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ShieldCheck, Award, Heart, Sprout, Users, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-sand/10 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory pt-28 md:pt-32 pb-16 md:pb-24 mb-12">
        <Container>
          <div className="max-w-3xl text-center mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              🌿 Sourcing Heritage & Farm Cooperatives
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Pure Superfoods Direct from Mithilanchal, Bihar
            </h1>
            <p className="text-ivory/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              We eliminate middleman exploitation, bringing 100% organic, lab-tested 9mm+ jumbo foxnuts directly from local pond farmers to your table.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Story Grid */}
        <div className="bg-white rounded-3xl border border-sand/60 p-6 sm:p-12 shadow-premium-md mb-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-forest font-bold font-sans">
                Our Sourcing Roots
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-obsidian">
                100-Year-Old Wetland Farming Techniques
              </h2>
              <p className="text-stone text-sm sm:text-base font-light leading-relaxed">
                Mithila, Bihar is the historic global epicenter of Makhana (Euryale Ferox). The mineral-rich wetland soil and pristine natural pond beds yield foxnuts with unparalleled nutritional density.
              </p>
              <p className="text-stone text-sm font-light leading-relaxed">
                Every seed is hand-harvested by local farming families, sun-dried naturally, and popped at precise temperatures to retain 100% of essential nutrients.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sand/30 border border-sand/50 shadow-premium-sm">
              <Image
                src="/mithila-sourcing-harvest.jpg"
                alt="Mithila Sourcing Harvest"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-sand/60">
            <div className="p-6 rounded-2xl bg-sand/20 border border-sand/50 space-y-3">
              <div className="p-3 bg-forest/10 rounded-xl w-fit text-forest">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-obsidian">500+ Farmer Cooperatives</h3>
              <p className="text-xs text-stone font-light leading-relaxed">
                Direct fair-trade profits returned to agricultural families without middle-tier margins.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sand/20 border border-sand/50 space-y-3">
              <div className="p-3 bg-forest/10 rounded-xl w-fit text-forest">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-obsidian">NABL Lab Certified</h3>
              <p className="text-xs text-stone font-light leading-relaxed">
                Every batch is rigorously screened for pesticides, heavy metals, and moisture integrity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sand/20 border border-sand/50 space-y-3">
              <div className="p-3 bg-forest/10 rounded-xl w-fit text-forest">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-obsidian">9mm+ Jumbo Grade</h3>
              <p className="text-xs text-stone font-light leading-relaxed">
                Only top 5% size fraction seeds are selected for Koshi Fresh packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-forest to-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">Taste the Pure Difference</h2>
          <p className="text-ivory/80 text-sm sm:text-base max-w-xl mx-auto font-light">
            Experience clean, organic makhana and dry fruits harvested directly from source.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-obsidian font-sans font-bold px-6 py-3 rounded-xl shadow-premium-md transition-all text-sm"
          >
            Explore Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
