import * as React from "react";
import { Truck, ShieldCheck, Tag, AlertTriangle, Check } from "lucide-react";
import { cn } from "@/utils/cn";

// ================= OFFER BADGE =================
export function OfferBadge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-gold text-obsidian text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 shadow-premium-sm select-none",
        className
      )}
      {...props}
    >
      <Tag className="h-3 w-3 fill-current" />
      {children}
    </span>
  );
}

// ================= STOCK BADGE =================
export interface StockBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  inStock: boolean;
  stockCount?: number;
}
export function StockBadge({ className, inStock, stockCount, ...props }: StockBadgeProps) {
  if (!inStock) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded bg-stone/20 text-stone border border-stone/30 text-[10px] font-sans font-medium uppercase tracking-wider px-2.5 py-0.5 select-none",
          className
        )}
        {...props}
      >
        Out of Stock
      </span>
    );
  }

  if (stockCount && stockCount <= 5) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded bg-feedback-warning/15 text-feedback-warning border border-feedback-warning/30 text-[10px] font-sans font-medium uppercase tracking-wider px-2.5 py-0.5 select-none",
          className
        )}
        {...props}
      >
        <AlertTriangle className="h-3 w-3" />
        Only {stockCount} left!
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-feedback-success/15 text-feedback-success border border-feedback-success/30 text-[10px] font-sans font-medium uppercase tracking-wider px-2.5 py-0.5 select-none",
        className
      )}
      {...props}
    >
      <Check className="h-3 w-3 stroke-[3px]" />
      In Stock
    </span>
  );
}

// ================= DELIVERY BADGE =================
export function DeliveryBadge({ className, children = "Free Delivery", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-sans font-medium text-feedback-success",
        className
      )}
      {...props}
    >
      <Truck className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

// ================= TRUST BADGE =================
export function TrustBadge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-sand bg-white text-xs font-sans font-light text-charcoal px-3.5 py-2 shadow-premium-sm",
        className
      )}
      {...props}
    >
      <ShieldCheck className="h-4 w-4 text-forest shrink-0" />
      <span>{children}</span>
    </span>
  );
}

// ================= COUPON BADGE =================
export function CouponBadge({ className, code, ...props }: React.HTMLAttributes<HTMLSpanElement> & { code: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-dashed border-gold bg-gold/5 text-xs font-sans font-medium text-gold px-2.5 py-1 select-none",
        className
      )}
      {...props}
    >
      <Tag className="h-3 w-3" />
      <span>Use: {code}</span>
    </span>
  );
}
