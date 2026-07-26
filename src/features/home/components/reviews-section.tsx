"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const REVIEWS = [
  {
    name: "Arjun Sharma",
    role: "Verified Health Coach • Delhi",
    rating: 5,
    text: "The roasted makhana from Koshi Fresh is slow-cooked in ghee just like home. Absolutely zero stale pieces in the pack. Finding raw seeds of this size grade (9mm+) in standard markets is impossible.",
    fallback: "AS",
    verifiedPurchase: "Verified Buyer",
  },
  {
    name: "Dr. Ananya Iyer",
    role: "Clinical Dietitian • Bangalore",
    rating: 5,
    text: "As a nutritionist, I look for clean labeling. Koshi Fresh stands out with zero preservatives and no sulfur treatment. It's my default recommendation for healthy diabetic snacking.",
    fallback: "AI",
    verifiedPurchase: "Verified Buyer",
  },
  {
    name: "Vikram Malhotra",
    role: "Fitness & Crossfit Trainer • Mumbai",
    rating: 5,
    text: "Superb crunch and authentic ghee taste! The California almonds and chia seeds are exceptionally fresh. The packaging feels ultra-premium like a global lifestyle brand.",
    fallback: "VM",
    verifiedPurchase: "Verified Buyer",
  },
  {
    name: "Pooja Roy",
    role: "Yoga Instructor & Blogger • Kolkata",
    rating: 5,
    text: "The purity is unmatched. You can taste the authentic wetland harvest quality. My family switched completely from fried potato chips to Koshi ghee-roasted foxnuts!",
    fallback: "PR",
    verifiedPurchase: "Verified Buyer",
  },
  {
    name: "Rohan Kapoor",
    role: "Corporate Executive • Gurgaon",
    rating: 5,
    text: "Ordered the Curated Festive Gift Boxes for our office team. The quality of W240 cashews and roasted makhana was top tier. Fast 2-day delivery and great support!",
    fallback: "RK",
    verifiedPurchase: "Verified Buyer",
  },
  {
    name: "Sunita Verma",
    role: "Organic Food Enthusiast • Patna",
    rating: 5,
    text: "Direct sourcing from Mithila farmer co-ops makes all the difference. Clean, chemical-free, and tastes divine. Truly the finest makhana in India.",
    fallback: "SV",
    verifiedPurchase: "Verified Buyer",
  },
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Show 3 reviews per view on desktop, 1 on mobile
  const itemsPerPage = 3;
  const maxIndex = Math.ceil(REVIEWS.length / itemsPerPage) - 1;

  // Auto slide effect
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const visibleReviews = REVIEWS.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage);

  return (
    <section
      id="reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-ivory/50 py-16 md:py-24 border-t border-sand/50 relative overflow-hidden select-none"
    >
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-sans font-bold uppercase tracking-widest mb-3 shadow-premium-sm">
            <Sparkles className="h-3.5 w-3.5" /> Verified Customer Feedback
          </span>
          <h2 className="font-section-title text-forest text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight sm:whitespace-nowrap tracking-wider">
            Loved by Health Connoisseurs
          </h2>
          <p className="font-body-premium text-charcoal/80 mt-3 text-base font-light leading-relaxed">
            Over 10,000+ health coaches, dietitians, and families trust Koshi Fresh for unadulterated wetland superfoods.
          </p>
        </div>

        {/* Sliding Reviews Carousel */}
        <div className="max-w-6xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {visibleReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-3xl p-8 bg-white border border-sand/70 shadow-premium-sm hover:shadow-2xl hover:border-forest/30 transition-all duration-500 flex flex-col justify-between"
                >
                  <Quote className="absolute right-6 top-6 h-8 w-8 text-sand/60 stroke-[1.5]" />

                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-gold mb-4">
                      {Array.from({ length: review.rating }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-current stroke-0" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="font-sans text-charcoal/90 text-sm leading-relaxed mb-6 font-light italic">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  {/* Reviewer Profile */}
                  <div className="flex items-center justify-between pt-5 border-t border-sand/40">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 shrink-0 border border-sand">
                        <AvatarFallback className="bg-forest text-ivory font-serif font-bold text-xs">
                          {review.fallback}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-serif font-bold text-obsidian group-hover:text-forest transition-colors">
                          {review.name}
                        </h4>
                        <span className="text-[10px] font-sans text-stone font-medium block">
                          {review.role}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Carousel Navigation Controls & Indicators */}
          <div className="flex items-center justify-center gap-6 pt-10">
            <button
              onClick={handlePrev}
              aria-label="Previous reviews"
              className="h-10 w-10 rounded-full border border-sand bg-white hover:bg-forest hover:text-white hover:border-forest text-obsidian flex items-center justify-center transition-all cursor-pointer shadow-premium-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to review slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 bg-forest shadow-premium-sm"
                      : "w-2 bg-sand hover:bg-stone"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next reviews"
              className="h-10 w-10 rounded-full border border-sand bg-white hover:bg-forest hover:text-white hover:border-forest text-obsidian flex items-center justify-center transition-all cursor-pointer shadow-premium-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
