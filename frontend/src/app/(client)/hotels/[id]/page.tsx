"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelById } from "@/features/hotels/hooks/useHotelById";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, IndianRupee } from "lucide-react";

export default function HotelDetailsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading } = useHotelById(id);

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
  }

  if (!hotel) {
    return <p className="p-6 text-sm text-muted-foreground">Hotel not found.</p>;
  }

  const heroUrl = hotel.heroImage
    ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}`
    : "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to search
      </Button>

      <div className="relative h-72 w-full rounded-xl overflow-hidden bg-muted">
        {heroUrl ? (
          <img src={heroUrl} alt={hotel.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        {hotel.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
            Featured
          </Badge>
        )}
      </div>

      {/* Basic info */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{hotel.name}</h1>
        {hotel.city && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {hotel.city} {hotel.address && `— ${hotel.address}`}
          </p>
        )}
        <p className="text-sm text-foreground/80">{hotel.description}</p>
      </div>

      {/* Amenities */}
      {hotel.hotelAmenities?.length > 0 && (
        <div>
          <h2 className="font-medium mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {hotel.hotelAmenities.map((ha: any) => (
              <Badge key={ha.amenities.id} variant="secondary">
                {ha.amenities.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hotel.imageGallery?.length > 0 && (
        <div>
          <h2 className="font-medium mb-2">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {hotel.imageGallery.map((img: any) => (
              <div key={img.id} className="h-24 rounded-md overflow-hidden bg-muted">
                <img
                  src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${img.url}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rooms */}
      <div>
        <h2 className="font-medium mb-3">Available Rooms</h2>
        <div className="space-y-3">
          {hotel.room?.length > 0 ? (
            hotel.room.map((room: any) => {
              const roomImageUrl = room.roomImage
                ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${room.roomImage}`
                : "";

              return (
                <div
                  key={room.id}
                  className="flex items-center gap-4 border border-border rounded-lg p-3"
                >
                  <div className="h-20 w-28 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {roomImageUrl ? (
                      <img src={roomImageUrl} alt={room.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{room.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Up to {room.capacity} guests
                    </p>
                    <p className="text-sm font-semibold flex items-center gap-1 mt-1">
                      <IndianRupee className="h-3 w-3" /> {Number(room.price).toLocaleString()} / night
                    </p>
                  </div>

                  <Button onClick={() => router.push(`/hotels/${hotel.id}/rooms/${room.id}/book`)}>
                    Book Now
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No rooms available for this hotel.</p>
          )}
        </div>
      </div>
    </div>
  );
}