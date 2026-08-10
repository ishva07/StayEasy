"use client";

import { useState } from "react";
import { RatingStars } from "@/features/client/reviews/components/RatingStars";
import { useGetAllReviews } from "../../../../features/admin/reviews/hooks/useGetAllReviews";
import { useUpdateReviewStatus } from "../../../../features/admin/reviews/hooks/useUpdateReviewStatus";

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<"PENDING" | "PUBLISH" | "REJECT">("PENDING");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllReviews({ page, limit: 10, status });
  const { updateReviewStatus, isPending } = useUpdateReviewStatus();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold mb-6">Review moderation</h1>

      <div className="flex gap-2 mb-6">
        {(["PENDING", "PUBLISH", "REJECT"] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm rounded-full border ${
              status === s ? "bg-primary text-primary-foreground border-primary" : "border-border"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : !data?.data?.length ? (
        <p className="text-sm text-muted-foreground">No {status.toLowerCase()} reviews.</p>
      ) : (
        <div className="space-y-4">
          {data.data.map((review: any) => (
            <div key={review.id} className="border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{review.hotel?.name}</p>
                  <p className="text-xs text-muted-foreground">{review.user?.email}</p>
                </div>
                <RatingStars rating={review.rating} size={16} />
              </div>

              {review.comment && <p className="text-sm mb-3">{review.comment}</p>}

              <p className="text-xs text-muted-foreground mb-3">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>

              {status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    disabled={isPending}
                    onClick={() => updateReviewStatus({ status: "PUBLISH", id: review.id })}
                    className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => updateReviewStatus({ status: "REJECT", id: review.id })}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-sm border border-border rounded disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.totalPages}
              </span>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-sm border border-border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}