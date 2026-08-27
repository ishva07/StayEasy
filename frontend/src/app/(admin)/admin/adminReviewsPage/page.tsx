"use client";

import { useState } from "react";
import { RatingStars } from "@/features/client/reviews/components/RatingStars";
import { useGetAllReviews } from "../../../../features/admin/reviews/hooks/useGetAllReviews";
import { useUpdateReviewStatus } from "../../../../features/admin/reviews/hooks/useUpdateReviewStatus";
import { Building2, Calendar, Check, X, Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<"PENDING" | "PUBLISH" | "REJECT">("PENDING");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllReviews({ page, limit: 10, status });
  const { updateReviewStatus, isPending } = useUpdateReviewStatus();

  // Tab count queries
  const { data: pendingData } = useGetAllReviews({ page: 1, limit: 1, status: "PENDING" });
  const { data: publishData } = useGetAllReviews({ page: 1, limit: 1, status: "PUBLISH" });
  const { data: rejectData } = useGetAllReviews({ page: 1, limit: 1, status: "REJECT" });

  return (
    <div className="space-y-6 pb-16">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Review Moderation</h1>
            <p className="mt-1 text-sm text-slate-500">
              Triage inbox for moderating guest reviews, testimonials, and flagged feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {(["PENDING", "PUBLISH", "REJECT"] as const).map((s) => {
              const isActive = status === s;
              const count =
                s === "PENDING"
                  ? pendingData?.total
                  : s === "PUBLISH"
                  ? publishData?.total
                  : rejectData?.total;

              return (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    isActive
                      ? "bg-slate-950 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span>{s}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500 animate-pulse">Loading moderation queue...</p>
        </div>
      ) : !data?.data?.length ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No {status.toLowerCase()} reviews</h3>
          <p className="text-xs text-slate-500 mt-1">There are no reviews currently in the {status.toLowerCase()} queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((review: any) => {
            const initial = (review.user?.name || review.user?.email || "G").charAt(0).toUpperCase();

            return (
              <div
                key={review.id}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-5"
              >
                {/* Header Row: Avatar + User/Hotel info + Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Avatar + User & Hotel Tag */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white font-bold text-sm shadow-xs">
                      {initial}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {review.user?.email || "Guest User"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          {review.hotel?.name || "Hotel"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Rating Stars + Numeric Score */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-3.5 py-1.5 rounded-full w-fit">
                    <RatingStars rating={review.rating} size={16} />
                    <span className="text-sm font-extrabold text-slate-900 ml-0.5">
                      {Number(review.rating).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Review Comment (Visual Hero) */}
                <div className="relative pl-5 border-l-2 border-slate-900 py-1">
                  <Quote className="absolute -top-1 -left-3.5 h-6 w-6 text-slate-200 -z-10 opacity-40 rotate-180" />
                  <p className="text-base text-slate-800 leading-relaxed font-medium italic">
                    "{review.comment || "No written review comments provided."}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Submitted on{" "}
                      {new Date(review.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    {status === "PENDING" && (
                      <>
                        <button
                          disabled={isPending}
                          onClick={() => updateReviewStatus({ status: "REJECT", id: review.id })}
                          className="h-9 px-4 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5 text-slate-900" />
                          Reject
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => updateReviewStatus({ status: "PUBLISH", id: review.id })}
                          className="h-9 px-5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5 text-white" />
                          Approve
                        </button>
                      </>
                    )}

                    {status === "PUBLISH" && (
                      <button
                        disabled={isPending}
                        onClick={() => updateReviewStatus({ status: "REJECT", id: review.id })}
                        className="h-9 px-4 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        Unpublish & Reject
                      </button>
                    )}

                    {status === "REJECT" && (
                      <button
                        disabled={isPending}
                        onClick={() => updateReviewStatus({ status: "PUBLISH", id: review.id })}
                        className="h-9 px-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Re-Approve & Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              <span className="text-xs font-medium text-slate-500 px-2">
                Page {page} of {data.totalPages}
              </span>

              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}