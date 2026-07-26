import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

export function Input({ className, type = "text", error, helperText, disabled, ...props }: InputProps) {
  return (
    <div className="w-full font-sans">
      <input
        type={type}
        disabled={disabled}
        className={cn(
          "flex w-full rounded-lg border border-stone bg-white px-4 py-3 text-sm text-obsidian placeholder:text-stone/60 outline-hidden transition-all duration-200",
          "hover:border-forest/60",
          "focus:border-forest focus:ring-1 focus:ring-forest",
          "disabled:cursor-not-allowed disabled:bg-sand/30 disabled:border-stone/30 disabled:text-stone",
          error && "border-feedback-error focus:border-feedback-error focus:ring-feedback-error hover:border-feedback-error",
          className
        )}
        {...props}
      />
      {helperText && (
        <span
          className={cn(
            "mt-1.5 text-xs text-stone block",
            error && "text-feedback-error"
          )}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
