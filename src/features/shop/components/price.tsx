import * as React from "react";
import { cn } from "@/utils/cn";

export interface PriceProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
}

export function Price({
  className,
  price,
  originalPrice,
  size = "md",
  showDiscount = true,
  ...props
}: PriceProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base md:text-lg",
    lg: "text-xl md:text-2xl",
  };

  const originalSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className={cn("flex items-center gap-2 font-sans", className)} {...props}>
      <span className={cn("font-semibold text-forest", sizeClasses[size])}>
        ₹{price}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={cn("text-stone line-through font-light", originalSizeClasses[size])}>
            ₹{originalPrice}
          </span>
          {showDiscount && discount > 0 && (
            <span className="text-[10px] md:text-xs font-semibold text-feedback-success bg-feedback-success/10 px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
