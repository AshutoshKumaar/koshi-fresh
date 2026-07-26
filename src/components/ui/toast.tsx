"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/utils/cn";

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: "default" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant = "default", title, description, children, ...props }, ref) => {
  const icons = {
    default: null,
    success: <CheckCircle className="h-5 w-5 text-feedback-success shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-feedback-error shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-feedback-warning shrink-0" />,
    info: <Info className="h-5 w-5 text-feedback-info shrink-0" />,
  };

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-sand bg-white p-4 pr-9 shadow-premium-md transition-all",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full",
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="grid gap-1">
        {title && (
          <ToastPrimitive.Title className="text-sm font-sans font-medium text-obsidian">
            {title}
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description className="text-xs font-sans font-light text-charcoal/90 leading-normal">
            {description}
          </ToastPrimitive.Description>
        )}
      </div>
      {children}
      <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 text-stone opacity-0 transition-opacity hover:text-obsidian focus:opacity-100 focus:outline-hidden focus:ring-1 focus:ring-forest group-hover:opacity-100 cursor-pointer">
        <X className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
});
Toast.displayName = ToastPrimitive.Root.displayName;

/* Global Toast Dispatcher Setup */
type ToastEvent = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastProps["variant"];
  duration?: number;
};

type Listener = (toast: ToastEvent) => void;
const listeners = new Set<Listener>();

export function toast({
  title,
  description,
  variant = "default",
  duration = 3000,
}: Omit<ToastEvent, "id">) {
  const id = Math.random().toString(36).substring(2, 9);
  const event: ToastEvent = { id, title, description, variant, duration };
  listeners.forEach((listener) => listener(event));
  return id;
}

export function useToasts() {
  const [toasts, setToasts] = React.useState<ToastEvent[]>([]);

  React.useEffect(() => {
    const listener = (newToast: ToastEvent) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 3000);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return toasts;
}

export function Toaster() {
  const toasts = useToasts();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant, ...props }) => (
        <Toast key={id} variant={variant} title={title} description={description} {...props} />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
