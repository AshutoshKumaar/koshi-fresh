"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-emerald-950 via-forest-dark to-black text-ivory border-t border-gold/30 pt-16 pb-12 font-sans relative overflow-hidden select-none">
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Multi-Column Grid */}
        <div className="grid gap-12 lg:grid-cols-12 mb-16">
          {/* Column 1: Brand Info & Mission */}
          <div className="lg:col-span-6 space-y-5">
            <Link href="/" className="font-serif text-3xl text-white font-bold tracking-tight inline-block hover:text-gold-light transition-colors">
              Koshi Fresh
            </Link>
            <p className="text-sm font-light text-ivory/80 leading-relaxed max-w-md">
              Sourcing the finest 9mm+ jumbo grade raw and roasted foxnuts directly from wetland farming cooperatives in Mithilanchal, Bihar. Bringing pure, chemical-free superfoods straight to your doorstep.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-gold-light bg-gold/20 border border-gold/40 px-3 py-1 rounded-full shadow-premium-sm">
                <Award className="h-3 w-3 text-gold-light" /> 100% Organic Sourced
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full shadow-premium-sm">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> FSSAI & NABL Certified
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-gold-light font-bold font-sans">
                Explore Catalog
              </h4>
              <ul className="space-y-2.5 text-sm font-light text-ivory/80">
                <li><Link href="/shop" className="hover:text-gold-light transition-colors">Shop All Products</Link></li>
                <li><Link href="/#categories" className="hover:text-gold-light transition-colors">Featured Categories</Link></li>
                <li><Link href="/#comparison" className="hover:text-gold-light transition-colors">Clinical Breakdown</Link></li>
                <li><Link href="/#benefits" className="hover:text-gold-light transition-colors">Health Benefits</Link></li>
                <li><Link href="/#story" className="hover:text-gold-light transition-colors">Sourcing Heritage</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-gold-light font-bold font-sans">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-sm font-light text-ivory/80">
                <li><Link href="/about" className="hover:text-gold-light transition-colors">Our Story & Farm Co-ops</Link></li>
                <li><Link href="/#contact" className="hover:text-gold-light transition-colors">VIP Circle Access</Link></li>
                <li><Link href="/faq" className="hover:text-gold-light transition-colors">Shipping & Delivery FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-gold-light transition-colors">Privacy & Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-white/15 mb-8" />

        {/* Footer Bottom Rights */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-light text-ivory/60 gap-4">
          <span>&copy; {new Date().getFullYear()} Koshi Fresh. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span>Harvested in Mithilanchal, Bihar</span>
            <span className="flex items-center gap-1 text-gold-light font-medium">
              Crafted with <Heart className="h-3 w-3 fill-gold text-gold" /> for Health
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
