import * as React from "react";
import { ProductVariant } from "@/types/shop";
import { cn } from "@/utils/cn";

export interface VariantSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  variants: ProductVariant[];
  selectedVariantId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function VariantSelector({
  className,
  variants,
  selectedVariantId,
  onChange,
  disabled = false,
  ...props
}: VariantSelectorProps) {
  return (
    <div className={cn("space-y-2 font-sans", className)} {...props}>
      <span className="font-label-premium text-stone text-[10px] block">
        Select Weight Size
      </span>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = v.id === selectedVariantId;
          return (
            <button
              key={v.id}
              disabled={disabled || !v.inStock}
              onClick={() => onChange(v.id)}
              className={cn(
                "h-10 px-4 text-xs font-medium rounded-lg border transition-all duration-200 select-none cursor-pointer flex items-center justify-center gap-1",
                isSelected
                  ? "bg-forest border-forest text-ivory shadow-premium-sm"
                  : "bg-white border-stone/50 text-obsidian hover:border-forest/60",
                !v.inStock && "opacity-40 cursor-not-allowed border-stone/30 bg-sand/20 text-stone"
              )}
            >
              <span>{v.weight}</span>
              {!v.inStock && <span className="text-[9px] font-light text-stone/80">(Out)</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
