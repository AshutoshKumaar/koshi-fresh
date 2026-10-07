"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, PackageCheck, Save, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { OrderProgress, type OrderHistoryEvent } from "@/components/account/order-progress";
import { useAuth } from "@/context/auth-context";
import { orderStatusLabel } from "@/lib/order-status";

type OrderDetails = {
  orderId: string; createdAt: string | null; orderStatus: string; statusHistory: OrderHistoryEvent[];
  customer: { name: string; email: string; phone: string };
  items: Array<{ name: string; sku: string; quantity: number; price: number; weight: string }>;
  pricing: { subtotal: number; shipping: number; discount: number; total: number };
  payment: { method: string; status: string };
  address: { addressLine1: string; addressLine2: string; city: string; state: string; pincode: string; country: string };
  shipping: { courier: string | null; trackingId: string | null; trackingUrl: string | null; shipmentId: string | null; estimatedDeliveryDate: string | null };
};

const nextStatuses: Record<string, Array<{ status: string; label: string }>> = {
  verification_pending: [{ status: "confirmed", label: "Accept Order" }, { status: "cancelled", label: "Cancel Order" }],
  confirmed: [{ status: "preparing", label: "Mark Preparing" }, { status: "cancelled", label: "Cancel Order" }],
  preparing: [{ status: "cancelled", label: "Cancel Order" }],
  shipped: [{ status: "in_transit", label: "Mark In Transit" }, { status: "rto", label: "Mark Returned to Seller" }],
  in_transit: [{ status: "out_for_delivery", label: "Mark Out for Delivery" }, { status: "rto", label: "Mark Returned to Seller" }],
  out_for_delivery: [{ status: "delivered", label: "Mark Delivered" }, { status: "rto", label: "Mark Returned to Seller" }],
};
const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
const date = (value: string | null) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Date unavailable";

