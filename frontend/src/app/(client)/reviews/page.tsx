"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetMyReviews } from "@/features/client/reviews/hooks/useGetAllMyReview";
import { useDeleteReview } from "@/features/client/reviews/hooks/useDeleteReview";
import { RatingStars } from "@/features/client/reviews/components/RatingStars";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageSquareText,
  Calendar,
  MapPin,
  BedDouble,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { text: string; icon: any; className: string }> = {
  PENDING: {
    text: "Pending approval",
    icon: Clock3,
    className: "text-amber-700 bg-amber-50 border-amber-200",
  },
  PUBLISH: {
    text: "Published",
    icon: CheckCircle2,
    className: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  REJECTED: {
    text: "Not approved",
    icon: XCircle,
    className: "text-red-700 bg-red-50 border-red-200",
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function MyReviewsContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyReviews({ page, limit: 10 });
  const { deleteReview, isPending: isDeleting } = useDeleteReview();
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);

  const reviews = data?.data ?? [];

  const handleConfirmDelete = () => {
    if (!reviewToDelete) return;
    deleteReview(reviewToDelete.id, {
      onSuccess: () => setReviewToDelete(null),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-medium">My reviews</h1>
        <p className="text-sm text-muted-foreground">
          {reviews.length > 0
            ? `${data?.total ?? reviews.length} review${(data?.total ?? reviews.length) === 1 ? "" : "s"} across your stays`
            : "Reviews you've written for past stays"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-4 py-20 px-6 rounded-2xl border border-dashed border-border/70">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageSquareText className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm">No reviews yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Once you check out of a stay, you can share how it went right from your bookings.
            </p>
          </div>
          <Button onClick={() => router.push("/bookings")} className="mt-1">
            View my bookings
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => {
            const status = STATUS_CONFIG[review.status] ?? STATUS_CONFIG.PENDING;
            const StatusIcon = status.icon;
            const imageUrl = review.hotel?.heroImage
              ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${review.hotel.heroImage}`
              : "";

            return (
              <div
                key={review.id}
                className="group rounded-2xl border border-border/70 bg-card overflow-hidden transition-all hover:border-border hover:shadow-sm"
              >
                <div className="flex gap-4 p-4">
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                    {imageUrl ? (
                      <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-base font-semibold leading-tight truncate">
                          {review.hotel?.name ?? "Hotel"}
                        </p>
                        {review.hotel?.city?.name && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {review.hotel.city.name}
                          </p>
                        )}
                      </div>

                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${status.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.text}
                      </span>
                    </div>

                    {/* Stay details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {review.booking?.room?.name && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3" />
                          {review.booking.room.name}
                        </span>
                      )}
                      {review.booking?.checkIn && review.booking?.checkOut && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(review.booking.checkIn)} – {formatDate(review.booking.checkOut)}
                        </span>
                      )}
                    </div>

                    <RatingStars rating={review.rating} size={13} />
                  </div>
                </div>

                {review.comment && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-foreground/75 leading-relaxed border-l-2 border-primary/20 pl-3">
                      {review.comment}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Reviewed on {formatDate(review.createdAt)}
                  </p>

                  <div className="flex items-center gap-3">
                    {review.status === "PENDING" && (
                      <button
                        onClick={() => setReviewToDelete(review)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => router.push(`/hotels/${review.hotel?.id}/rooms/${review.booking?.room?.id}/book`)}
                    >
                      Book again
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {data?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
        title="Delete this review?"
        description="This action cannot be undone."
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function MyReviewsPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_MY_REVIEW}>
      <MyReviewsContent />
    </ProtectedRoute>
  );
}

//http://localhost:3000/hotels/cmrtz3n0k000au5lgea2phfsq/rooms/cms5hmtye0003u5c0kgm0g1v4/book