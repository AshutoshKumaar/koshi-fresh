"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { OrderProgress, type OrderHistoryEvent } from "@/components/account/order-progress";
import { useAuth } from "@/context/auth-context";
import { normalizeOrderStatus, orderStatusLabel, orderStatusMessage } from "@/lib/order-status";

type Detail = {
  orderId: string; createdAt: string | null; orderStatus: string; statusHistory: OrderHistoryEvent[];
  items: Array<{ name: string; quantity: number; price: number; weight: string; image: string | null }>;
  pricing: { subtotal: number; shipping: number; discount: number; total: number };
  payment: { method: string; status: string };
  address: { addressLine1: string; addressLine2: string; city: string; state: string; pincode: string; country: string };
  shipping: { courier: string | null; courierId: number | null; awb: string | null; trackingUrl: string | null; status: string | null; estimatedDeliveryDate: string | null; shipmentId: string | null; shiprocketStatus: string | null };
};
type TrackData = { status: string | number | null; awb: string | null; courier: string | null; shipmentId: string | null; trackingUrl: string | null; estimatedDeliveryDate: string | null; lastUpdated: string | null; activities: Array<{ status: string; location: string | null; date: string | null }> };

const title = (value: string | null | undefined) => value ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Pending";
const date = (value: string | null) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not available";
const money = (value: number) => `₹${value.toFixed(2)}`;

