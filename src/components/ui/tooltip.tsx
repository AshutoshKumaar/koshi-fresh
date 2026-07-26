"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/utils/cn";

export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({
  children,
  content,
  delayDuration = 200,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
  content: React.ReactNode;
  delayDuration?: number;
}) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root delayDuration={delayDuration} {...props}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            className={cn(
              "z-50 overflow-hidden rounded-md bg-obsidian px-3 py-1.5 text-xs text-ivory font-sans font-light animate-in fade-in-0 zoom-in-95 shadow-premium-sm",
              className
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-obsidian" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  );
}

const className = "text-center";
