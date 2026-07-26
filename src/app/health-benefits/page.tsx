"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heart, Activity, ShieldCheck, Zap, Award, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function HealthBenefitsPage() {
  const benefits = [
    {
      title: "Low Glycemic Index (GI)",
      subtitle: "Prevents Blood Sugar Spikes & Supports Diabetes Care",
      desc: "Makhana has a very low glycemic index (GI < 55), making it the ideal healthy snack for diabetics and individuals managing insulin sensitivity. It provides sustained energy without causing sudden glucose spikes.",
      icon: Activity,
      stats: "GI < 55",
      badge: "Diabetic Friendly"
    },
    {
      title: "Rich in Calcium & Magnesium",
      subtitle: "Strengthens Bones, Teeth & Neuromuscular Health",
      desc: "With over 60mg of bioavailable calcium per 100g serving, raw foxnuts promote joint health, bone density, and muscle contraction regulation — essential for growing children and aging seniors.",
      icon: ShieldCheck,
      stats: "60mg+ Calcium",
      badge: "Bone Health"
    },
    {
      title: "Potent Anti-Aging Antioxidants",
      subtitle: "Contains Kaempferol & Anti-Inflammatory Flavonoids",
      desc: "Packed with natural antioxidants like kaempferol, makhana combats cell damage caused by oxidative stress, reduces systemic inflammation, and promotes youthful skin elasticity.",
      icon: Heart,
      stats: "Kaempferol Rich",
      badge: "Anti-Aging"
    },
    {
      title: "Weight Loss & Satiety Booster",
      subtitle: "High Dietary Fiber & High Protein with Near Zero Fat",
      desc: "Contains 14.5g of dietary fiber and 9.7g of plant protein per 100g with less than 0.1g saturated fat. It keeps you feeling full longer, preventing unhealthy junk food snacking.",
      icon: Zap,
      stats: "9.7g Protein / 100g",
      badge: "Weight Management"
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-sand/10 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory py-16 md:py-20 mb-12">
        <Container>
          <div className="max-w-3xl text-center mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> Clinical & Nutritional Science
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Health Benefits of Makhana
            </h1>
            <p className="text-ivory/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Discover why ancient Ayurvedic medicine and modern clinical nutrition praise 9mm+ organic lotus seeds as the ultimate superfood.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {benefits.map((b, i) => {
            const IconComponent = b.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-sand/60 p-8 shadow-premium-sm space-y-5 hover:shadow-premium-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3.5 bg-forest/10 rounded-2xl text-forest">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-forest bg-forest/10 px-3 py-1 rounded-full">
                    {b.badge}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-obsidian mb-1">{b.title}</h2>
                  <h3 className="text-xs font-sans font-medium text-forest uppercase tracking-wider mb-3">
                    {b.subtitle}
                  </h3>
                  <p className="text-stone text-sm font-light leading-relaxed">{b.desc}</p>
                </div>

                <div className="pt-4 border-t border-sand/40 flex items-center justify-between text-xs font-sans">
                  <span className="text-stone font-light">Key Nutritional Metric:</span>
                  <span className="font-bold text-forest text-sm">{b.stats}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Breakdown Table */}
        <div className="bg-white rounded-3xl border border-sand/60 p-6 sm:p-10 shadow-premium-md mb-16 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-forest">
              Comparative Analysis
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
              Makhana vs Common Snacks
            </h2>
            <p className="text-stone text-xs sm:text-sm font-light">
              See how 100g of Koshi Fresh Organic Makhana stacks up against processed alternatives.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
              <thead>
                <tr className="border-b border-sand/60 text-stone font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Snack Type</th>
                  <th className="py-3 px-4">Calories (100g)</th>
                  <th className="py-3 px-4">Fat Content</th>
                  <th className="py-3 px-4">Glycemic Index</th>
                  <th className="py-3 px-4 text-right">Health Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                <tr className="bg-forest/5 font-bold text-forest">
                  <td className="py-4 px-4 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-gold-light fill-gold" /> Koshi Raw Makhana
                  </td>
                  <td className="py-4 px-4">347 kcal</td>
                  <td className="py-4 px-4 text-emerald-600 font-extrabold">0.1 g (Near Zero)</td>
                  <td className="py-4 px-4">Low (&lt; 55)</td>
                  <td className="py-4 px-4 text-right">98 / 100</td>
                </tr>
                <tr className="text-charcoal font-light">
                  <td className="py-4 px-4">Fried Potato Chips</td>
                  <td className="py-4 px-4 text-feedback-error font-medium">536 kcal</td>
                  <td className="py-4 px-4 text-feedback-error font-medium">35.0 g</td>
                  <td className="py-4 px-4 text-feedback-error font-medium">High (&gt; 75)</td>
                  <td className="py-4 px-4 text-right">24 / 100</td>
                </tr>
                <tr className="text-charcoal font-light">
                  <td className="py-4 px-4">Butter Popcorn</td>
                  <td className="py-4 px-4">420 kcal</td>
                  <td className="py-4 px-4">18.5 g</td>
                  <td className="py-4 px-4">Medium (65)</td>
                  <td className="py-4 px-4 text-right">58 / 100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-forest to-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">Start Your Clean Snacking Journey</h2>
          <p className="text-ivory/80 text-sm sm:text-base max-w-xl mx-auto font-light">
            Switch to 100% natural, lab-tested makhana and dry fruits harvested directly from source.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-obsidian font-sans font-bold px-6 py-3 rounded-xl shadow-premium-md transition-all text-sm"
          >
            Shop Organic Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
