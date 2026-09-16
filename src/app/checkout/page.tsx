"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/shop-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { ArrowLeft, CheckCircle2, CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
  const { setCartCount } = useShop();
  const [paymentMethod, setPaymentMethod] = React.useState<"upi" | "cod" | "card">("upi");
  const [couponCode, setCouponCode] = React.useState("");
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = React.useState(false);

  const sampleCartItems = [
    { product: PRODUCTS[0], weight: "250g", price: 299, qty: 1 },
    { product: PRODUCTS[3], weight: "150g", price: 349, qty: 1 },
  ];

  const subtotal = sampleCartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "KOSHI15" || couponCode.trim().toUpperCase() === "FIRST15") {
      const discount = Math.round(subtotal * 0.15);
      setDiscountAmount(discount);
      toast({
        title: "Coupon Applied!",
        description: "15% discount has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Try code KOSHI15 for 15% off.",
        variant: "error",
      });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrderPlaced(true);
    setCartCount(0);
    toast({
      title: "Order Placed Successfully! 🎉",
      description: "We've received your order. Tracking link sent via SMS.",
    });
  };

  if (isOrderPlaced) {
    return (
      <div className="pt-28 pb-20 bg-sand/10 min-h-screen flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-sand/60 p-8 sm:p-10 text-center shadow-premium-md space-y-5">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
              Order Confirmed!
            </h1>
            <p className="text-stone text-xs sm:text-sm font-light leading-relaxed">
              Thank you for shopping with Koshi Fresh. Your order <strong className="text-forest">#KF-84920</strong> has been confirmed. Freshly harvested batch is being packed.
            </p>
            <div className="p-4 rounded-xl bg-sand/20 text-xs font-sans text-stone space-y-1 text-left border border-sand/50">
              <div className="flex justify-between font-medium text-obsidian">
                <span>Estimated Delivery:</span>
                <span className="text-forest">3-4 Business Days</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between font-bold text-obsidian pt-1 border-t border-sand/40">
                <span>Total Paid:</span>
                <span>₹{total}</span>
              </div>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-3 bg-forest hover:bg-forest-light text-white font-sans font-bold text-xs rounded-xl shadow-premium-sm transition-all"
            >
              Return to Home Page
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-sand/10 min-h-screen">
      <Container>
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-sans text-stone hover:text-forest">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
          </Link>
        </div>

        <h1 className="font-serif text-3xl font-bold text-obsidian mb-8">
          Secure Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-sand/60 p-6 shadow-premium-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-obsidian flex items-center gap-2">
                <Truck className="h-5 w-5 text-forest" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">Full Name</label>
                  <Input required placeholder="Rahul Sharma" className="bg-sand/10 text-xs h-10" />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">Mobile Number</label>
                  <Input required placeholder="+91 98765 43210" className="bg-sand/10 text-xs h-10" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-sans font-medium text-stone block mb-1">Street Address</label>
                  <Input required placeholder="Flat / House No., Colony / Street" className="bg-sand/10 text-xs h-10" />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">City</label>
                  <Input required placeholder="Patna / New Delhi" className="bg-sand/10 text-xs h-10" />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">Pincode</label>
                  <Input required placeholder="800001" className="bg-sand/10 text-xs h-10" />
                </div>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="bg-white rounded-2xl border border-sand/60 p-6 shadow-premium-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-obsidian flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-forest" /> Payment Option
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-forest bg-forest/5 shadow-premium-sm"
                      : "border-sand/60 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "upi"} onChange={() => {}} className="accent-forest" />
                    <div>
                      <span className="text-sm font-sans font-bold text-obsidian block">UPI Instant (GPay / PhonePe / Paytm)</span>
                      <span className="text-xs text-stone font-light">Fast & zero gateway fee</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-forest">Recommended</span>
                </label>

                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-forest bg-forest/5 shadow-premium-sm"
                      : "border-sand/60 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "cod"} onChange={() => {}} className="accent-forest" />
                    <div>
                      <span className="text-sm font-sans font-bold text-obsidian block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-stone font-light">Pay cash upon delivery</span>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-forest bg-forest/5 shadow-premium-sm"
                      : "border-sand/60 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "card"} onChange={() => {}} className="accent-forest" />
                    <div>
                      <span className="text-sm font-sans font-bold text-obsidian block">Credit / Debit Card</span>
                      <span className="text-xs text-stone font-light">Visa, MasterCard, RuPay</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-sand/60 p-6 shadow-premium-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-obsidian border-b border-sand/50 pb-3">
                Order Summary ({sampleCartItems.length} items)
              </h2>

              <div className="space-y-3">
                {sampleCartItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-sans">
                    <div>
                      <span className="font-bold text-obsidian block">{item.product.name}</span>
                      <span className="text-stone font-light">{item.weight} x {item.qty}</span>
                    </div>
                    <span className="font-bold text-forest">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Box */}
              <div className="pt-3 border-t border-sand/40">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code (KOSHI15)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-10 text-xs bg-sand/10"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-sand text-obsidian rounded-xl text-xs font-bold hover:bg-forest hover:text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="space-y-2 pt-3 border-t border-sand/40 text-xs font-sans">
                <div className="flex justify-between text-stone">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount (15% OFF)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone">
                  <span>Delivery Charge</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-obsidian pt-2 border-t border-sand/40">
                  <span>Total Payable</span>
                  <span className="text-forest font-serif text-lg">₹{total}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-forest hover:bg-forest-light text-white font-sans font-bold h-12 text-sm rounded-xl shadow-premium-md cursor-pointer mt-4"
              >
                Confirm & Place Order
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
