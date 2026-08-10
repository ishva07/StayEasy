"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { useGetHotelReviews } from "../hooks/useHotelsReview";
import { useState } from "react";

export function ReviewsModal({
  hotelId,
  hotelName,
  onClose,
}: {
  hotelId: string;
  hotelName: string;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetHotelReviews(hotelId, { page, limit: 10 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Reviews for {hotelName}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {isLoading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-muted/60 animate-pulse" />)
          ) : !data?.data?.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">No reviews yet.</p>
          ) : (
            data.data.map((review: any) => {
              const initial = (review.user?.email?.[0] ?? "G").toUpperCase();
              return (
                <div key={review.id} className="rounded-2xl border border-border/60 p-4">
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
                        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {data?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-border/60 px-5 py-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-xs text-muted-foreground">
              {page} / {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}