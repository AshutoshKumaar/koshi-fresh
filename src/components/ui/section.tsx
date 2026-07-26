import * as React from "react";
import { cn } from "@/utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg" | "none";
}

export function Section({ className, size = "md", ...props }: SectionProps) {
  const sizeClasses = {
    sm: "py-12 md:py-16",
    md: "py-16 md:py-24",
    lg: "py-24 md:py-32",
    none: "py-0",
  };

  return (
    <section
      className={cn("w-full relative overflow-hidden", sizeClasses[size], className)}
      {...props}
    />
  );
}
