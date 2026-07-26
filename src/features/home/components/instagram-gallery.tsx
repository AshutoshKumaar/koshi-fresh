"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, Heart, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { toast } from "@/components/ui/toast";

const GALLERY_PHOTOS = [
  {
    image: "/hero-makhana-bowl.jpg",
    tag: "@koshifresh",
    recipeTitle: "✨ Morning Roasted Makhana",
    likes: "2.4k",
  },
  {
    image: "/roasted-cashews-studio.jpg",
    tag: "@mithila_harvest",
    recipeTitle: "🧂 Himalayan Salted Cashews",
    likes: "1.9k",
  },
  {
    image: "/almonds-seeds-collection.jpg",
    tag: "@superfood_recipes",
    recipeTitle: "🌱 Chia Almond Smoothie Bowl",
    likes: "3.1k",
  },
  {
    image: "/hero-gourmet-spices-bg.jpg",
    tag: "@healthysnacking",
    recipeTitle: "🔥 Ghee Roasted Snack Bowl",
    likes: "1.8k",
  },
  {
    image: "/gift-box-collection.jpg",
    tag: "@luxury_gifting",
    recipeTitle: "🎁 Festive Wellness Hamper",
    likes: "4.2k",
  },
  {
    image: "/mithila-sourcing-harvest.jpg",
    tag: "@farm_to_table",
    recipeTitle: "🌾 Wetland Lotus Pond Harvest",
    likes: "5.0k",
  },
];

export function InstagramGallery() {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-sand/50">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-sans font-bold uppercase tracking-widest mb-3 shadow-premium-sm">
            <Camera className="h-3.5 w-3.5" /> Follow @KoshiFresh
          </span>
          <h2 className="font-section-title text-forest text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight sm:whitespace-nowrap tracking-wider">
            Join Our Wellness Circle
          </h2>
          <p className="font-body-premium text-charcoal/80 mt-3 text-base font-light leading-relaxed">
            Tag us in your organic snacking recipes & daily health rituals to be featured.
          </p>
        </div>

        {/* 6 Interactive Lifestyle Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {GALLERY_PHOTOS.map((item, idx) => (
            <div
              key={idx}
              className="group relative h-60 sm:h-72 rounded-3xl overflow-hidden shadow-premium-sm border border-sand/70 block transition-all duration-500 hover:shadow-2xl hover:border-forest/40"
            >
              <Image
                src={item.image}
                alt={`Instagram Feed ${idx + 1}`}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />

              {/* Dark Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans font-bold text-gold-light bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    {item.tag}
                  </span>
                  <span className="text-[10px] font-sans font-semibold text-white/90 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                    <Heart className="h-3 w-3 text-red-400 fill-red-400" /> {item.likes}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-white leading-snug">
                    {item.recipeTitle}
                  </h4>
                  <span className="text-[10px] font-sans text-white/70 block mt-0.5">
                    Click to view recipe
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Social Banner CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              toast({
                title: "@KoshiFresh Instagram",
                description: "Redirecting to Koshi Fresh official Instagram channel...",
              });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest text-ivory font-sans font-bold text-sm hover:bg-forest-light transition-all duration-300 shadow-premium-md cursor-pointer group"
          >
            <Camera className="h-4 w-4 text-gold-light" />
            <span>Follow @KoshiFresh on Instagram</span>
            <ExternalLink className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-xs font-sans text-stone block mt-3 font-light">
            📸 Join 25,000+ health enthusiasts sharing daily organic wellness rituals.
          </span>
        </div>
      </Container>
    </section>
  );
}
