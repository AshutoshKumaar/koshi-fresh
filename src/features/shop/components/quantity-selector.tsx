import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

export interface QuantitySelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  className,
  quantity,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  ...props
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className={cn("space-y-2 font-sans", className)} {...props}>
      <span className="font-label-premium text-stone text-[10px] block">
        Select Quantity
      </span>
      <div className="flex items-center rounded-lg border border-stone bg-white h-11 w-32 justify-between px-2">
        <button
          type="button"
          disabled={disabled || quantity <= min}
          onClick={handleDecrement}
          className="p-1.5 rounded text-stone hover:text-forest hover:bg-sand/30 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="font-medium text-sm text-obsidian w-8 text-center select-none">
          {quantity}
        </span>
        <button
          type="button"
          disabled={disabled || quantity >= max}
          onClick={handleIncrement}
          className="p-1.5 rounded text-stone hover:text-forest hover:bg-sand/30 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
