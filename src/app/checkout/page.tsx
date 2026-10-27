"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { OrderProgress } from "@/components/account/order-progress";
import { normalizeIndianMobileDigits, validateCheckoutField, validateCheckoutValues, type CheckoutField, type CheckoutValues } from "@/lib/checkout-validation";
import { auth } from "@/lib/firebase";
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
  Plus,
  Trash2,
} from "lucide-react";

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
function getVariant(slug: string, variantId: string) {
  return PRODUCTS.find((product) => product.slug === slug)?.variants.find((variant) => variant.id === variantId);
}

const CHECKOUT_ADD_ON_SLUGS = ["premium-roasted-makhana", "roasted-salted-cashews", "premium-california-almonds", "premium-raw-makhana"];

function InlineFieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} role="alert" className="mt-1 text-xs font-medium text-feedback-error">{message}</p> : null;
}

export default function CheckoutPage() {
  const { cartItems, clearCart, addToCart, removeFromCart } = useShop();
  const { user, profile, loading: authLoading } = useAuth();

  // Form Fields
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [streetAddress, setStreetAddress] = React.useState("");
  const [locality, setLocality] = React.useState("");
  const [landmark, setLandmark] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [businessOrder, setBusinessOrder] = React.useState(false);
  const [businessName, setBusinessName] = React.useState("");
  const [gstin, setGstin] = React.useState("");
  const [touchedFields, setTouchedFields] = React.useState<Partial<Record<CheckoutField, boolean>>>({});
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<CheckoutField, string>>>({});

  const [paymentMethod, setPaymentMethod] = React.useState<"upi" | "cod" | "card">("upi");
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState("");
  const [couponError, setCouponError] = React.useState("");
  const [isAddOnSkipped, setIsAddOnSkipped] = React.useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");
  const [orderTotal, setOrderTotal] = React.useState(0);
  const [orderCreatedAt, setOrderCreatedAt] = React.useState<string | null>(null);
  const [deliveryOptions, setDeliveryOptions] = React.useState<Array<{ courierId: number; courierName: string; shippingCharge: number; estimatedDeliveryDays: number | null }>>([]);
  const [selectedCourierId, setSelectedCourierId] = React.useState<number | null>(null);
  const [isCheckingDelivery, setIsCheckingDelivery] = React.useState(false);
  const [deliveryError, setDeliveryError] = React.useState("");
  const [courierSelectionError, setCourierSelectionError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const checkoutValues: CheckoutValues = { name, phone, streetAddress, locality, landmark, city, state, pincode, businessName, gstin };
  const updateCheckoutField = (field: CheckoutField, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(value);
    setTouchedFields((current) => ({ ...current, [field]: true }));
    setFieldErrors((current) => ({ ...current, [field]: validateCheckoutField(field, value, businessOrder) || undefined }));
  };
  const touchCheckoutField = (field: CheckoutField, value: string) => {
    setTouchedFields((current) => ({ ...current, [field]: true }));
    setFieldErrors((current) => ({ ...current, [field]: validateCheckoutField(field, value, businessOrder) || undefined }));
  };
  const visibleError = (field: CheckoutField) => touchedFields[field] ? fieldErrors[field] : undefined;

  // Pre-fill user information when available
  React.useEffect(() => {
    if (user) {
      if (!name) setName(profile?.name || user.displayName || "");
      if (!phone && profile?.phone) setPhone(normalizeIndianMobileDigits(profile.phone));
    }
  }, [user, profile, name, phone]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = getVariant(item.slug, item.variantId)?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const effectiveDiscountAmount = appliedCoupon ? Math.round(subtotal * 0.15) : 0;
  const productSavings = cartItems.reduce((sum, item) => {
    const variant = getVariant(item.slug, item.variantId);
    const savingPerItem = variant?.originalPrice && variant.originalPrice > variant.price
      ? variant.originalPrice - variant.price
      : 0;
    return sum + savingPerItem * item.quantity;
  }, 0);
  const totalSavings = productSavings + effectiveDiscountAmount;
  const selectedDelivery = deliveryOptions.find((option) => option.courierId === selectedCourierId) || null;
  const checkoutAddOn = CHECKOUT_ADD_ON_SLUGS
    .map((slug) => PRODUCTS.find((product) => product.slug === slug))
    .find((product) => product && !cartItems.some((item) => item.slug === product.slug));
  const checkoutAddOnVariant = checkoutAddOn?.variants.find((variant) => variant.inStock);
  const checkoutAddOnSaving = checkoutAddOnVariant?.originalPrice && checkoutAddOnVariant.originalPrice > checkoutAddOnVariant.price
    ? checkoutAddOnVariant.originalPrice - checkoutAddOnVariant.price
    : 0;
  const total = Math.max(0, subtotal - effectiveDiscountAmount + (selectedDelivery?.shippingCharge || 0));

  React.useEffect(() => {
    if (!/^[1-9]\d{5}$/.test(pincode) || cartItems.length === 0) {
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
      setCouponError("");
      toast({
        title: "Coupon Applied!",
        description: "15% discount has been applied to your order.",
      });
    } else {
      setAppliedCoupon("");
      setCouponError("That coupon code is not valid. Try KOSHI15 or FIRST15.");
      toast({
        title: "Invalid Code",
        description: "Try code KOSHI15 for 15% off.",
        variant: "error",
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateCheckoutValues(checkoutValues, businessOrder);
    setTouchedFields({ name: true, phone: true, streetAddress: true, locality: true, landmark: true, city: true, state: true, pincode: true, businessName: true, gstin: true });
    setFieldErrors(errors);
    const firstInvalidField = (Object.keys(errors) as CheckoutField[])[0];
    if (firstInvalidField) {
      document.getElementById(`checkout-${firstInvalidField}`)?.focus();
      return;
    }

    const firebaseUser = auth.currentUser;
    if (!user || !firebaseUser) {
      toast({
        title: "Sign In Required",
        description: "Please sign in or create an account to complete your order.",
        variant: "error",
      });
      return;
    }
    if (!selectedDelivery || !/^[1-9]\d{5}$/.test(pincode)) {
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
          customer: { name, phone: `+91${phone}`, businessName: businessOrder ? businessName.trim() : "", gstin: businessOrder ? gstin.trim().toUpperCase() : "" },
          address: { addressLine1: streetAddress, addressLine2: locality, landmark, city, state, pincode },
          paymentMethod,
          cartItems,
          couponCode,
          courierId: selectedDelivery.courierId,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(typeof result?.message === "string" ? result.message : "We couldn’t save your order. Your cart is still here—please try again.");
      }
      setOrderId(result.orderId);
      setOrderTotal(result.total);
      setOrderCreatedAt(result.createdAt ?? new Date().toISOString());
      clearOrderIdempotencyKey(idempotencyKey);
      setIsOrderPlaced(true);
      clearCart();
      toast({ title: "Order Created", description: `Order ${result.orderId} has been received.` });
    } catch (error) {
      toast({
        title: "Could Not Place Order",
        description: error instanceof Error ? error.message : "We couldn’t save your order. Your cart is still here—please try again.",
        variant: "error",
      });
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
                <div className="sm:col-span-2"><p className="text-xs text-stone">Delivery address</p><p className="mt-1 leading-6 text-obsidian">{streetAddress}, {locality}{landmark ? `, near ${landmark}` : ""}, {city}, {state} {pincode}, India</p></div>
                {businessOrder && <div className="sm:col-span-2"><p className="text-xs text-stone">Business invoice details</p>{businessName && <p className="mt-1 text-sm font-semibold text-obsidian">{businessName}</p>}{gstin && <p className="mt-1 text-sm text-charcoal">GSTIN: {gstin}</p>}</div>}
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
    <div className="flex min-h-screen flex-col bg-sand/10 pt-16 pb-0 md:bg-sand/10 md:pt-24 md:pb-20">
      <Container className="flex flex-1 flex-col">
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-sans text-stone hover:text-forest">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
          </Link>
        </div>

        <h1 className="font-serif text-3xl font-bold text-obsidian mb-8">
          Secure Checkout
        </h1>

    <form id="checkout-form" noValidate onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-10">
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
                  <label htmlFor="checkout-name" className="text-xs font-sans font-medium text-stone block mb-1">
                    Full Name <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    id="checkout-name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => updateCheckoutField("name", e.target.value, setName)}
                    onBlur={() => touchCheckoutField("name", name)}
                    aria-invalid={Boolean(visibleError("name"))}
                    aria-describedby={visibleError("name") ? "checkout-name-error" : undefined}
                    className={`h-11 bg-sand/10 text-sm ${visibleError("name") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                  />
                  <InlineFieldError id="checkout-name-error" message={visibleError("name")} />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="text-xs font-sans font-medium text-stone block mb-1">
                    Mobile Number (+91) <span className="text-feedback-error">*</span>
                  </label>
                  <div className="relative">
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center border-r border-sand pr-3 text-sm font-semibold text-charcoal">+91</span>
                    <Input
                      id="checkout-phone"
                      required
                      type="tel"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      maxLength={16}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => updateCheckoutField("phone", normalizeIndianMobileDigits(e.target.value), setPhone)}
                      onBlur={() => touchCheckoutField("phone", phone)}
                      aria-invalid={Boolean(visibleError("phone"))}
                      aria-describedby={visibleError("phone") ? "checkout-phone-error" : undefined}
                      className={`h-11 bg-sand/10 pl-[4.25rem] text-sm ${visibleError("phone") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                    />
                  </div>
                  <InlineFieldError id="checkout-phone-error" message={visibleError("phone")} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-streetAddress" className="text-xs font-sans font-medium text-stone block mb-1">
                    House / Flat / Building <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    id="checkout-streetAddress"
                    required
                    maxLength={120}
                    autoComplete="address-line1"
                    placeholder="Flat, house number, building"
                    value={streetAddress}
                    onChange={(e) => updateCheckoutField("streetAddress", e.target.value, setStreetAddress)}
                    onBlur={() => touchCheckoutField("streetAddress", streetAddress)}
                    aria-invalid={Boolean(visibleError("streetAddress"))}
                    aria-describedby={visibleError("streetAddress") ? "checkout-streetAddress-error" : undefined}
                    className={`h-11 bg-sand/10 text-sm ${visibleError("streetAddress") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                  />
                  <InlineFieldError id="checkout-streetAddress-error" message={visibleError("streetAddress")} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-locality" className="text-xs font-sans font-medium text-stone block mb-1">
                    Area / Street / Locality <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    id="checkout-locality"
                    required
                    maxLength={120}
                    autoComplete="address-line2"
                    placeholder="Road, neighbourhood, or locality"
                    value={locality}
                    onChange={(event) => updateCheckoutField("locality", event.target.value, setLocality)}
                    onBlur={() => touchCheckoutField("locality", locality)}
                    aria-invalid={Boolean(visibleError("locality"))}
                    aria-describedby={visibleError("locality") ? "checkout-locality-error" : undefined}
                    className={`h-11 bg-sand/10 text-sm ${visibleError("locality") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                  />
                  <InlineFieldError id="checkout-locality-error" message={visibleError("locality")} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-landmark" className="text-xs font-sans font-medium text-stone block mb-1">Landmark <span className="font-normal text-stone/80">(optional)</span></label>
                  <Input
                    id="checkout-landmark"
                    autoComplete="off"
                    maxLength={100}
                    placeholder="Nearby shop, school, or other landmark"
                    value={landmark}
                    onChange={(event) => updateCheckoutField("landmark", event.target.value, setLandmark)}
                    onBlur={() => touchCheckoutField("landmark", landmark)}
                    aria-invalid={Boolean(visibleError("landmark"))}
                    aria-describedby={visibleError("landmark") ? "checkout-landmark-error" : undefined}
                    className={`h-11 bg-sand/10 text-sm ${visibleError("landmark") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                  />
                  <InlineFieldError id="checkout-landmark-error" message={visibleError("landmark")} />
                </div>
                <div>
                  <label htmlFor="checkout-city" className="text-xs font-sans font-medium text-stone block mb-1">
                    City <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    id="checkout-city"
                    required
                    maxLength={80}
                    autoComplete="address-level2"
                    placeholder="Patna"
                    value={city}
                    onChange={(e) => updateCheckoutField("city", e.target.value, setCity)}
                    onBlur={() => touchCheckoutField("city", city)}
                    aria-invalid={Boolean(visibleError("city"))}
                    aria-describedby={visibleError("city") ? "checkout-city-error" : undefined}
                    className={`h-11 bg-sand/10 text-sm ${visibleError("city") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                  />
                  <InlineFieldError id="checkout-city-error" message={visibleError("city")} />
                </div>
                <div>
                  <label htmlFor="checkout-state" className="text-xs font-sans font-medium text-stone block mb-1">
                    State <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    id="checkout-state"
                    required
                    maxLength={80}
                    autoComplete="address-level1"
                    placeholder="Bihar"
                    value={state}
                    onChange={(e) => updateCheckoutField("state", e.target.value, setState)}
                    onBlur={() => touchCheckoutField("state", state)}
                    aria-invalid={Boolean(visibleError("state"))}
                    aria-describedby={visibleError("state") ? "checkout-state-error" : undefined}
                    className={`h-11 bg-sand/10 text-sm ${visibleError("state") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                  />
                  <InlineFieldError id="checkout-state-error" message={visibleError("state")} />
                </div>
                <div>
                  <label htmlFor="checkout-pincode" className="text-xs font-sans font-medium text-stone block mb-1">
                    Pincode <span className="text-feedback-error">*</span>
                  </label>
                  <Input
                    id="checkout-pincode"
                    required
                    placeholder="800001"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    value={pincode}
                    onChange={(e) => { updateCheckoutField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6), setPincode); setCourierSelectionError(""); }}
                    onBlur={() => touchCheckoutField("pincode", pincode)}
                    aria-invalid={Boolean(visibleError("pincode"))}
                    aria-describedby={visibleError("pincode") ? "checkout-pincode-error" : undefined}
                    className={`h-11 bg-sand/10 text-sm ${visibleError("pincode") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`}
                  />
                  <InlineFieldError id="checkout-pincode-error" message={visibleError("pincode")} />
                </div>
              </div>
              <div className="space-y-3 border-t border-sand/40 pt-4">
                <label htmlFor="checkout-business" className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand/60 bg-ivory/50 p-3">
                  <input
                    id="checkout-business"
                    type="checkbox"
                    checked={businessOrder}
                    onChange={(event) => {
                      const enabled = event.target.checked;
                      setBusinessOrder(enabled);
                      if (!enabled) {
                        setBusinessName("");
                        setGstin("");
                        setFieldErrors((current) => ({ ...current, businessName: undefined, gstin: undefined }));
                        setTouchedFields((current) => ({ ...current, businessName: false, gstin: false }));
                      } else {
                        setTouchedFields((current) => ({ ...current, businessName: true }));
                        setFieldErrors((current) => ({ ...current, businessName: validateCheckoutField("businessName", businessName, true) || undefined }));
                      }
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
                  />
                  <span><span className="block text-sm font-semibold text-obsidian">This is a business purchase</span><span className="mt-0.5 block text-xs leading-5 text-stone">Add your business details for the invoice. GSTIN is optional.</span></span>
                </label>
                {businessOrder && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-businessName" className="mb-1 block text-xs font-medium text-stone">Business name <span className="text-feedback-error">*</span></label>
                      <Input id="checkout-businessName" required autoComplete="organization" maxLength={120} placeholder="Registered business name" value={businessName} onChange={(event) => updateCheckoutField("businessName", event.target.value, setBusinessName)} onBlur={() => touchCheckoutField("businessName", businessName)} aria-invalid={Boolean(visibleError("businessName"))} aria-describedby={visibleError("businessName") ? "checkout-businessName-error" : undefined} className={`h-11 bg-sand/10 text-sm ${visibleError("businessName") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`} />
                      <InlineFieldError id="checkout-businessName-error" message={visibleError("businessName")} />
                    </div>
                    <div>
                      <label htmlFor="checkout-gstin" className="mb-1 block text-xs font-medium text-stone">GSTIN <span className="font-normal text-stone/80">(optional)</span></label>
                      <Input id="checkout-gstin" autoCapitalize="characters" maxLength={15} placeholder="15-character GSTIN" value={gstin} onChange={(event) => updateCheckoutField("gstin", event.target.value.toUpperCase().replace(/\s/g, "").slice(0, 15), setGstin)} onBlur={() => touchCheckoutField("gstin", gstin)} aria-invalid={Boolean(visibleError("gstin"))} aria-describedby={visibleError("gstin") ? "checkout-gstin-error" : "checkout-gstin-hint"} className={`h-11 bg-sand/10 text-sm uppercase ${visibleError("gstin") ? "border-feedback-error focus-visible:ring-feedback-error" : ""}`} />
                      <InlineFieldError id="checkout-gstin-error" message={visibleError("gstin")} />
                      {!visibleError("gstin") && <p id="checkout-gstin-hint" className="mt-1 text-xs leading-5 text-stone">GSTIN is saved with your order for business invoice processing. TDS or tax-credit eligibility depends on applicable tax rules.</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-sand/60 p-4 md:p-6 shadow-premium-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-obsidian border-b border-sand/50 pb-3">
                Order Summary ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>

              <div className="max-h-64 space-y-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] sm:max-h-80 md:max-h-none md:overflow-visible md:pr-0">
                {cartItems.length ? cartItems.map((item) => {
                  const product = PRODUCTS.find((entry) => entry.slug === item.slug);
                  const variant = getVariant(item.slug, item.variantId);
                  if (!product || !variant) return null;
                  return (
                    <div key={`${item.slug}:${item.variantId}`} className="flex items-center gap-2.5 rounded-xl border border-sand/60 bg-gradient-to-r from-white to-ivory/70 p-2.5 text-xs font-sans shadow-sm">
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-2 break-words font-semibold leading-4 text-obsidian">{product.name}</span>
                        <span className="mt-1 block text-[11px] text-stone">{variant.weight} × {item.quantity}</span>
                      </div>
                      <span className="shrink-0 whitespace-nowrap font-bold text-forest">₹{(variant.price * item.quantity).toFixed(0)}</span>
                      <button type="button" onClick={() => { removeFromCart(item.slug, item.variantId); toast({ title: "Removed from your order", description: `${product.name} was removed from your cart.` }); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-red-100 bg-red-50 text-red-700 transition-colors hover:border-red-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label={`Remove ${product.name} (${variant.weight}) from cart`} title="Remove from order">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                }) : <p className="text-xs text-stone">Your cart is empty. Add products before checkout.</p>}
              </div>

              {!isAddOnSkipped && checkoutAddOn && checkoutAddOnVariant && (
                <section className="overflow-hidden rounded-2xl border border-gold/35 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-3 shadow-premium-sm">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">Quick add-on</span>
                    {checkoutAddOnSaving > 0 && <span className="text-[10px] font-bold text-emerald-700">Save ₹{checkoutAddOnSaving}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-sand/50 bg-white">
                      <Image src={checkoutAddOn.images[0]} alt={checkoutAddOn.name} fill sizes="56px" className="object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-bold leading-4 text-obsidian">{checkoutAddOn.name}</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-forest">₹{checkoutAddOnVariant.price}</span>
                        {checkoutAddOnSaving > 0 && <span className="text-[10px] text-stone line-through">₹{checkoutAddOnVariant.originalPrice}</span>}
                        <span className="text-[10px] text-stone">· {checkoutAddOnVariant.weight}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(checkoutAddOn.slug, checkoutAddOnVariant.id);
                        toast({ title: "Added to your order", description: `${checkoutAddOn.name} (${checkoutAddOnVariant.weight}) was added to your cart.` });
                      }}
                      className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl bg-forest px-3 text-xs font-bold text-white shadow-premium-sm transition-colors hover:bg-forest-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      aria-label={`Add ${checkoutAddOn.name}, ${checkoutAddOnVariant.weight}, to your order`}
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                  <button type="button" onClick={() => setIsAddOnSkipped(true)} className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl border border-forest/20 bg-white text-xs font-semibold text-forest transition-colors hover:bg-forest/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest" aria-label="Skip add-on and continue to checkout">No thanks, continue to checkout</button>
                </section>
              )}

              {/* Coupon Box */}
              <div className="pt-3 border-t border-sand/40">
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      id="checkout-coupon"
                      maxLength={24}
                      autoComplete="off"
                      placeholder="Enter code (KOSHI15)"
                      value={couponCode}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 24);
                        setCouponCode(value);
                        setAppliedCoupon("");
                        const normalized = value.trim().toUpperCase();
                        setCouponError(normalized && normalized !== "KOSHI15" && normalized !== "FIRST15" ? "Code not recognized. Try KOSHI15 or FIRST15." : "");
                      }}
                      aria-invalid={Boolean(couponError)}
                      aria-describedby={couponError ? "checkout-coupon-error" : appliedCoupon ? "checkout-coupon-success" : undefined}
                      className={`h-10 bg-sand/10 text-sm ${couponError ? "border-feedback-error" : ""}`}
                    />
                    {couponError && <p id="checkout-coupon-error" role="alert" className="mt-1 text-xs font-medium text-feedback-error">{couponError}</p>}
                    {appliedCoupon && <p id="checkout-coupon-success" role="status" className="mt-1 text-xs font-medium text-emerald-700">{appliedCoupon} applied. You save ₹{effectiveDiscountAmount}.</p>}
                  </div>
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
                    <label key={option.courierId} className={`flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3 ${selectedCourierId === option.courierId ? "border-forest bg-forest/5" : "border-sand/60"}`}>
                      <span className="flex gap-2">
                        <input type="radio" name="courier" checked={selectedCourierId === option.courierId} onChange={() => { setSelectedCourierId(option.courierId); setCourierSelectionError(""); }} className="mt-1 h-4 w-4 accent-forest" />
                        <span><span className="block font-bold text-obsidian">{option.courierName}</span><span className="text-stone">Estimated delivery: {option.estimatedDeliveryDays ? `${option.estimatedDeliveryDays} days` : "Not provided"}</span></span>
                      </span>
                      <span className="font-bold text-forest">₹{option.shippingCharge}</span>
                    </label>
                  ))}
                  {!isCheckingDelivery && deliveryOptions.length > 0 && !selectedDelivery && !courierSelectionError && <p id="checkout-courier-error" role="status" className="text-xs font-medium text-feedback-error">Choose a delivery option to continue.</p>}
                  {courierSelectionError && <p id="checkout-courier-error" role="alert" className="text-xs font-medium text-feedback-error">{courierSelectionError}</p>}
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
        <section aria-label="Koshi Fresh thank you message" className="-mx-4 relative mt-1 min-h-28 flex-1 overflow-hidden pb-[calc(9rem+env(safe-area-inset-bottom))] pt-2.5 md:hidden">
          <p className="sr-only">Thank you for shopping with Koshi Fresh. Sourced from Mithila, packed with care, and here to help.</p>
          <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-y border-gold/45 bg-forest-dark/65 py-3 shadow-[0_0_24px_rgba(0,0,0,0.14)]">
            <div className="animate-marquee flex w-max items-center">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-5 px-3">
                  {["Thank you for shopping with Koshi Fresh", "Sourced from Mithila", "Packed with care", "Here to help with every order"].map((message) => (
                    <span key={message} className="inline-flex items-center gap-5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory">
                      {message}<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-light" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          </section>
        <div className="fixed inset-x-0 z-30 border-t border-sand/70 bg-white/95 px-3 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden bottom-[calc(62px+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center gap-3 pb-2">
              <div className="min-w-0 shrink-0"><p className="text-[10px] text-stone">Total payable</p><p className="font-serif text-lg font-bold text-forest">₹{total.toFixed(2)}</p></div>
              <Button type="submit" form="checkout-form" disabled={isSubmitting || cartItems.length === 0 || isCheckingDelivery || !selectedDelivery} variant="primary" size="lg" className="h-12 min-w-0 flex-1 rounded-xl bg-forest text-sm font-bold text-white shadow-premium-sm disabled:opacity-50">{isSubmitting ? "Saving Order..." : paymentMethod === "cod" ? "Place COD Order" : "Place Order"}</Button>
            </div>
            <div className="-mx-3 flex min-h-9 items-center justify-center gap-2 border-t border-emerald-100 bg-emerald-50 px-3 py-1.5 text-center text-xs font-semibold text-emerald-800">
              <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-900">₹</span>
              {totalSavings > 0 ? `You save ₹${totalSavings.toFixed(2)} on this order` : "Use KOSHI15 at checkout to save 15%"}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
