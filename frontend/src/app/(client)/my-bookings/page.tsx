"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useMyBookings } from "@/features/client/booking/hooks/useMyBookings";
import { useCancelBooking } from "@/features/client/booking/hooks/useCancelBooking";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, IndianRupee } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CHECKIN: "bg-green-100 text-green-800",
  CHECKOUT: "bg-gray-100 text-gray-800",
  CANCELED: "bg-red-100 text-red-800",
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
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-muted-foreground">You haven't made any bookings yet.</p>
          <Button onClick={() => router.push("/")}>Browse Hotels</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking: any) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 border border-border rounded-lg p-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{booking.room?.hotel?.name ?? "Hotel"}</p>
                  <Badge className={STATUS_BADGE[booking.status] ?? "bg-gray-100 text-gray-800"}>
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Room: {booking.room?.name ?? "-"}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p className="text-xs font-medium flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" /> {Number(booking.totalPrice).toLocaleString()}
                </p>
              </div>

              {booking.status === "PENDING" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setBookingToCancel(booking)}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          ))}
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