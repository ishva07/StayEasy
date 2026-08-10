"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, size = 16, interactive = false, onChange }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
          />
        </button>
      ))}
    </div>
  );
}