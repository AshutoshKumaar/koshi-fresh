"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Free Shipping above ₹499",
  "100% Natural Products",
  "Sourced from Bihar",
  "Premium Quality Guaranteed",
  "COD Available",
];

export function AnnouncementBar() {
  const [index, setIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-forest text-ivory text-[11px] md:text-xs font-sans tracking-wider uppercase font-medium h-9 flex items-center justify-center relative overflow-hidden select-none z-30 cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-center px-4"
        >
          {MESSAGES[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
