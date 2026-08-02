"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetRoomById } from "@/features/rooms/hooks/useGetRoomById"; 
import { useCreateBooking } from "@/features/client/booking/hooks/useCreateBookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, IndianRupee } from "lucide-react";

export default function BookRoomPage() {
  const router = useRouter();
  const rawParams = useParams();
  const { id: hotelId, roomId } = useParams<{ id: string; roomId: string }>();
  const { data: room, isLoading } = useGetRoomById(hotelId, roomId);   
  const { createBooking, isPending } = useCreateBooking();


  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");

  if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
  if (!room) return <p className="p-6 text-sm text-muted-foreground">Room not found.</p>;

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
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push(`/hotels/${hotelId}`)}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to hotel
      </Button>

      <div className="flex gap-4 border border-border rounded-lg p-4">
        <div className="h-20 w-28 rounded-md overflow-hidden bg-muted flex-shrink-0">
          {roomImageUrl ? (
            <img src={roomImageUrl} alt={room.name} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <h2 className="font-semibold">{room.name}</h2>
          <p className="text-xs text-muted-foreground">{room.hotel?.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Users className="h-3 w-3" /> Up to {room.capacity} guests
          </p>
          <p className="text-sm font-medium flex items-center gap-1 mt-1">
            <IndianRupee className="h-3 w-3" /> {Number(room.price).toLocaleString()} / night
          </p>
        </div>
      </div>

      <div className="space-y-4 border border-border rounded-lg p-4">
        <h3 className="font-medium text-sm">Select your dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Check-in</label>
            <Input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Check-out</label>
            <Input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {dayCount > 0 && (
          <div className="flex justify-between items-center pt-2 border-t border-border text-sm">
            <span className="text-muted-foreground">
              {dayCount} night{dayCount > 1 ? "s" : ""} × ₹{Number(room.price).toLocaleString()}
            </span>
            <span className="font-semibold">₹{estimatedTotal.toLocaleString()}</span>
          </div>
        )}
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Booking..." : "Confirm Booking"}
      </Button>
    </div>
  );
}