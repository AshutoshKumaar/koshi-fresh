"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: "Message Sent Successfully! ✨",
      description: "Thank you for reaching out to Koshi Fresh. Our team will contact you within 24 hours.",
    });
  };

  return (
    <div className="bg-sand/10 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory pt-28 md:pt-32 pb-16 md:pb-20 mb-12">
        <Container>
          <div className="max-w-3xl text-center mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              <Mail className="h-3.5 w-3.5" /> VIP Circle & Contact Us
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Get in Touch with Koshi Fresh
            </h1>
            <p className="text-ivory/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Have questions about order tracking, bulk corporate gifting, or farm sourcing? Send us a message and we'll reply promptly.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          
          {/* Left Column: Contact Cards & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-sand/60 p-6 sm:p-8 shadow-premium-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-obsidian">Contact Details</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-forest/10 rounded-xl text-forest shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-bold text-obsidian uppercase tracking-wider block">Email Support</span>
                    <a href="mailto:support@koshifresh.com" className="text-stone text-sm font-light hover:text-forest transition-colors">
                      support@koshifresh.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-forest/10 rounded-xl text-forest shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-bold text-obsidian uppercase tracking-wider block">Customer Care Hotline</span>
                    <a href="tel:+919876543210" className="text-stone text-sm font-light hover:text-forest transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-forest/10 rounded-xl text-forest shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-bold text-obsidian uppercase tracking-wider block">Working Hours</span>
                    <span className="text-stone text-sm font-light">Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-3 border-t border-sand/40">
                  <div className="p-3 bg-forest/10 rounded-xl text-forest shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-bold text-obsidian uppercase tracking-wider block">Farm Origin & HQ</span>
                    <span className="text-stone text-sm font-light leading-relaxed block">
                      Koshi Fresh Sourcing Co-op Hub,<br />
                      Madhubani, Mithilanchal, Bihar – 847211
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Gifting Callout */}
            <div className="p-6 rounded-3xl bg-forest text-white space-y-3 shadow-premium-md">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gold-light">
                🎁 Corporate & Wholesale
              </span>
              <h3 className="font-serif text-xl font-bold">Custom Gifting Orders</h3>
              <p className="text-ivory/80 text-xs font-light leading-relaxed">
                Looking for customized health hampers for employee gifting or wedding favors? Email us at <strong className="text-gold-light">corporate@koshifresh.com</strong>.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-sand/60 p-6 sm:p-10 shadow-premium-md space-y-6">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-obsidian">Thank You!</h3>
                  <p className="text-stone text-sm font-light max-w-sm mx-auto">
                    Your message has been received. Our customer relationship executive will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-forest text-white rounded-xl text-xs font-sans font-bold hover:bg-forest-light transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-obsidian">Send Us a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-sans font-medium text-stone block mb-1">Your Full Name</label>
                      <Input
                        required
                        placeholder="Amit Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-sand/10 text-xs h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-sans font-medium text-stone block mb-1">Email Address</label>
                      <Input
                        type="email"
                        required
                        placeholder="amit@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-sand/10 text-xs h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-sans font-medium text-stone block mb-1">Phone Number</label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-sand/10 text-xs h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-sans font-medium text-stone block mb-1">Inquiry Type</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-sand/10 border border-sand/60 rounded-xl px-3 h-11 text-xs font-sans text-obsidian focus:outline-none cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order Tracking">Order Tracking</option>
                        <option value="Corporate Gifting">Corporate Gifting</option>
                        <option value="Wholesale Distribution">Wholesale Distribution</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-sans font-medium text-stone block mb-1">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your message or inquiry here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-sand/10 border border-sand/60 rounded-xl p-3 text-xs font-sans text-obsidian focus:outline-none placeholder:text-stone/60"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-forest hover:bg-forest-light text-white font-sans font-bold h-12 text-sm rounded-xl shadow-premium-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    Submit Message <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
