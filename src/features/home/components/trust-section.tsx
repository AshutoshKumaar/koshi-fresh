"use client";

import * as React from "react";
import { Award, Leaf, ShieldCheck, Flame, MapPin, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "FSSAI Certified",
    subtitle: "Highest Food Safety Standards",
  },
  {
    icon: Leaf,
    title: "Farm Fresh",
    subtitle: "Direct From Wetland Ponds",
  },
  {
    icon: Award,
    title: "No Preservatives",
    subtitle: "100% Raw & Unrefined",
  },
  {
    icon: Flame,
    title: "Protein Rich",
    subtitle: "Plant-Based Vitality",
  },
  {
    icon: MapPin,
    title: "Made in India",
    subtitle: "Sourced From Mithila, Bihar",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Express Shipping Across India",
  },
];

export function TrustSection() {
  return (
    <section className="w-full bg-white border-y border-sand/50 py-10">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {TRUST_BADGES.map((badge, idx) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-sand/10 hover:bg-sand/30 transition-all duration-300 group border border-transparent hover:border-sand/60"
              >
                <div className="h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest group-hover:scale-110 transition-transform mb-3">
                  <IconComponent className="h-6 w-6 stroke-[1.75]" />
                </div>
                <h4 className="font-serif font-semibold text-obsidian text-sm">
                  {badge.title}
                </h4>
                <span className="text-[11px] font-sans text-stone font-light block mt-0.5">
                  {badge.subtitle}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
