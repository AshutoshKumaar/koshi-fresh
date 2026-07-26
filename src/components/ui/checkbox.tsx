"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export function Checkbox({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer h-5 w-5 shrink-0 rounded border border-stone bg-white outline-hidden transition-all duration-200 cursor-pointer",
        "hover:border-forest/60",
        "focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-sand/30",
        "data-[state=checked]:bg-forest data-[state=checked]:border-forest data-[state=checked]:text-ivory",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-3.5 w-3.5 stroke-[3px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