export default function AdminOrderDetailPage() {
  const { user } = useAuth();
  const params = useParams<{ orderId: string }>();
  const orderId = decodeURIComponent(params.orderId);
  const [order, setOrder] = React.useState<OrderDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [courier, setCourier] = React.useState("");
  const [trackingId, setTrackingId] = React.useState("");
  const [trackingUrl, setTrackingUrl] = React.useState("");
  const [shipmentId, setShipmentId] = React.useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = React.useState("");

  const authenticatedRequest = React.useCallback(async (path: string, init?: RequestInit) => {
    if (!user) throw new Error("Sign in to manage this order.");
    const token = await user.getIdToken();
    return fetch(path, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}`, ...(init?.body ? { "Content-Type": "application/json" } : {}) }, cache: "no-store" });
  }, [user]);

  const loadOrder = React.useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await authenticatedRequest(`/api/admin/orders/${encodeURIComponent(orderId)}`);
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Could not load this order.");
      const current = body.order as OrderDetails;
      setOrder(current);
      setCourier(current.shipping.courier ?? "");
      setTrackingId(current.shipping.trackingId ?? "");
      setTrackingUrl(current.shipping.trackingUrl ?? "");
      setShipmentId(current.shipping.shipmentId ?? "");
      setEstimatedDeliveryDate(current.shipping.estimatedDeliveryDate?.slice(0, 10) ?? "");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load this order."); }
    finally { setLoading(false); }
  }, [authenticatedRequest, orderId]);

  React.useEffect(() => { void loadOrder(); }, [loadOrder]);

  const changeStatus = async (status: string) => {
    setWorking(true); setError(""); setNotice("");
    try {
      const response = await authenticatedRequest(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Could not update order status.");
      setNotice(`Order marked ${orderStatusLabel(status as never).toLowerCase()}.`);
      await loadOrder();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update order status."); }
    finally { setWorking(false); }
  };

  const saveShipment = async (event: React.FormEvent) => {
    event.preventDefault(); setWorking(true); setError(""); setNotice("");
    try {
      const response = await authenticatedRequest(`/api/admin/orders/${encodeURIComponent(orderId)}/shipment`, {
        method: "PATCH",
        body: JSON.stringify({ courier, trackingId, trackingUrl, shipmentId, estimatedDeliveryDate }),
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Could not save shipment details.");
      setNotice("Shipment details saved successfully.");
      await loadOrder();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save shipment details."); }
    finally { setWorking(false); }
  };

  if (loading) return <main className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-forest" /></main>;
  if (!order) return <main className="min-h-screen bg-sand/10 pb-20 pt-28"><Container><div role="alert" className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-sm text-red-700">{error || "Order not found."}</div></Container></main>;

  return <main className="min-h-screen bg-sand/10 pb-20 pt-28"><Container><div className="mx-auto max-w-6xl space-y-6">
    <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-forest"><ArrowLeft className="h-4 w-4" /> All orders</Link>
    <header className="flex flex-wrap items-end justify-between gap-4 rounded-3xl bg-gradient-to-r from-forest-dark via-forest to-emerald-950 p-6 text-white shadow-premium-sm sm:p-8"><div><p className="text-xs uppercase tracking-[0.16em] text-white/70">Order details</p><h1 className="mt-2 break-all font-mono text-xl font-bold sm:text-2xl">#{order.orderId}</h1><p className="mt-2 text-sm text-white/75">Placed {date(order.createdAt)}</p></div><span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{orderStatusLabel(order.orderStatus as never)}</span></header>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-sand/70 bg-white p-5 shadow-premium-sm sm:p-7"><div className="mb-5 flex items-center gap-2"><PackageCheck className="h-5 w-5 text-forest" /><h2 className="font-serif text-xl font-bold text-obsidian">Order progress</h2></div><OrderProgress status={order.orderStatus} createdAt={order.createdAt} history={order.statusHistory} /></div>
        <div className="rounded-3xl border border-sand/70 bg-white p-5 shadow-premium-sm sm:p-7"><h2 className="font-serif text-xl font-bold text-obsidian">Items & pricing</h2><div className="mt-4 divide-y divide-sand/60">{order.items.map((item, index) => <div key={`${item.sku}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><div><p className="font-semibold text-obsidian">{item.name}</p><p className="mt-1 text-xs text-stone">SKU {item.sku || "—"} · Qty {item.quantity}{item.weight ? ` · ${item.weight}` : ""}</p></div><p className="font-medium text-charcoal">{money(item.price * item.quantity)}</p></div>)}</div><div className="mt-3 space-y-2 border-t border-sand/60 pt-4 text-sm"><div className="flex justify-between"><span className="text-stone">Subtotal</span><span>{money(order.pricing.subtotal)}</span></div><div className="flex justify-between"><span className="text-stone">Shipping</span><span>{money(order.pricing.shipping)}</span></div>{order.pricing.discount > 0 && <div className="flex justify-between"><span className="text-stone">Discount</span><span>−{money(order.pricing.discount)}</span></div>}<div className="flex justify-between border-t border-sand/50 pt-3 font-bold"><span>Total</span><span>{money(order.pricing.total)}</span></div></div></div>
        <div className="rounded-3xl border border-sand/70 bg-white p-5 shadow-premium-sm sm:p-7"><div className="mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-forest" /><h2 className="font-serif text-xl font-bold text-obsidian">Manual shipment details</h2></div>{order.orderStatus !== "preparing" && order.orderStatus !== "shipped" ? <p className="text-sm text-stone">Accept and prepare the order before recording dispatch details.</p> : <><p className="mb-5 text-sm leading-6 text-stone">Create the shipment in Shiprocket first. Then enter the real courier and tracking details below.</p><form onSubmit={saveShipment} className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-semibold text-charcoal">Courier<input required minLength={2} maxLength={80} value={courier} onChange={(event) => setCourier(event.target.value)} placeholder="e.g. Delhivery" className="w-full rounded-xl border border-sand px-3 py-2.5 text-sm font-normal outline-none focus:border-forest" /></label><label className="space-y-1.5 text-xs font-semibold text-charcoal">Tracking ID / AWB<input required minLength={4} maxLength={100} pattern="[A-Za-z0-9-]+" value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder="Enter the actual AWB" className="w-full rounded-xl border border-sand px-3 py-2.5 text-sm font-normal outline-none focus:border-forest" /></label><label className="space-y-1.5 text-xs font-semibold text-charcoal sm:col-span-2">Tracking URL (optional)<input type="url" value={trackingUrl} onChange={(event) => setTrackingUrl(event.target.value)} placeholder="https://..." className="w-full rounded-xl border border-sand px-3 py-2.5 text-sm font-normal outline-none focus:border-forest" /></label><label className="space-y-1.5 text-xs font-semibold text-charcoal">Shipment ID (optional)<input value={shipmentId} onChange={(event) => setShipmentId(event.target.value)} className="w-full rounded-xl border border-sand px-3 py-2.5 text-sm font-normal outline-none focus:border-forest" /></label><label className="space-y-1.5 text-xs font-semibold text-charcoal">Estimated delivery (optional)<input type="date" value={estimatedDeliveryDate} onChange={(event) => setEstimatedDeliveryDate(event.target.value)} className="w-full rounded-xl border border-sand px-3 py-2.5 text-sm font-normal outline-none focus:border-forest" /></label><button type="submit" disabled={working} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-bold text-white disabled:opacity-60 sm:col-span-2"><Save className="h-4 w-4" />{working ? "Saving…" : order.orderStatus === "shipped" ? "Update Shipment" : "Save Shipment & Mark Shipped"}</button></form></>}</div>
      </section>
      <aside className="space-y-6">
        <section className="rounded-3xl border border-sand/70 bg-white p-5 shadow-premium-sm sm:p-6"><h2 className="font-serif text-lg font-bold text-obsidian">Customer</h2><p className="mt-4 font-semibold text-obsidian">{order.customer.name || "—"}</p><a className="mt-1 block break-all text-sm text-forest hover:underline" href={`mailto:${order.customer.email}`}>{order.customer.email || "Email not provided"}</a><a className="mt-1 block text-sm text-forest hover:underline" href={`tel:${order.customer.phone}`}>{order.customer.phone || "Phone not provided"}</a><div className="mt-5 border-t border-sand/60 pt-4"><h3 className="text-xs font-bold uppercase tracking-wide text-stone">Delivery address</h3><address className="mt-2 text-sm not-italic leading-6 text-charcoal">{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}<br />{order.address.city}, {order.address.state} {order.address.pincode}<br />{order.address.country}</address></div></section>
        <section className="rounded-3xl border border-sand/70 bg-white p-5 shadow-premium-sm sm:p-6"><h2 className="font-serif text-lg font-bold text-obsidian">Payment</h2><p className="mt-3 text-sm text-charcoal">{order.payment.method.toUpperCase()} · {order.payment.status}</p><p className="mt-1 text-lg font-bold text-forest">{money(order.pricing.total)}</p></section>
        <section className="rounded-3xl border border-sand/70 bg-white p-5 shadow-premium-sm sm:p-6"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-forest" /><h2 className="font-serif text-lg font-bold text-obsidian">Admin actions</h2></div><div className="mt-4 flex flex-wrap gap-2">{(nextStatuses[order.orderStatus] ?? []).map((action) => <button key={action.status} type="button" disabled={working} onClick={() => void changeStatus(action.status)} className={`rounded-xl px-3 py-2 text-xs font-bold disabled:opacity-50 ${action.status === "cancelled" || action.status === "rto" ? "border border-red-200 text-red-700" : "bg-forest text-white"}`}>{action.label}</button>)}</div><p className="mt-4 text-xs leading-5 text-stone">Status changes are checked on the server and saved with an order history event.</p></section>
      </aside>
    </div>
  </div></Container></main>;
}
