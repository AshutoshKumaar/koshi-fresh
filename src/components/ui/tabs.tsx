"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/utils/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg bg-sand/60 p-1 text-stone font-sans",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-all outline-hidden cursor-pointer select-none",
        "focus-visible:ring-2 focus-visible:ring-forest",
        "disabled:pointer-events-none disabled:opacity-40",
        "data-[state=active]:bg-white data-[state=active]:text-forest data-[state=active]:shadow-premium-sm",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-3 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}
