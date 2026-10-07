"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { OrderProgress } from "@/components/account/order-progress";

const ORDER_IDEMPOTENCY_STORAGE_KEY = "koshi-fresh-order-idempotency-key";
let checkoutOrderIdempotencyKey: string | null = null;

function getOrderIdempotencyKey() {
  let key = checkoutOrderIdempotencyKey;
  try { key ||= window.localStorage.getItem(ORDER_IDEMPOTENCY_STORAGE_KEY); } catch { /* Use the in-memory key when browser storage is unavailable. */ }
  if (!key) {
    key = window.crypto.randomUUID();
    try { window.localStorage.setItem(ORDER_IDEMPOTENCY_STORAGE_KEY, key); } catch { /* The in-memory key still protects retries in this page. */ }
  }
  checkoutOrderIdempotencyKey = key;
  return key;
}

function clearOrderIdempotencyKey(key: string) {
  if (checkoutOrderIdempotencyKey === key) checkoutOrderIdempotencyKey = null;
  try {
    if (window.localStorage.getItem(ORDER_IDEMPOTENCY_STORAGE_KEY) === key) window.localStorage.removeItem(ORDER_IDEMPOTENCY_STORAGE_KEY);
  } catch { /* Storage can be unavailable in privacy-restricted browsers. */ }
}
import { auth } from "@/lib/firebase";

