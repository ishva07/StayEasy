"use client";

import { useState } from "react";
import { RatingStars } from "./RatingStars";
import { useCreateReview } from "../hooks/useCreateReview";

export function ReviewForm({ bookingId, onSubmitted }: { bookingId: string; onSubmitted?: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { createReview, isPending } = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    createReview(
      { rating, comment: comment || undefined, bookingId },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
          onSubmitted?.();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5"
    >
      <div>
        <h3 className="font-display text-base font-semibold">Share your experience</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          You stayed here — let others know how it was.
        </p>
      </div>

      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onClick={() => setRating(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              className={
                star <= (hoverRating || rating)
                  ? "text-yellow-400"
                  : "text-muted-foreground/40"
              }
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm font-medium text-primary">{rating}.0</span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="What stood out about your stay? (optional)"
        className="w-full resize-none rounded-xl border border-border/70 bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <button
        type="submit"
        disabled={rating === 0 || isPending}
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}