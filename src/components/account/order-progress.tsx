"use client";

import { Check } from "lucide-react";
import { normalizeOrderStatus, ORDER_STATUS_FLOW, orderStatusLabel, type OrderStatus } from "@/lib/order-status";

export type OrderHistoryEvent = { status: string; timestamp: string | null; note?: string | null };

const stepCopy: Partial<Record<OrderStatus, string>> = {
  created: "Order received successfully",
  verification_pending: "We're reviewing your order",
  confirmed: "Your order is confirmed",
  preparing: "Preparing your order for dispatch",
  shipped: "Tracking information is available",
  in_transit: "Your package is on its way",
  out_for_delivery: "Your package is out for delivery",
  delivered: "Your order has been delivered",
};

function formattedDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function OrderProgress({ status, createdAt, history = [], compact = false }: {
  status: string;
  createdAt: string | null;
  history?: OrderHistoryEvent[];
  compact?: boolean;
}) {
  const currentStatus = normalizeOrderStatus(status);
  if (currentStatus === "cancelled" || currentStatus === "rto") {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{orderStatusLabel(currentStatus)}</div>;
  }
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus as typeof ORDER_STATUS_FLOW[number]);
  const eventFor = (step: string) => history.find((event) => event.status === step);
  const steps = ORDER_STATUS_FLOW;
  return <ol className={compact ? "space-y-3" : "space-y-0"} aria-label="Order progress">
    {steps.map((step, index) => {
      const stepIndex = ORDER_STATUS_FLOW.indexOf(step);
      const done = stepIndex < currentIndex || currentStatus === "delivered";
      const active = step === currentStatus;
      const event = eventFor(step);
      const timestamp = step === "created" ? createdAt : event?.timestamp ?? null;
      return <li key={step} className={`relative flex gap-3 ${compact ? "" : "min-h-[66px]"}`}>
        {!compact && index < steps.length - 1 && <span className={`absolute left-[13px] top-7 h-[calc(100%-4px)] w-px ${done ? "bg-forest/40" : "bg-sand"}`} aria-hidden="true" />}
        <span className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${done ? "border-forest bg-forest text-white" : active ? "border-forest bg-white text-forest ring-4 ring-forest/10" : "border-sand bg-white text-stone"}`}>
          {done ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
        </span>
        <span className="min-w-0 pb-4">
          <span className={`block text-sm ${active ? "font-bold text-forest" : done ? "font-semibold text-charcoal" : "font-medium text-stone"}`}>{orderStatusLabel(step)}</span>
          {!compact && <span className="mt-0.5 block text-xs text-stone">{event?.note || stepCopy[step] || "We'll update you as your order progresses."}</span>}
          {timestamp && <time className="mt-1 block text-[11px] text-stone/80" dateTime={timestamp}>{formattedDate(timestamp)}</time>}
        </span>
      </li>;
    })}
  </ol>;
}