export default function OrderDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = decodeURIComponent(params.orderId);
  const [order, setOrder] = React.useState<Detail | null>(null);
  const [tracking, setTracking] = React.useState<TrackData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState("");

  const authenticatedFetch = React.useCallback(async (path: string) => {
    if (!user) throw new Error("Please sign in to continue.");
    const token = await user.getIdToken();
    return fetch(path, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  }, [user]);

  React.useEffect(() => {
    if (!authLoading && !user) router.replace(`/login?redirect=${encodeURIComponent(`/account/orders/${orderId}`)}`);
  }, [authLoading, user, router, orderId]);

  React.useEffect(() => {
    if (!user) return;
    let active = true;
    void (async () => {
      try {
        const response = await authenticatedFetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const body = await response.json();
        if (!response.ok || !body.success) throw new Error("Could not load this order.");
        if (active) setOrder(body.order as Detail);
      } catch {
        if (active) setError("Could not load this order. Please try again.");
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [user, authenticatedFetch, orderId]);

  const loadTracking = async () => {
    if (!order?.shipping.awb) return;
    setWorking(true); setError("");
    try {
      const response = await authenticatedFetch(`/api/orders/${encodeURIComponent(orderId)}/tracking`);
      const body = await response.json();
      if (!response.ok) throw new Error("Tracking is temporarily unavailable.");
      setTracking(body.tracking as TrackData | null);
    } catch { setError("Tracking is temporarily unavailable. Please try again later."); }
    finally { setWorking(false); }
  };

  if (authLoading || loading) return <main className="min-h-screen bg-sand/10 pt-20 md:pt-28"><Container><div className="mx-auto max-w-4xl space-y-4" aria-label="Loading order details"><div className="h-5 w-28 animate-pulse rounded bg-sand/70" /><section className="animate-pulse rounded-3xl border border-sand/60 bg-white p-5 sm:p-8"><div className="h-5 w-40 rounded bg-sand/70" /><div className="mt-5 h-24 rounded-2xl bg-sand/40" /><div className="mt-6 space-y-4">{[0,1,2,3].map((item) => <div key={item} className="h-12 rounded-xl bg-sand/40" />)}</div></section><div className="h-40 animate-pulse rounded-3xl bg-white" /></div></Container></main>;
  if (!order) return <main className="min-h-screen bg-sand/10 pt-28 pb-20"><Container><div role="alert" className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-sm text-red-700">{error || "Order not found."}<p className="mt-4"><Link href="/account" className="font-semibold text-forest">Return to account</Link></p></div></Container></main>;

  const status = normalizeOrderStatus(order.orderStatus);
  const exceptional = status === "cancelled" || status === "rto";
  const effectiveTrackingUrl = order.shipping.trackingUrl ?? tracking?.trackingUrl;
  return <main className="min-h-screen bg-sand/10 pb-8 pt-20 md:pb-20 md:pt-28"><Container><div className="mx-auto max-w-4xl space-y-3 md:space-y-5">
    <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-forest"><ArrowLeft className="h-4 w-4" /> My Orders</Link>
    <section className="rounded-3xl border border-sand/60 bg-white p-5 shadow-premium-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-stone">Order details</p><h1 className="mt-1 font-mono text-lg font-bold text-obsidian">#{order.orderId}</h1><p className="mt-1 text-xs text-stone">Placed {date(order.createdAt)}</p></div><span className="rounded-full bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest">{orderStatusLabel(status)}</span></div>
      <p className="mt-5 rounded-2xl bg-sand/20 p-4 text-sm leading-6 text-charcoal">{orderStatusMessage(status)}</p>
      <div className="mt-6"><h2 className="mb-4 font-serif text-lg font-bold text-obsidian">Order progress</h2><OrderProgress status={status} createdAt={order.createdAt} history={order.statusHistory} /></div>
    </section>

    <section className="rounded-3xl border border-sand/60 bg-white p-5 shadow-premium-sm sm:p-8"><h2 className="mb-3 font-serif text-lg font-bold text-obsidian">Items</h2><div className="divide-y divide-sand/50">{order.items.map((item, index) => <div key={`${item.name}-${index}`} className="flex justify-between gap-4 py-4 text-sm"><div><p className="font-semibold text-obsidian">{item.name}</p><p className="mt-1 text-xs text-stone">Quantity {item.quantity}{item.weight ? ` · ${item.weight}` : ""}</p></div><span className="shrink-0 text-charcoal">{money(item.price * item.quantity)}</span></div>)}</div><dl className="space-y-2 border-t border-sand/50 pt-4 text-sm"><div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd>{money(order.pricing.subtotal)}</dd></div><div className="flex justify-between"><dt className="text-stone">Shipping</dt><dd>{money(order.pricing.shipping)}</dd></div>{order.pricing.discount > 0 && <div className="flex justify-between"><dt className="text-stone">Discount</dt><dd>−{money(order.pricing.discount)}</dd></div>}<div className="flex justify-between border-t border-sand/50 pt-3 font-bold"><dt>Total</dt><dd>{money(order.pricing.total)}</dd></div></dl></section>

    <section className="grid gap-5 md:grid-cols-2"><div className="rounded-3xl border border-sand/60 bg-white p-5 shadow-premium-sm sm:p-7"><h2 className="mb-3 font-serif text-lg font-bold text-obsidian">Payment</h2><p className="text-sm text-charcoal">{title(order.payment.method)} · {title(order.payment.status)}</p></div><div className="rounded-3xl border border-sand/60 bg-white p-5 shadow-premium-sm sm:p-7"><h2 className="mb-3 font-serif text-lg font-bold text-obsidian">Delivery address</h2><address className="not-italic text-sm leading-6 text-stone">{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}<br />{order.address.city}, {order.address.state} {order.address.pincode}<br />{order.address.country}</address></div></section>

    <section className="rounded-3xl border border-sand/60 bg-white p-5 shadow-premium-sm sm:p-8"><div className="mb-4 flex items-center gap-2"><PackageCheck className="h-5 w-5 text-forest" /><h2 className="font-serif text-lg font-bold text-obsidian">Shipment</h2></div>
      {order.shipping.awb || order.shipping.trackingUrl ? <><div className="grid gap-3 text-sm sm:grid-cols-2"><p><span className="text-stone">Courier:</span> {order.shipping.courier ?? tracking?.courier ?? "Not provided"}</p><p><span className="text-stone">Tracking ID:</span> {order.shipping.awb ?? tracking?.awb ?? "Not provided"}</p><p><span className="text-stone">Status:</span> {title(String(tracking?.status ?? order.shipping.status ?? "shipped"))}</p>{order.shipping.estimatedDeliveryDate && <p><span className="text-stone">Estimated delivery:</span> {date(order.shipping.estimatedDeliveryDate)}</p>}</div>
        {effectiveTrackingUrl ? <a href={effectiveTrackingUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white">Track Shipment <Truck className="ml-2 h-4 w-4" /></a> : order.shipping.awb ? <button type="button" disabled={working} onClick={() => void loadTracking()} className="mt-5 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{working ? "Loading Tracking..." : "Track Shipment"}</button> : null}
      </> : <div className="rounded-2xl bg-sand/20 p-4"><p className="font-semibold text-obsidian">{exceptional ? orderStatusLabel(status) : "Waiting for Dispatch"}</p><p className="mt-1 text-sm leading-6 text-stone">Your shipment hasn&apos;t been dispatched yet. Tracking information will appear here once your order is dispatched.</p><div className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><p><span className="text-stone">Courier:</span> Will be assigned</p><p><span className="text-stone">Tracking ID:</span> Available after dispatch</p></div></div>}
      {tracking?.activities?.length ? <div className="mt-5 space-y-3 border-t border-sand/50 pt-4">{tracking.activities.map((activity, index) => <div key={`${activity.date}-${index}`} className="border-l-2 border-forest/20 pl-3 text-xs"><p className="font-semibold text-charcoal">{activity.status}</p><p className="mt-1 text-stone">{activity.location ? `${activity.location} · ` : ""}{activity.date ? date(activity.date) : ""}</p></div>)}</div> : null}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <p className="mt-3 text-xs text-stone">Estimated delivery and tracking updates are shown only when available.</p>
    </section>
  </div></Container></main>;
}
