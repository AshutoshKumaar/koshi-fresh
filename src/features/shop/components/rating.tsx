import * as React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/utils/cn";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  reviewsCount?: number;
  showText?: boolean;
}

export function Rating({
  className,
  rating,
  reviewsCount,
  showText = true,
  ...props
}: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className={cn("flex items-center gap-1.5 font-sans select-none", className)} {...props}>
      <div className="flex items-center text-gold">
        {Array.from({ length: totalStars }).map((_, index) => {
          if (index < fullStars) {
            return <Star key={index} className="h-4 w-4 fill-current stroke-[1.5]" />;
          }
          if (index === fullStars && hasHalfStar) {
            return <StarHalf key={index} className="h-4 w-4 fill-current stroke-[1.5]" />;
          }
          return (
            <Star
              key={index}
              className="h-4 w-4 text-stone/30 stroke-[1.5]"
            />
          );
        })}
      </div>
      {showText && (
        <span className="text-xs text-charcoal font-medium">
          {rating}
          {reviewsCount !== undefined && (
            <span className="text-stone font-light ml-1">
              ({reviewsCount} reviews)
            </span>
          )}
        </span>
      )}
    </div>
  );
}
