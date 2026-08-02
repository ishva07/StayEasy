// app/(client)/booking-success/[bookingId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBookingById } from "@/features/client/booking/hooks/useGetBookingById";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, MapPin, IndianRupee } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CHECKIN: "bg-green-100 text-green-800",
  CHECKOUT: "bg-gray-100 text-gray-800",
  CANCELED: "bg-red-100 text-red-800",
};

export default function BookingSuccessPage() {
  const router = useRouter();
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data: booking, isLoading } = useGetBookingById(bookingId);

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground text-center">Loading...</p>;
  }

  if (!booking) {
    return <p className="p-6 text-sm text-muted-foreground text-center">Booking not found.</p>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Booking Confirmed!</h1>
        <p className="text-sm text-muted-foreground">
          Your reservation has been placed successfully.
        </p>
      </div>

      <div className="border border-border rounded-lg p-4 text-left space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Booking ID</span>
          <span className="text-xs font-mono">{booking.id}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Status</span>
          <Badge className={STATUS_BADGE[booking.status] ?? "bg-gray-100 text-gray-800"}>
            {booking.status}
          </Badge>
        </div>

        <div className="pt-2 border-t border-border space-y-2">
          <p className="font-medium text-sm">{booking.room?.hotel?.name ?? "Hotel"}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {booking.room?.hotel?.city ?? "-"}
          </p>
          <p className="text-xs text-muted-foreground">Room: {booking.room?.name ?? "-"}</p>
        </div>

        <div className="pt-2 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Check-in: {new Date(booking.checkIn).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Check-out: {new Date(booking.checkOut).toLocaleDateString()}
          </p>
        </div>

        <div className="pt-2 border-t border-border flex justify-between items-center">
          <span className="text-sm font-medium">Total Paid</span>
          <span className="text-sm font-semibold flex items-center gap-1">
            <IndianRupee className="h-3 w-3" /> {Number(booking.totalPrice).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={() => router.push("/my-bookings")}>View My Bookings</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}