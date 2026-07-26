"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

const SLIDES = [
  {
    id: 1,
    bgImage: "/hero-lotus-farm-bg.jpg",
    badge: "100% Premium & Sourced From Mithila, Bihar",
    titlePrefix: "Healthy Snacking",
    titleHighlight: "Starts Here",
    subtitle: "Naturally harvested from Bihar. Protein Rich. No Preservatives. 100% Premium.",
    ctaText: "Shop Now",
    ctaHref: "#shop",
    secondaryCtaText: "Learn More",
    secondaryCtaHref: "#story",
    studioCardTitle: "Handpicked Mithila Makhana",
    studioCardDesc: "Sun-dried 9mm+ jumbo grade foxnuts crafted for superior crunch.",
  },
  {
    id: 2,
    bgImage: "/hero-golden-harvest-bg.jpg",
    badge: "Direct Farming Cooperatives Partnership",
    titlePrefix: "Direct From Wetland",
    titleHighlight: "Pond Cooperatives",
    subtitle: "Empowering soil keepers of Bihar with fair-trade values while bringing pure, unadulterated nature directly to your doorstep.",
    ctaText: "Shop Now",
    ctaHref: "#shop",
    secondaryCtaText: "Our Sourcing Story",
    secondaryCtaHref: "#story",
    studioCardTitle: "Direct Farmer Sourcing",
    studioCardDesc: "Preserving ancient pond harvesting techniques in Madhubani.",
  },
  {
    id: 3,
    bgImage: "/hero-gourmet-spices-bg.jpg",
    badge: "Slow Roasted in Pure A2 Cow Ghee",
    titlePrefix: "Clean Label",
    titleHighlight: "Organic Superfoods",
    subtitle: "Flavored with organic spices & ghee. Zero sulfur treatment, zero artificial additives, 100% clean label.",
    ctaText: "Shop Now",
    ctaHref: "#shop",
    secondaryCtaText: "View Nutrition",
    secondaryCtaHref: "#comparison",
    studioCardTitle: "Ghee Roasted Perfection",
    studioCardDesc: "Rich in calcium, protein, and antioxidants for daily energy.",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Smooth auto-slide effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeSlide = SLIDES[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-forest-dark text-ivory pt-24 md:pt-32 pb-12 md:pb-16 transition-colors duration-700 select-none flex items-center min-h-[85vh]">
      {/* Animated Full-Bleed Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.75, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.bgImage}
              alt="Hero Background"
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Crisp Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/85 via-forest-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-transparent to-forest-dark/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-12 items-center w-full">
        {/* ================= LEFT COLUMN: CLEAN EDITORIAL CONTENT ================= */}
        <div className="lg:col-span-6 space-y-5 text-left">
          {/* Animated Gold Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.badge}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 backdrop-blur-md shadow-premium-sm"
            >
              <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
              <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-gold-light">
                {activeSlide.badge}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Animated Headline & Subtitle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-3"
            >
              <h1 className="font-hero text-ivory tracking-tight text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08]">
                {activeSlide.titlePrefix} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-amber-200">
                  {activeSlide.titleHighlight}
                </span>
              </h1>
              <p className="font-body-premium text-ivory/90 max-w-lg text-sm sm:text-base leading-relaxed font-normal drop-shadow-sm">
                {activeSlide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={activeSlide.ctaHref}
              className="inline-flex items-center justify-center font-sans font-bold rounded-xl transition-all duration-300 bg-gradient-to-r from-forest-light to-emerald-600 text-ivory hover:from-emerald-500 hover:to-emerald-700 hover:shadow-[0_0_25px_rgba(5,150,105,0.6)] shadow-premium-md h-12 px-7 text-sm sm:text-base cursor-pointer select-none text-center group"
            >
              {activeSlide.ctaText}
              <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={activeSlide.secondaryCtaHref}
              className="inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-300 border border-ivory/30 bg-black/20 backdrop-blur-md text-ivory hover:bg-black/30 hover:border-ivory/50 h-12 px-7 text-sm sm:text-base cursor-pointer select-none text-center"
            >
              {activeSlide.secondaryCtaText}
            </a>
          </div>

          {/* Clean Trust Badges */}
          <div className="pt-4 border-t border-ivory/20">
            <span className="text-[10px] font-sans font-semibold text-ivory/70 uppercase tracking-widest block mb-2.5">
              Certified Koshi Quality Assurance
            </span>
            <div className="flex flex-wrap gap-2">
              {["FSSAI Certified", "Farm Fresh", "No Preservatives", "Protein Rich"].map((badge) => (
                <div
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ivory/20 bg-black/20 backdrop-blur-sm text-[11px] font-sans font-medium text-ivory/90 px-3 py-1 shadow-premium-sm"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-light" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: ELEGANT STUDIO CARD SHOWCASE ================= */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[300px] md:min-h-[380px]">
          {/* Ambient Glow */}
          <div className="absolute inset-0 z-0 bg-emerald-500/20 rounded-full filter blur-[80px] pointer-events-none animate-pulse" />

          {/* Clean Glassmorphic Food Studio Card */}
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[400px] h-[300px] sm:h-[360px] z-10 relative rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-ivory/25 group"
          >
            <Image
              src="/hero-makhana-bowl.jpg"
              alt="Fresh Crispy Organic Makhana Bowl"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold-light">
                  Direct Harvest
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-sans font-semibold text-emerald-400">
                  <Sparkles className="h-3 w-3" /> Live Batch
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                {activeSlide.studioCardTitle}
              </h3>
              <p className="text-[11px] font-sans text-white/80 mt-0.5">
                {activeSlide.studioCardDesc}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
