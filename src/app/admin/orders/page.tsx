"use client";

import * as React from "react";
import Link from "next/link";
import { Search, RefreshCw, ArrowUpRight, PackageCheck, Clock3 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/context/auth-context";
import { orderStatusLabel } from "@/lib/order-status";

type AdminOrder = {
  orderId: string; createdAt: string | null; orderStatus: string;
  customer: { name: string; email: string; phone: string };
  items: Array<{ name: string; quantity: number }>;
  pricing: { total: number };
  payment: { method: string; status: string };
  shipping: { trackingId: string | null; courier: string | null };
};

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
const date = (value: string | null) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Date unavailable";

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadOrders = React.useCallback(async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const token = await user.getIdToken();
      const params = new URLSearchParams({ q: query, status });
      const response = await fetch(`/api/admin/orders?${params}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Could not load orders.");
      setOrders(body.orders as AdminOrder[]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load orders."); }
    finally { setLoading(false); }
  }, [user, query, status]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => void loadOrders(), 180);
    return () => window.clearTimeout(timer);
  }, [loadOrders]);

  const pendingShipments = orders.filter((order) => !order.shipping.trackingId).length;
  return <main className="min-h-screen bg-sand/10 pb-20 pt-28"><Container><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">Koshi Fresh · Operations</p><h1 className="mt-2 font-serif text-3xl font-bold text-obsidian sm:text-4xl">Orders</h1><p className="mt-2 text-sm text-stone">Review new orders and manage dispatch updates.</p></div><button type="button" onClick={() => void loadOrders()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-sand bg-white px-4 py-2.5 text-sm font-semibold text-forest disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button></header>
    <section className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-sand/70 bg-white p-5"><p className="text-xs text-stone">Orders shown</p><p className="mt-2 text-2xl font-bold text-obsidian">{orders.length}</p><PackageCheck className="mt-3 h-5 w-5 text-forest" /></div><div className="rounded-2xl border border-sand/70 bg-white p-5"><p className="text-xs text-stone">Awaiting dispatch details</p><p className="mt-2 text-2xl font-bold text-obsidian">{pendingShipments}</p><Clock3 className="mt-3 h-5 w-5 text-amber-600" /></div><div className="rounded-2xl border border-sand/70 bg-white p-5"><p className="text-xs text-stone">Manual workflow</p><p className="mt-2 text-sm font-semibold text-obsidian">Create shipment in Shiprocket, then save tracking here.</p></div></section>
    <section className="overflow-hidden rounded-3xl border border-sand/70 bg-white shadow-premium-sm" aria-busy={loading}><div className="flex flex-col gap-3 border-b border-sand/60 p-4 sm:flex-row sm:items-center sm:p-5"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, customer, email or phone" className="w-full rounded-xl border border-sand bg-ivory/50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-forest" /></label><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-sand bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-forest"><option value="all">All statuses</option><option value="verification_pending">Awaiting confirmation</option><option value="confirmed">Confirmed</option><option value="preparing">Preparing</option><option value="pending_shipment">Pending shipment details</option><option value="shipped">Shipped</option><option value="in_transit">In transit</option><option value="out_for_delivery">Out for delivery</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="rto">Returned to seller</option></select></div>
      {error && <p role="alert" className="m-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <div className="space-y-3 p-5" role="status" aria-live="polite"><p className="flex items-center justify-center gap-2 text-sm text-forest"><RefreshCw className="h-4 w-4 animate-spin" /> Refreshing orders…</p>{[0, 1, 2].map((row) => <div key={row} className="grid gap-3 rounded-xl border border-sand/50 p-4 sm:grid-cols-3"><div className="h-4 animate-pulse rounded bg-sand/60" /><div className="h-4 animate-pulse rounded bg-sand/40" /><div className="h-4 animate-pulse rounded bg-sand/50" /></div>)}</div> : orders.length === 0 ? <p className="p-10 text-center text-sm text-stone">No orders match this search.</p> : <div className="divide-y divide-sand/50">{orders.map((order) => <article key={order.orderId} className="grid gap-4 p-4 transition-colors hover:bg-ivory/40 sm:grid-cols-[1.4fr_1.2fr_1fr_0.8fr] sm:items-center sm:p-5"><div className="min-w-0"><Link href={`/admin/orders/${encodeURIComponent(order.orderId)}`} className="break-all font-mono text-xs font-bold text-forest hover:underline">#{order.orderId}</Link><p className="mt-1 text-xs text-stone">{date(order.createdAt)}</p><p className="mt-2 truncate text-sm font-semibold text-obsidian">{order.customer.name || "Customer"}</p><p className="truncate text-xs text-stone">{order.customer.phone} · {order.customer.email}</p></div><div className="min-w-0">{order.items.slice(0, 2).map((item, index) => <p key={`${item.name}-${index}`} className="truncate text-sm text-charcoal">{item.name} <span className="text-stone">× {item.quantity}</span></p>)}{order.items.length > 2 && <p className="text-xs text-stone">+{order.items.length - 2} more items</p>}</div><div><p className="font-semibold text-obsidian">{money(order.pricing.total)}</p><p className="mt-1 text-xs text-stone">{order.payment.method.toUpperCase()} · {order.payment.status}</p><span className="mt-2 inline-flex rounded-full bg-forest/10 px-2.5 py-1 text-[11px] font-semibold text-forest">{orderStatusLabel(order.orderStatus as never)}</span></div><div className="flex items-center justify-between gap-3 sm:justify-end"><div className="text-right text-xs text-stone">{order.shipping.trackingId ? <><span className="block">{order.shipping.courier || "Courier"}</span><span className="font-mono">{order.shipping.trackingId}</span></> : "Not shipped"}</div><Link aria-label={`View ${order.orderId}`} href={`/admin/orders/${encodeURIComponent(order.orderId)}`} className="rounded-lg border border-sand p-2 text-forest hover:bg-forest hover:text-white"><ArrowUpRight className="h-4 w-4" /></Link></div></article>)}</div>}
    </section>
  </div></Container></main>;
}
