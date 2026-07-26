"use client";

import * as React from "react";
import { ShieldCheck, Award, Sparkles, Sprout, CheckCircle2, FileCheck, ShieldAlert, Award as MedalIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  highlightTag: string;
  tagBg: string;
  metric: string;
}

export interface FeaturesGridProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "differentiators" | "benefits";
}

export function FeaturesGrid({ className, ...props }: FeaturesGridProps) {
  const CERTIFICATIONS = [
    { label: "FSSAI Food Safety License", value: "Lic #10421000001234", icon: <ShieldCheck className="h-4 w-4 text-emerald-600" /> },
    { label: "NABL Lab Test Passed", value: "0 Heavy Metals / Pesticides", icon: <FileCheck className="h-4 w-4 text-gold" /> },
    { label: "100% Farm Co-op Sourced", value: "Madhubani, Bihar", icon: <Award className="h-4 w-4 text-emerald-600" /> },
    { label: "Zero Chemical Bleach", value: "No Sulfur Oxides (SO2)", icon: <ShieldAlert className="h-4 w-4 text-gold" /> },
  ];

  const coreStandards: FeatureItem[] = [
    {
      icon: <Award className="h-6 w-6 text-emerald-600" />,
      title: "Direct From Farmers",
      subtitle: "Fair-trade wetland cooperatives",
      description: "Direct partnerships with agricultural cooperatives in Mithilanchal, Bihar. Eliminating middle-tier margins to support local farm soil keepers.",
      highlightTag: "100% Traceable",
      tagBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      metric: "Verified Co-op Pool",
    },
    {
      icon: <Sprout className="h-6 w-6 text-gold" />,
      title: "Handpicked Quality",
      subtitle: "Sun-dried 9mm+ jumbo grade",
      description: "Hand-sorted and sun-dried naturally under strict quality checks. Guaranteed zero stale pieces and highest crunch size grade.",
      highlightTag: "9mm+ Jumbo",
      tagBg: "bg-amber-50 text-amber-700 border-amber-200",
      metric: "Grade AAA Checked",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: "Sustainably Harvested",
      subtitle: "Eco-friendly pond lotus farming",
      description: "Harvested using traditional wetland lotus pond techniques that preserve Bihar's natural aquatic ecosystem and bio-diversity.",
      highlightTag: "Eco Preserved",
      tagBg: "bg-sky-50 text-sky-700 border-sky-200",
      metric: "Zero Industrial Waste",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-gold" />,
      title: "Chemical Free & Pure",
      subtitle: "Zero sulfur or artificial additives",
      description: "Hygienically packed without artificial flavorings, colorings, or sulfur oxides to preserve native mineral and protein density.",
      highlightTag: "Clean Label",
      tagBg: "bg-purple-50 text-purple-700 border-purple-200",
      metric: "NABL Lab Certified",
    },
  ];

  return (
    <div className="space-y-8">
      {/* High-Trust Certification & Lab Verification Banner */}
      <div className="rounded-3xl p-5 bg-white border border-sand/80 shadow-premium-sm grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-sand/50">
        {CERTIFICATIONS.map((cert, idx) => (
          <div key={idx} className="flex items-center gap-3 px-3 py-1">
            <div className="h-10 w-10 rounded-xl bg-sand/20 flex items-center justify-center shrink-0 border border-sand/50">
              {cert.icon}
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone block">
                {cert.label}
              </span>
              <span className="text-xs font-sans font-bold text-obsidian block mt-0.5">
                {cert.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Feature Cards */}
      <div
        className={cn(
          "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
          className
        )}
        {...props}
      >
        {coreStandards.map((item, index) => (
          <div
            key={index}
            className="group relative rounded-3xl p-7 bg-white border border-sand/70 shadow-premium-sm hover:shadow-2xl hover:border-forest/30 transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              {/* Header row with Icon & Highlight Tag */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-13 w-13 rounded-2xl bg-sand/30 border border-sand/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-premium-sm">
                  {item.icon}
                </div>
                <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.tagBg}`}>
                  {item.highlightTag}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-serif text-xl font-bold text-obsidian group-hover:text-forest transition-colors">
                {item.title}
              </h3>
              <span className="text-[11px] font-sans font-semibold text-gold block mt-0.5 mb-3">
                {item.subtitle}
              </span>

              {/* Description */}
              <p className="font-sans text-stone text-xs leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            {/* Verification footer tag */}
            <div className="pt-4 mt-6 border-t border-sand/40 flex items-center justify-between text-[11px] font-sans">
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Koshi Guaranteed
              </span>
              <span className="text-[10px] font-semibold text-stone bg-sand/30 px-2 py-0.5 rounded">
                {item.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
