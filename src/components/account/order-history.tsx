"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Package, Truck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { normalizeOrderStatus, orderStatusLabel, orderStatusMessage } from "@/lib/order-status";

type OrderRow = {
  orderId: string; createdAt: string | null; orderStatus: string;
  items: Array<{ name: string; quantity: number; price: number; image: string | null }>;
  pricing: { total: number };
  payment: { method: string; status: string };
  shipping: { courier: string | null; awb: string | null; trackingUrl: string | null; status: string | null; estimatedDeliveryDate: string | null };
};

function label(value: string | null | undefined) {
  return value ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Pending";
}

function dateLabel(value: string | null) {
  return value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)) : "Date unavailable";
}

export function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<OrderRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
        const token = await user?.getIdToken();
        if (!token) throw new Error("Please sign in again to view your orders.");
        const response = await fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        const body = await response.json();
        if (!response.ok || !body.success) throw new Error("Could not load your orders.");
        setOrders(body.orders as OrderRow[]);
      } catch {
        setError("Could not load your orders.");
      } finally { setLoading(false); }
  }, [user]);

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  if (loading) return <div className="space-y-3 py-2" aria-label="Loading orders">{[0, 1].map((item) => <div key={item} className="animate-pulse rounded-2xl border border-sand/60 p-4"><div className="h-4 w-40 rounded bg-sand/60" /><div className="mt-3 h-3 w-24 rounded bg-sand/40" /><div className="mt-5 h-4 w-3/4 rounded bg-sand/50" /><div className="mt-4 h-10 rounded-xl bg-sand/40" /></div>)}</div>;
  if (error) return <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700"><p>We couldn&apos;t load your orders.</p><button type="button" onClick={() => void loadOrders()} className="mt-3 min-h-11 rounded-lg border border-red-200 bg-white px-4 font-semibold text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Try Again</button></div>;
  if (!orders.length) return <div className="space-y-4 py-10 text-center"><Package className="mx-auto h-10 w-10 text-stone/60" /><div><h3 className="font-serif font-bold text-obsidian">No Order History Found</h3><p className="mt-1 text-sm text-stone">Your orders will appear here after checkout.</p></div><Link href="/shop" className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white">Explore Catalog <ArrowRight className="h-3.5 w-3.5" /></Link></div>;

  return <div className="space-y-4">
    {orders.map((order) => {
      const status = normalizeOrderStatus(order.orderStatus);
      return <article key={order.orderId} className="rounded-2xl border border-sand/70 bg-white p-4 shadow-premium-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/account/orders/${encodeURIComponent(order.orderId)}`} className="font-mono text-sm font-bold text-forest hover:underline">Order #{order.orderId}</Link><p className="mt-1 text-xs text-stone">Placed {dateLabel(order.createdAt)}</p></div><span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">{orderStatusLabel(status)}</span></div>
        <div className="my-4 space-y-2">{order.items.map((item, index) => <p key={`${item.name}-${index}`} className="text-sm text-charcoal">{item.name} <span className="text-stone">× {item.quantity}</span></p>)}</div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-sand/60 pt-3 text-xs text-stone"><span className="font-semibold text-obsidian">Total: ₹{order.pricing.total.toFixed(2)}</span><span>Payment: {label(order.payment.method)} · {label(order.payment.status)}</span>{order.shipping.courier && <span>Courier: {order.shipping.courier}</span>}{order.shipping.awb && <span>Tracking ID: {order.shipping.awb}</span>}{order.shipping.estimatedDeliveryDate && <span>Estimated delivery: {dateLabel(order.shipping.estimatedDeliveryDate)}</span>}</div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">{order.shipping.trackingUrl ? <a href={order.shipping.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white sm:w-auto">Track Shipment <Truck className="ml-2 h-4 w-4" /></a> : order.shipping.awb ? <Link href={`/account/orders/${encodeURIComponent(order.orderId)}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white sm:w-auto">Track Shipment <Truck className="ml-2 h-4 w-4" /></Link> : <span className="py-1 text-xs text-stone">{orderStatusMessage(status)}</span>}<Link href={`/account/orders/${encodeURIComponent(order.orderId)}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-forest/30 px-4 text-sm font-semibold text-forest hover:bg-forest/5 sm:w-auto">View Order</Link></div>
      </article>;
    })}
  </div>;
}
