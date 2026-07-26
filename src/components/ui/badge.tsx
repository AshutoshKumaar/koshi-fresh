import * as React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "error" | "success";
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-sans uppercase tracking-wider select-none";

  const variantClasses = {
    primary: "bg-forest text-ivory",
    secondary: "bg-sand text-obsidian",
    gold: "bg-gold/15 text-gold border border-gold/30",
    outline: "border border-stone text-stone bg-transparent",
    error: "bg-feedback-error/10 text-feedback-error border border-feedback-error/20",
    success: "bg-feedback-success/10 text-feedback-success border border-feedback-success/20",
  };

  return (
    <span
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}
