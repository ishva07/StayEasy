"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useMyBookings } from "@/features/client/booking/hooks/useMyBookings";
import { useCancelBooking } from "@/features/client/booking/hooks/useCancelBooking";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { ReviewFormModal } from "@/features/client/reviews/components/ReviewFormModal";
import {
  Calendar,
  MapPin,
  BedDouble,
  Users,
  Clock3,
  CheckCircle2,
  LogIn,
  LogOut,
  XCircle,
  Star,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { text: string; icon: any; className: string }> = {
  PENDING: {
    text: "Pending confirmation",
    icon: Clock3,
    className: "text-amber-700 bg-amber-50 border-amber-200",
  },
  CONFIRMED: {
    text: "Confirmed",
    icon: CheckCircle2,
    className: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  CHECKIN: {
    text: "Checked in",
    icon: LogIn,
    className: "text-blue-700 bg-blue-50 border-blue-200",
  },
  CHECKOUT: {
    text: "Stay completed",
    icon: LogOut,
    className: "text-gray-700 bg-gray-100 border-gray-200",
  },
  CANCELED: {
    text: "Cancelled",
    icon: XCircle,
    className: "text-red-700 bg-red-50 border-red-200",
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function MyBookingsContent() {
  const router = useRouter();
  const { data, isLoading } = useMyBookings();
  const { cancelBooking, isPending: isCancelling } = useCancelBooking();
  const [bookingToCancel, setBookingToCancel] = useState<any>(null);
  const [bookingToReview, setBookingToReview] = useState<any>(null);

  const bookings = data?.data ?? [];

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    cancelBooking(bookingToCancel.id, {
      onSuccess: () => setBookingToCancel(null),
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
        <h1 className="font-display text-3xl font-medium">My bookings</h1>
        <p className="text-sm text-muted-foreground">
          {bookings.length > 0
            ? `${bookings.length} booking${bookings.length === 1 ? "" : "s"} on your account`
            : "Your reservations and past stays"}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-4 py-20 px-6 rounded-2xl border border-dashed border-border/70">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm">No bookings yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              When you book a stay, it'll show up here with all your reservation details.
            </p>
          </div>
          <Button onClick={() => router.push("/")} className="mt-1">
            Browse hotels
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => {
            const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
            const StatusIcon = status.icon;
            const imageUrl = booking.room?.roomImage
              ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${booking.room.roomImage}`
              : "";

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-border/70 bg-card overflow-hidden transition-all hover:border-border hover:shadow-sm"
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
                          {booking.room?.hotel?.name ?? "Hotel"}
                        </p>
                        {booking.room?.hotel?.city?.name && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {booking.room.hotel.city.name}
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

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {booking.room?.name && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3" />
                          {booking.room.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                      </span>
                      {booking.room?.capacity && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {booking.room.capacity} guest{booking.room.capacity === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>

                    <p className="font-display text-lg font-semibold text-primary">
                      ₹{Number(booking.totalPrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Booked on {formatDate(booking.createdAt)}
                  </p>

                  <div className="flex items-center gap-3">
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => setBookingToCancel(booking)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        Cancel booking
                      </button>
                    )}

                    {booking.status === "CHECKOUT" && !booking.review && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => setBookingToReview(booking)}
                      >
                        <Star className="h-3.5 w-3.5" />
                        Leave a review
                      </Button>
                    )}

                    {booking.status === "CHECKOUT" && booking.review && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Reviewed
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => router.push(`/hotels/${booking.room?.hotelId}`)}
                    >
                      View hotel
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!bookingToCancel}
        onOpenChange={(open) => !open && setBookingToCancel(null)}
        title="Cancel this booking?"
        description="This action cannot be undone. Your booking will be permanently cancelled."
        loading={isCancelling}
        onConfirm={handleConfirmCancel}
      />

      {bookingToReview && (
        <ReviewFormModal
          bookingId={bookingToReview.id}
          hotelName={bookingToReview.room?.hotel?.name ?? "this stay"}
          onClose={() => setBookingToReview(null)}
        />
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_MY_BOOKING}>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}