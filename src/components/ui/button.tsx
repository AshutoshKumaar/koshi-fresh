"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";
import { Spinner } from "./spinner";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  animateOnClick?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  animateOnClick = true,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none";

  const variantClasses = {
    primary: "bg-forest text-ivory hover:bg-forest-light shadow-premium-sm",
    secondary: "bg-sand text-obsidian hover:bg-[#E6E1D5]",
    outline: "border border-forest text-forest hover:bg-forest hover:text-ivory",
    ghost: "text-obsidian hover:bg-sand/50",
    gold: "bg-gold text-obsidian hover:bg-[#C29F47] shadow-premium-sm",
    link: "text-forest underline-offset-4 hover:underline p-0 h-auto rounded-none hover:bg-transparent",
  };

  const sizeClasses = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };

  const motionProps = animateOnClick && !disabled && !isLoading
    ? {
        whileTap: { scale: 0.97 },
        whileHover: { y: -2 },
      }
    : {};

  return (
    <motion.button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || isLoading}
      {...motionProps}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2 h-4 w-4" size="sm" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

