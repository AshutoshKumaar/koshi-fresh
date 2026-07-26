"use client";

import * as React from "react";
import { Check, X, Sparkles, Trophy, Zap, ShieldCheck, Flame } from "lucide-react";
import { Container } from "@/components/ui/container";

const NUTRITION_DATA = [
  {
    metric: "Plant Protein",
    unit: "per 100g",
    makhanaVal: "9.7 g",
    chipsVal: "2.0 g",
    makhanaPercent: 97,
    chipsPercent: 20,
    advantage: "4.8x More Protein",
    highlight: "Essential Amino Acids for Muscle Build",
  },
  {
    metric: "Caloric Density",
    unit: "per 100g",
    makhanaVal: "347 kcal",
    chipsVal: "536 kcal",
    makhanaPercent: 40,
    chipsPercent: 95,
    advantage: "35% Fewer Calories",
    highlight: "Satiating Low-Calorie Daily Snacking",
  },
  {
    metric: "Trans & Saturated Fat",
    unit: "per 100g",
    makhanaVal: "0.1 g",
    chipsVal: "34.0 g",
    makhanaPercent: 3,
    chipsPercent: 98,
    advantage: "99% Less Fat",
    highlight: "Near Zero Oil Absorption",
  },
  {
    metric: "Dietary Soluble Fiber",
    unit: "per 100g",
    makhanaVal: "14.5 g",
    chipsVal: "3.2 g",
    makhanaPercent: 92,
    chipsPercent: 22,
    advantage: "4.5x Higher Fiber",
    highlight: "Promotes Gut Health & Digestion",
  },
  {
    metric: "Organic Calcium",
    unit: "per 100g",
    makhanaVal: "60 mg",
    chipsVal: "12 mg",
    makhanaPercent: 85,
    chipsPercent: 15,
    advantage: "5.0x Calcium",
    highlight: "Strengthens Bones & Tooth Enamel",
  },
  {
    metric: "Natural Iron",
    unit: "per 100g",
    makhanaVal: "1.4 mg",
    chipsVal: "0.6 mg",
    makhanaPercent: 70,
    chipsPercent: 30,
    advantage: "2.3x Iron",
    highlight: "Boosts Oxygen Transport & Energy",
  },
];

export function NutritionComparison() {
  return (
    <section id="comparison" className="w-full bg-forest-dark text-ivory py-16 md:py-24 relative overflow-hidden">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/15 rounded-full filter blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-widest mb-3 shadow-premium-sm">
            <Sparkles className="h-3.5 w-3.5" /> Clinical Breakdown
          </span>
          <h2 className="font-section-title text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-wide">
            Makhana vs Potato Chips
          </h2>
          <p className="font-body-premium text-ivory/80 mt-3 text-sm sm:text-base leading-relaxed font-light">
            See how clean, wetland-harvested foxnuts outperform deep-fried junk snacks across every nutritional metric.
          </p>
        </div>

        {/* Highlight Stats Bar */}
        <div className="max-w-4xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <Trophy className="h-5 w-5 text-gold-light mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-white block">4.8x Protein</span>
            <span className="text-[11px] font-sans text-ivory/70">vs Fried Chips</span>
          </div>
          <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <Flame className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-white block">35% Less Cal</span>
            <span className="text-[11px] font-sans text-ivory/70">Lower Density</span>
          </div>
          <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <ShieldCheck className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-white block">99% Less Fat</span>
            <span className="text-[11px] font-sans text-ivory/70">Near Zero Trans Fat</span>
          </div>
          <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <Zap className="h-5 w-5 text-gold-light mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-white block">5x Calcium</span>
            <span className="text-[11px] font-sans text-ivory/70">Bone & Joint Density</span>
          </div>
        </div>

        {/* Main Comparison Card Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 p-6 md:p-10 shadow-2xl space-y-6">
          {/* Table Legend */}
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-ivory/70">
              Nutritional Metrics
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-serif font-bold text-emerald-300">🍿 Koshi Makhana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/50" />
                <span className="text-xs font-serif font-medium text-white/40">🥔 Fried Chips</span>
              </div>
            </div>
          </div>

          {/* Metric Comparison Rows */}
          <div className="space-y-6">
            {NUTRITION_DATA.map((item, idx) => (
              <div key={idx} className="space-y-3 pb-6 border-b border-white/10 last:border-0 last:pb-0">
                {/* Metric Title & Advantage Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white inline-flex items-center gap-2">
                      {item.metric}
                      <span className="text-[11px] font-sans font-normal text-ivory/60">({item.unit})</span>
                    </h4>
                    <span className="text-xs font-sans text-ivory/70 block sm:inline-block sm:ml-2">
                      • {item.highlight}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-sans font-bold border border-emerald-400/30 shrink-0 self-start sm:self-auto">
                    {item.advantage}
                  </span>
                </div>

                {/* Comparative Progress Bars with Generous Distinct Spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 pt-1">
                  {/* Makhana Bar Card Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-emerald-300 font-bold flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-400" /> Koshi Makhana
                      </span>
                      <span className="font-extrabold text-emerald-300">{item.makhanaVal}</span>
                    </div>
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${item.makhanaPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Potato Chips Bar Card Box */}
                  <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-1.5">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-white/40 flex items-center gap-1">
                        <X className="h-3.5 w-3.5 text-red-400/70" /> Potato Chips
                      </span>
                      <span className="text-white/40 font-semibold">{item.chipsVal}</span>
                    </div>
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-red-500/10">
                      <div
                        className="h-full bg-gradient-to-r from-red-900/60 to-red-800/40 rounded-full transition-all duration-700"
                        style={{ width: `${item.chipsPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
