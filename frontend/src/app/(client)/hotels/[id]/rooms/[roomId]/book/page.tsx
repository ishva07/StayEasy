"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetRoomById } from "@/features/rooms/hooks/useGetRoomById"; 
import { useCreateBooking } from "@/features/client/booking/hooks/useCreateBookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, IndianRupee, CalendarDays } from "lucide-react";

export default function BookRoomPage() {
  const router = useRouter();
  const rawParams = useParams();
  const { id: hotelId, roomId } = useParams<{ id: string; roomId: string }>();
  const { data: room, isLoading } = useGetRoomById(hotelId, roomId);   
  const { createBooking, isPending } = useCreateBooking();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Loading room details...</p>
      </div>
    );
  if (!room)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Room not found.</p>
      </div>
    );

  const dayCount =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const estimatedTotal = dayCount > 0 ? dayCount * Number(room.price) : 0;

  const handleSubmit = () => {
    setError("");
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }

    createBooking(
      { roomId, checkIn, checkOut },
      {
        onSuccess: (booking: any) => {
          router.push(`/booking-success/${booking.id}`);
        },
      }
    );
  };

  const roomImageUrl = room.roomImage
    ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${room.roomImage}`
    : "";

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Back link */}
        <button
          onClick={() => router.push(`/hotels/${hotelId}`)}
          className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/70 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to hotel</span>
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
          <div className="grid gap-8 p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-[170px_minmax(0,1fr)] items-center">
              <div className="h-40 w-full overflow-hidden rounded-3xl bg-muted ring-1 ring-border/50">
                {roomImageUrl ? (
                  <img src={roomImageUrl} alt={room.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
                <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {roomImageUrl ? (
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                        <img src={roomImageUrl} alt={room.name} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                      {room.name}
                    </h1>
                  </div>
                  <p className="text-sm italic text-muted-foreground">{room.hotel?.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-medium text-secondary">
                    <Users className="h-4 w-4" />
                    Up to {room.capacity} guests
                  </span>
                  <span className="text-base font-semibold text-foreground">
                    <IndianRupee className="mr-1 inline-block h-4 w-4 align-text-top" />
                    {Number(room.price).toLocaleString()} <span className="text-sm font-medium text-muted-foreground">/ night</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border/60 bg-background p-6 sm:p-7">
              <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
                <CalendarDays className="h-5 w-5 text-secondary" />
                Reservation dates
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Check-in
                  </label>
                  <Input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="rounded-full h-12 px-4 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Check-out
                  </label>
                  <Input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="rounded-full h-12 px-4 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              {dayCount > 0 && (
                <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {dayCount} night{dayCount > 1 ? "s" : ""} × ₹{Number(room.price).toLocaleString()}
                  </span>
                  <span className="font-display text-2xl font-semibold text-foreground">
                    ₹{estimatedTotal.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          className="w-full rounded-full h-12 text-sm font-medium bg-primary text-primary-foreground shadow-[0_10px_40px_rgba(14,165,233,0.16)] transition-shadow hover:shadow-[0_12px_45px_rgba(14,165,233,0.22)]"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Booking..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}