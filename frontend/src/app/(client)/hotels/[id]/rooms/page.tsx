"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelById } from "@/features/hotels/hooks/useHotelById";
import { RoomCard } from "@/features/client/hotels/components/RoomCard";
import { ArrowLeft, Building2 } from "lucide-react";

export default function AllHotelRoomsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading } = useHotelById(id);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading rooms...
        </p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm text-muted-foreground">Hotel not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <button
            onClick={() => router.push(`/hotels/${hotel.id}`)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to {hotel.name}</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            All Available Rooms
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{hotel.name}</span>
            {hotel.city?.name && <span>• {hotel.city.name}</span>}
          </p>
        </div>
      </div>

      {/* Rooms grid */}
      {hotel.room?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotel.room.map((room: any) => (
            <RoomCard key={room.id} room={room} hotelId={hotel.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border/70 p-12 text-center">
          <p className="text-base font-semibold text-foreground">No rooms available</p>
          <p className="text-xs text-muted-foreground mt-1">
            There are currently no rooms listed for this hotel.
          </p>
        </div>
      )}
    </div>
  );
}
