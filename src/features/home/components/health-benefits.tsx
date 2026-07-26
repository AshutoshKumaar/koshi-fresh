"use client";

import * as React from "react";
import { Scale, Heart, Dumbbell, Activity, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";

const BENEFITS = [
  {
    icon: Scale,
    title: "Weight Loss & Satiety",
    desc: "Rich in soluble dietary fiber and low in caloric density. Keeps hunger pangs away for hours while accelerating natural metabolism.",
    metricTag: "High Fiber Satiety",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Heart,
    title: "Cardiovascular & Heart Health",
    desc: "Abundant in natural magnesium and potassium that help regulate blood pressure, maintain vascular health, and lower bad cholesterol.",
    metricTag: "Zero Cholesterol",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    iconBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
  {
    icon: Dumbbell,
    title: "High Plant Protein",
    desc: "Packed with 9.7g plant-based protein per serving containing all essential amino acids to support muscle synthesis and tissue repair.",
    metricTag: "9.7g Protein / 100g",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    iconBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    icon: Activity,
    title: "Bone Density & Joint Lubrication",
    desc: "Naturally loaded with organic calcium (60mg per 100g) that strengthens bone structure, prevents enamel erosion, and aids joint flexibility.",
    metricTag: "5x Calcium Boost",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    iconBg: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Low Glycemic Index",
    desc: "Diabetic-friendly snack with a low GI rating (<50). Prevents sudden insulin spikes and helps maintain steady daily blood glucose levels.",
    metricTag: "Low GI Index < 50",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    iconBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    icon: Sparkles,
    title: "Anti-Aging & Cellular Repair",
    desc: "Enriched with kaempferol flavonoids and potent antioxidants that combat free radicals, reduce systemic inflammation, and slow cell aging.",
    metricTag: "Kaempferol Rich",
    badgeColor: "bg-gold/15 text-gold border-gold/40",
    iconBg: "bg-amber-500/10 text-gold border-gold/20",
  },
];

export function HealthBenefits() {
  return (
    <section id="benefits" className="w-full bg-white py-16 md:py-24 border-t border-sand/50">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-sans font-bold uppercase tracking-widest mb-3 shadow-premium-sm">
            🧪 Scientifically Proven Superfood
          </span>
          <h2 className="font-section-title text-forest text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight sm:whitespace-nowrap tracking-wider">
            Health & Wellness Benefits
          </h2>
          <p className="font-body-premium text-charcoal/80 mt-3 text-base font-light leading-relaxed">
            Makhana and raw seeds are natural nutrition powerhouses designed to nourish daily health goals.
          </p>
        </div>

        {/* 6 Infographic Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {BENEFITS.map((b, idx) => {
            const IconComp = b.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-8 border border-sand/70 bg-ivory/30 shadow-premium-sm hover:shadow-2xl hover:border-forest/40 hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Metric Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${b.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-premium-sm`}>
                      <IconComp className="h-7 w-7 stroke-[1.75]" />
                    </div>
                    <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${b.badgeColor}`}>
                      {b.metricTag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-xl font-bold text-obsidian mb-2.5 group-hover:text-forest transition-colors leading-snug">
                    {b.title}
                  </h3>
                  <p className="font-sans text-stone text-xs leading-relaxed font-light">
                    {b.desc}
                  </p>
                </div>

                {/* Verification Footer */}
                <div className="pt-4 mt-6 border-t border-sand/40 flex items-center gap-1.5 text-[11px] font-sans font-medium text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Clinically Backed Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
