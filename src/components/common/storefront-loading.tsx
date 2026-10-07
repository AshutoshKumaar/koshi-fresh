import { LoaderCircle, ShoppingBag } from "lucide-react";

type StorefrontLoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

export function StorefrontLoading({
  label = "Getting your order ready…",
  fullScreen = false,
}: StorefrontLoadingProps) {
  return (
    <main
      className={`flex items-center justify-center bg-ivory px-5 ${fullScreen ? "min-h-dvh" : "min-h-[60vh]"}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-forest text-white shadow-premium-md">
          <ShoppingBag className="h-9 w-9" strokeWidth={1.6} />
          <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border-4 border-ivory bg-gold text-white">
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </span>
        </div>
        <p className="mt-6 font-serif text-xl font-bold text-forest">Koshi Fresh</p>
        <p className="mt-2 text-sm text-charcoal">{label}</p>
        <p className="mt-1 text-xs text-stone">Fresh picks are on their way</p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-sand/70">
          <div className="h-full w-1/3 animate-[loading-progress_1.5s_ease-in-out_infinite] rounded-full bg-gold" />
        </div>
      </div>
    </main>
  );
}
