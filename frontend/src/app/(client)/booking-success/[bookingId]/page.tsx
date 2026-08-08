// app/(client)/booking-success/[bookingId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBookingById } from "@/features/client/booking/hooks/useGetBookingById";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-yellow-500",
  CONFIRMED: "bg-secondary",
  CHECKIN: "bg-green-500",
  CHECKOUT: "bg-gray-400",
  CANCELED: "bg-red-500",
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
    <div className="bg-[#FAF6EF] min-h-[calc(100vh-64px)] px-4 py-16">
      <p className="text-center text-xs font-medium tracking-[0.15em] uppercase text-primary flex items-center justify-center gap-1.5 mb-10">
        <CheckCircle2 className="h-3.5 w-3.5" /> Booking confirmed
      </p>

      {/* Ticket card */}
      <div className="max-w-3xl mx-auto relative">
        <div className="flex rounded-2xl overflow-hidden shadow-xl shadow-black/10">
          {/* Left — teal stub */}
          <div className="bg-primary text-primary-foreground flex-[65] px-8 py-8 space-y-6">
            <div>
              <h1 className="font-display text-3xl font-medium">
                {booking.room?.hotel?.name ?? "Hotel"}
              </h1>
              {booking.room?.hotel?.city && (
                <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> {booking.room.hotel.city}
                </p>
              )}
            </div>

            <div className="flex gap-10">
              <div>
                <p className="text-xs text-primary-foreground/70">Check-in</p>
                <p className="text-sm font-medium">
                  {new Date(booking.checkIn).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70">Check-out</p>
                <p className="text-sm font-medium">
                  {new Date(booking.checkOut).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-primary-foreground/70">Room</p>
              <p className="text-sm font-medium">{booking.room?.name ?? "-"}</p>
            </div>
          </div>

          {/* Notch cutouts */}
          <div className="relative flex-[35] bg-card px-8 py-8 flex flex-col justify-center items-center text-center">
            <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-[#FAF6EF]" />
            <div className="absolute -left-3 bottom-0 h-6 w-6 rounded-full bg-[#FAF6EF]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 border-l border-dashed border-border h-[calc(100%-48px)]" />

            <p className="text-xs text-muted-foreground">Booking ID</p>
            <p className="text-sm font-mono mb-4">{booking.id}</p>

            <div className="w-full border-t border-dashed border-border pt-4">
              <p className="text-xs text-muted-foreground">Total paid</p>
              <p className="font-display text-2xl font-medium mt-1">
                ₹{Number(booking.totalPrice).toLocaleString()}
              </p>
            </div>

            <div
              className={`h-2.5 w-2.5 rounded-full mt-4 ${STATUS_DOT[booking.status] ?? "bg-gray-400"}`}
              title={booking.status}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button onClick={() => router.push("/my-bookings")}>View my bookings</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </div>
    </div>
  );
}