function getVariant(slug: string, variantId: string) {
  return PRODUCTS.find((product) => product.slug === slug)?.variants.find((variant) => variant.id === variantId);
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Truck,
  UserCheck,
  LogIn,
  UserPlus,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useShop();
  const { user, profile, loading: authLoading } = useAuth();

  // Form Fields
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [streetAddress, setStreetAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [pincode, setPincode] = React.useState("");

  const [paymentMethod, setPaymentMethod] = React.useState<"upi" | "cod" | "card">("upi");
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState("");
  const [isOrderPlaced, setIsOrderPlaced] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");
  const [orderTotal, setOrderTotal] = React.useState(0);
  const [orderCreatedAt, setOrderCreatedAt] = React.useState<string | null>(null);
  const [deliveryOptions, setDeliveryOptions] = React.useState<Array<{ courierId: number; courierName: string; shippingCharge: number; estimatedDeliveryDays: number | null }>>([]);
  const [selectedCourierId, setSelectedCourierId] = React.useState<number | null>(null);
  const [isCheckingDelivery, setIsCheckingDelivery] = React.useState(false);
  const [deliveryError, setDeliveryError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Pre-fill user information when available
  React.useEffect(() => {
    if (user) {
      if (!name) setName(profile?.name || user.displayName || "");
      if (!phone && profile?.phone) setPhone(profile.phone);
    }
  }, [user, profile, name, phone]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = getVariant(item.slug, item.variantId)?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const effectiveDiscountAmount = appliedCoupon ? Math.round(subtotal * 0.15) : 0;
  const selectedDelivery = deliveryOptions.find((option) => option.courierId === selectedCourierId) || null;
  const total = Math.max(0, subtotal - effectiveDiscountAmount + (selectedDelivery?.shippingCharge || 0));

  React.useEffect(() => {
    if (!/^\d{6}$/.test(pincode) || cartItems.length === 0) {
      setDeliveryOptions([]);
      setSelectedCourierId(null);
      setIsCheckingDelivery(false);
      setDeliveryError("");
      return;
    }
    let cancelled = false;
    setIsCheckingDelivery(true);
    setDeliveryError("");
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pincode, paymentMethod, cartItems, couponCode: appliedCoupon }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Delivery rates are temporarily unavailable.");
        if (cancelled) return;
        const options = Array.isArray(result.options) ? result.options : [];
        setDeliveryOptions(options);
        setSelectedCourierId((current) => options.some((option: { courierId: number }) => option.courierId === current)
          ? current
          : options.length === 1 ? options[0].courierId : null);
        setDeliveryError(options.length ? "" : result.message || "No delivery service is currently available for this pincode.");
      } catch {
        if (!cancelled) {
          setDeliveryOptions([]);
          setSelectedCourierId(null);
          setDeliveryError("Delivery rates are temporarily unavailable. Check your pincode and try again.");
        }
      } finally {
        if (!cancelled) setIsCheckingDelivery(false);
      }
    }, 450);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [pincode, paymentMethod, cartItems, appliedCoupon]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "KOSHI15" || couponCode.trim().toUpperCase() === "FIRST15") {
      setAppliedCoupon(couponCode.trim().toUpperCase());
      toast({
        title: "Coupon Applied!",
        description: "15% discount has been applied to your order.",
      });
    } else {
      setAppliedCoupon("");
      toast({
        title: "Invalid Code",
        description: "Try code KOSHI15 for 15% off.",
        variant: "error",
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const firebaseUser = auth.currentUser;
    if (!user || !firebaseUser) {
      toast({
        title: "Sign In Required",
        description: "Please sign in or create an account to complete your order.",
        variant: "error",
      });
      return;
    }
    if (!selectedDelivery || !/^\d{6}$/.test(pincode)) {
      toast({ title: "Delivery Option Required", description: "Check delivery availability and select a courier option.", variant: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const idempotencyKey = getOrderIdempotencyKey();
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          customer: { name, phone },
          address: { addressLine1: streetAddress, city, state, pincode },
          paymentMethod,
          cartItems,
          couponCode,
          courierId: selectedDelivery.courierId,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("We couldn’t save your order. Your cart is still here—please try again.");
      setOrderId(result.orderId);
      setOrderTotal(result.total);
      setOrderCreatedAt(result.createdAt ?? new Date().toISOString());
      clearOrderIdempotencyKey(idempotencyKey);
      setIsOrderPlaced(true);
      clearCart();
      toast({ title: "Order Created", description: `Order ${result.orderId} has been received.` });
    } catch {
      toast({ title: "Could Not Place Order", description: "We couldn’t save your order. Your cart is still here—please try again.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-sand/10 pb-24 pt-20 md:pb-20 md:pt-28">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-5 rounded-3xl border border-sand/60 bg-white p-6 shadow-premium-sm sm:p-9">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 text-forest"><CheckCircle2 className="h-8 w-8" /></div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest">Order Created</p>
              <h1 className="font-serif text-3xl font-bold text-obsidian">Thanks! We&apos;ve received your order.</h1>
              <p className="text-sm leading-6 text-stone">Your order is currently waiting for confirmation. Once it is accepted and prepared for dispatch, tracking information will become available.</p>
              <div className="grid gap-4 rounded-2xl bg-sand/20 p-4 text-sm sm:grid-cols-2">
                <div><p className="text-xs text-stone">Order ID</p><p className="mt-1 break-all font-mono font-semibold text-obsidian">{orderId}</p></div>
                <div><p className="text-xs text-stone">Order date</p><p className="mt-1 font-medium text-obsidian">{orderCreatedAt ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(orderCreatedAt)) : "Just now"}</p></div>
                <div><p className="text-xs text-stone">Payment</p><p className="mt-1 font-medium uppercase text-obsidian">{paymentMethod} · Pending</p></div>
                <div><p className="text-xs text-stone">Total</p><p className="mt-1 font-bold text-forest">₹{orderTotal.toFixed(2)}</p></div>
                <div className="sm:col-span-2"><p className="text-xs text-stone">Delivery address</p><p className="mt-1 leading-6 text-obsidian">{streetAddress}, {city}, {state} {pincode}, India</p></div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href={`/account/orders/${encodeURIComponent(orderId)}`} className="inline-flex flex-1 justify-center rounded-xl bg-forest px-4 py-3 text-xs font-bold text-white">View Order Details</Link>
                <Link href="/account/orders" className="inline-flex flex-1 justify-center rounded-xl border border-sand px-4 py-3 text-xs font-bold text-forest">My Orders</Link>
              </div>
            </section>
            <section className="rounded-3xl border border-sand/60 bg-white p-6 shadow-premium-sm sm:p-8">
              <h2 className="mb-5 font-serif text-xl font-bold text-obsidian">Order progress</h2>
              <OrderProgress status="verification_pending" createdAt={orderCreatedAt} />
              <p className="mt-2 rounded-xl bg-sand/20 p-4 text-xs leading-5 text-stone">Tracking will appear here once your order is dispatched.</p>
            </section>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div className="pt-20 pb-24 md:pt-24 md:pb-20 bg-sand/10 min-h-screen">
      <Container>
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-sans text-stone hover:text-forest">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
          </Link>
        </div>

        <h1 className="font-serif text-3xl font-bold text-obsidian mb-8">
          Secure Checkout
        </h1>

        <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-5 pb-36 lg:grid-cols-12 lg:gap-10 lg:pb-0">
          {/* Left Column: Account + Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Account Status */}
            <div className="hidden bg-white rounded-2xl border border-sand/60 p-6 shadow-premium-sm space-y-4 md:block">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-obsidian flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-forest" /> 1. Customer Account
                </h2>
                {user && (
                  <span className="text-[11px] font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Authenticated
                  </span>
                )}
              </div>

              {!authLoading && user ? (
                <div className="p-4 rounded-xl bg-forest/5 border border-forest/15 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone font-sans block">Logged in as:</span>
                    <span className="text-sm font-sans font-bold text-obsidian">
                      {user.displayName || profile?.name || "Customer"}
                    </span>
                    <span className="text-xs text-stone block">{user.email}</span>
                  </div>
                  <Link
                    href="/login?redirect=/checkout"
                    className="text-xs text-forest hover:underline font-medium"
                  >
                    Switch Account
                  </Link>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-gold/10 border border-gold/30 space-y-3">
                  <div>
                    <span className="text-sm font-sans font-bold text-obsidian block">
                      Sign In or Create an Account to Proceed
                    </span>
                    <p className="text-xs text-stone font-light mt-0.5">
                      Creating an account allows you to track shipments, receive harvest drops, and access order history.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href="/login?redirect=/checkout"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest text-white hover:bg-forest-light text-xs font-sans font-bold rounded-xl shadow-premium-sm transition-all"
                    >
                      <LogIn className="h-3.5 w-3.5" /> Sign In
                    </Link>
                    <Link
                      href="/register?redirect=/checkout"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-forest border border-forest/30 hover:bg-forest/5 text-xs font-sans font-bold rounded-xl transition-all"
                    >
                      <UserPlus className="h-3.5 w-3.5" /> Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white rounded-2xl border border-sand/60 p-4 md:p-6 shadow-premium-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-obsidian flex items-center gap-2">
                <Truck className="h-5 w-5 text-forest" /> 2. Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">
                    Full Name <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-sand/10 text-xs h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">
                    Mobile Number <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-sand/10 text-xs h-11"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-sans font-medium text-stone block mb-1">
                    Street Address <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Flat / House No., Colony / Street"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="bg-sand/10 text-xs h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">
                    City <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Patna / New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-sand/10 text-xs h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">
                    State <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Bihar"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="bg-sand/10 text-xs h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-stone block mb-1">
                    Pincode <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    required
                    placeholder="800001"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="bg-sand/10 text-xs h-11"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-sand/60 p-4 md:p-6 shadow-premium-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-obsidian border-b border-sand/50 pb-3">
                Order Summary ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>

              <div className="space-y-3">
                {cartItems.length ? cartItems.map((item) => {
                  const product = PRODUCTS.find((entry) => entry.slug === item.slug);
                  const variant = getVariant(item.slug, item.variantId);
                  if (!product || !variant) return null;
                  return (
                    <div key={`${item.slug}:${item.variantId}`} className="flex justify-between items-center text-xs font-sans">
                      <div>
                        <span className="font-bold text-obsidian block">{product.name}</span>
                        <span className="text-stone font-light">{variant.weight} x {item.quantity}</span>
                      </div>
                      <span className="font-bold text-forest">₹{variant.price * item.quantity}</span>
                    </div>
                  );
                }) : <p className="text-xs text-stone">Your cart is empty. Add products before checkout.</p>}
              </div>

              {/* Coupon Box */}
              <div className="pt-3 border-t border-sand/40">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code (KOSHI15)"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setAppliedCoupon(""); }}
                    className="h-10 text-xs bg-sand/10"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-sand text-obsidian rounded-xl text-xs font-bold hover:bg-forest hover:text-white transition-colors cursor-pointer"
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
                {effectiveDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount (15% OFF)</span>
                    <span>-₹{effectiveDiscountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone">
                  <span>Delivery Charge</span>
                  <span className="font-bold">{isCheckingDelivery ? "Checking…" : selectedDelivery ? `₹${selectedDelivery.shippingCharge}` : "—"}</span>
                </div>
                <div className="pt-2 space-y-2" aria-busy={isCheckingDelivery}>
                  <p className="font-bold text-obsidian">Delivery Options</p>
                  {isCheckingDelivery && <div className="space-y-2 rounded-xl border border-forest/15 bg-forest/[0.03] p-3" role="status" aria-live="polite"><p className="flex items-center gap-2 text-xs font-medium text-forest"><Loader2 className="h-4 w-4 animate-spin" /> Finding delivery options for your pincode…</p><div className="h-12 animate-pulse rounded-lg bg-sand/50" /><div className="h-12 animate-pulse rounded-lg bg-sand/40" /></div>}
                  {!isCheckingDelivery && deliveryError && <p role="status" className="text-feedback-error">{deliveryError}</p>}
                  {!isCheckingDelivery && deliveryOptions.map((option) => (
                    <label key={option.courierId} className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-sand/60 p-3">
                      <span className="flex gap-2">
                        <input type="radio" name="courier" checked={selectedCourierId === option.courierId} onChange={() => setSelectedCourierId(option.courierId)} />
                        <span><span className="block font-bold text-obsidian">{option.courierName}</span><span className="text-stone">Estimated delivery: {option.estimatedDeliveryDays ? `${option.estimatedDeliveryDays} days` : "Not provided"}</span></span>
                      </span>
                      <span className="font-bold text-forest">₹{option.shippingCharge}</span>
                    </label>
                  ))}
                  {!/^\d{6}$/.test(pincode) && <p className="text-stone">Enter a valid 6-digit pincode to see delivery rates.</p>}
                </div>
                <div className="space-y-3 border-t border-sand/40 pt-4">
                  <h3 className="flex items-center gap-2 font-serif text-base font-bold text-obsidian"><CreditCard className="h-5 w-5 text-forest" /> Payment Option</h3>
                  {(["upi", "cod", "card"] as const).map((method) => <label key={method} onClick={() => setPaymentMethod(method)} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${paymentMethod === method ? "border-forest bg-forest/5" : "border-sand/60 bg-white"}`}><input type="radio" name="paymentMethod" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="h-4 w-4 accent-forest" /><span className="text-sm font-semibold text-obsidian">{method === "upi" ? "UPI Instant (GPay / PhonePe / Paytm)" : method === "cod" ? "Cash on Delivery (COD)" : "Credit / Debit Card"}</span>{method === "upi" && <span className="ml-auto text-[10px] font-bold text-forest">Recommended</span>}</label>)}
                </div>
                <div className="flex justify-between text-base font-bold text-obsidian pt-2 border-t border-sand/40">
                  <span>Total Payable</span>
                  <span className="text-forest font-serif text-lg">₹{total}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0 || isCheckingDelivery || !selectedDelivery}
                variant="primary"
                size="lg"
                className="hidden w-full bg-forest hover:bg-forest-light text-white font-sans font-bold h-12 text-sm rounded-xl shadow-premium-md cursor-pointer mt-4 md:flex"
              >
                {isSubmitting ? "Saving Order..." : "Confirm & Place Order"}
              </Button>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-stone font-sans">
                <ShieldCheck className="h-3.5 w-3.5 text-forest" />
                <span>SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </form>
        <div className="fixed inset-x-0 z-30 border-t border-sand/70 bg-white/95 px-3 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden bottom-[calc(4.4rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 shrink-0"><p className="text-[10px] text-stone">Total payable</p><p className="font-serif text-lg font-bold text-forest">₹{total.toFixed(2)}</p></div>
            <Button type="submit" form="checkout-form" disabled={isSubmitting || cartItems.length === 0 || isCheckingDelivery || !selectedDelivery} variant="primary" size="lg" className="h-12 min-w-0 flex-1 rounded-xl bg-forest text-sm font-bold text-white shadow-premium-sm disabled:opacity-50">{isSubmitting ? "Saving Order..." : paymentMethod === "cod" ? "Place COD Order" : "Place Order"}</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
