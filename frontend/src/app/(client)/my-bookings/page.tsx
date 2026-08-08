"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useMyBookings } from "@/features/client/booking/hooks/useMyBookings";
import { useCancelBooking } from "@/features/client/booking/hooks/useCancelBooking";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-secondary",
  CONFIRMED: "bg-primary",
  CHECKIN: "bg-green-500",
  CHECKOUT: "bg-gray-400",
  CANCELED: "bg-red-500",
};

const STATUS_TEXT: Record<string, string> = {
  PENDING: "text-secondary",
  CONFIRMED: "text-primary",
  CHECKIN: "text-green-600",
  CHECKOUT: "text-gray-500",
  CANCELED: "text-red-600",
};

function MyBookingsContent() {
  const router = useRouter();
  const { data, isLoading } = useMyBookings();
  const { cancelBooking, isPending: isCancelling } = useCancelBooking();
  const [bookingToCancel, setBookingToCancel] = useState<any>(null);

  const bookings = data?.data ?? [];

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    cancelBooking(bookingToCancel.id, {
      onSuccess: () => setBookingToCancel(null),
    });
  };

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading your bookings...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="font-display text-3xl font-medium">My bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-muted-foreground">You haven't made any bookings yet.</p>
          <Button onClick={() => router.push("/")}>Browse hotels</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => {
            const imageUrl = booking.room?.roomImage
              ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${booking.room.roomImage}`
              : "";

            return (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-border rounded-2xl p-4"
              >
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-lg font-medium">
                      {booking.room?.hotel?.name ?? "Hotel"}
                    </p>
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[booking.status] ?? "bg-gray-400"}`} />
                      <span className={`text-[11px] font-medium tracking-wide uppercase ${STATUS_TEXT[booking.status] ?? "text-muted-foreground"}`}>
                        {booking.status}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {booking.room?.hotel?.city?.name ?? "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(booking.checkIn).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      {" – "}
                      {new Date(booking.checkOut).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">{booking.room?.name ?? "-"}</p>
                </div>

                <div className="flex flex-col items-end gap-2 sm:pl-4">
                  <p className="font-display text-lg font-medium">
                    ₹{Number(booking.totalPrice).toLocaleString()}
                  </p>
                  {booking.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setBookingToCancel(booking)}
                    >
                      Cancel booking
                    </Button>
                  )}
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