"use client";

import { RatingStars } from "./RatingStars";
import { useGetHotelReviews } from "../hooks/useHotelsReview";

export function ReviewList({ hotelId, limit = 3 }: { hotelId: string; limit?: number }) {
  const { data, isLoading } = useGetHotelReviews(hotelId, { page: 1, limit });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-muted/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data?.data?.length) return null;

  return (
    <div className="space-y-4">
      {data.data.map((review: any) => {
        const initial = (review.user?.email?.[0] ?? "G").toUpperCase();
        return (
          <div key={review.id} className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {review.user?.email?.split("@")[0] ?? "Guest"}
                  </p>
                  <span className="flex-shrink-0 text-[11px] text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <RatingStars rating={review.rating} size={12} />
                {review.comment && (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">{review.comment}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}