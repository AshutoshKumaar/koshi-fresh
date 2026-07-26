"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20 bg-sand/10 min-h-screen">
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory py-14 mb-10">
        <Container>
          <div className="max-w-2xl text-center mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              <Lock className="h-3.5 w-3.5" /> Legal & Data Protection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Privacy Policy & Terms
            </h1>
            <p className="text-ivory/80 text-sm font-light">
              Last updated: July 2026. How we protect your data & privacy.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-sand/60 p-6 sm:p-10 shadow-premium-sm space-y-8 text-charcoal font-sans text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-obsidian border-b border-sand/50 pb-2">
              1. Information We Collect
            </h2>
            <p className="text-stone font-light">
              When you place an order or subscribe to Koshi Fresh VIP access, we collect personal details necessary to fulfill your request, including your name, shipping address, email, and phone number.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-obsidian border-b border-sand/50 pb-2">
              2. How We Use Your Data
            </h2>
            <p className="text-stone font-light">
              We process your personal information strictly for order processing, logistics delivery tracking, customer service support, and optional promotional email updates (which you may opt-out of anytime).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-obsidian border-b border-sand/50 pb-2">
              3. Secure Payments & Encryption
            </h2>
            <p className="text-stone font-light">
              Koshi Fresh uses SSL 256-bit encryption for all transactions. We do not store credit/debit card numbers or UPI PINs on our servers. Payments are handled via RBI-compliant gateway partners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-obsidian border-b border-sand/50 pb-2">
              4. Cookies Policy
            </h2>
            <p className="text-stone font-light">
              We use essential cookies to maintain your shopping cart items, session preferences, and anonymous analytics to improve site performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-obsidian border-b border-sand/50 pb-2">
              5. Contact Compliance Officer
            </h2>
            <p className="text-stone font-light">
              If you have any questions regarding your data or privacy rights, please reach out to <strong className="text-forest">privacy@koshifresh.com</strong>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
