"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { HelpCircle, ChevronDown, ShieldCheck, Truck, Package, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "Where is Koshi Fresh Makhana sourced from?",
      answer: "All our foxnuts (Makhana) are harvested directly from wetland farming cooperatives in Madhubani and Darbhanga in Mithilanchal, Bihar — the global home of premium jumbo foxnuts."
    },
    {
      question: "What does 9mm+ Jumbo Grade mean?",
      answer: "9mm+ refers to the seed diameter after popping. Only the top 5% largest, fluffiest, and crunchiest seeds meet this grade standard, offering superior texture and nutrient retention."
    },
    {
      question: "Are your products lab-tested for pesticides?",
      answer: "Yes, every batch undergoes mandatory NABL-certified laboratory testing for pesticide residue, heavy metal safety, and moisture standards prior to packaging."
    },
    {
      question: "What is your standard delivery timeline?",
      answer: "Orders are dispatched within 24 hours. Express shipping delivers across major metro cities in 2-4 business days, and rest of India within 4-6 business days."
    },
    {
      question: "How should I store raw & roasted makhana?",
      answer: "Store in a cool, dry place away from direct sunlight. Once opened, transfer into an airtight container to preserve crispness and natural flavor."
    },
    {
      question: "Do you offer corporate or bulk wholesale pricing?",
      answer: "Yes! We cater to corporate gifting and bulk distributor inquiries. Please contact us via VIP Circle Access or email support@koshifresh.com."
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-sand/10 min-h-screen">
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory py-14 mb-10">
        <Container>
          <div className="max-w-2xl text-center mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> Customer Care FAQ
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-ivory/80 text-sm font-light">
              Got questions about sourcing, shipping, or lab certifications? We've got answers.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-3xl mx-auto space-y-4 mb-14">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-sand/60 overflow-hidden shadow-premium-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-sand/10 transition-colors"
                >
                  <span className="font-serif font-bold text-obsidian text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-forest shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 text-stone text-xs sm:text-sm font-light leading-relaxed border-t border-sand/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-sand/60 text-center space-y-3 shadow-premium-sm">
          <PhoneCall className="h-6 w-6 text-forest mx-auto" />
          <h3 className="font-serif text-lg font-bold text-obsidian">Still have questions?</h3>
          <p className="text-stone text-xs font-light">
            Our support team is available Monday to Saturday, 9 AM – 7 PM IST.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-5 py-2 bg-forest text-white text-xs font-sans font-bold rounded-xl hover:bg-forest-light transition-colors"
          >
            Contact Customer Care
          </Link>
        </div>
      </Container>
    </div>
  );
}
