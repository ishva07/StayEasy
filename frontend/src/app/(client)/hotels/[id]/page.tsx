"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelById } from "@/features/hotels/hooks/useHotelById";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Users,
  IndianRupee,
  Star,
  Wifi,
  Waves,
  ParkingCircle,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

// Small icon lookup so amenity pills can show a relevant icon when we
// recognize the name. Falls back to a generic sparkle icon otherwise.
const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi,
  "free wifi": Wifi,
  pool: Waves,
  parking: ParkingCircle,
  breakfast: UtensilsCrossed,
  restaurant: UtensilsCrossed,
  restaurants: UtensilsCrossed,
};

function AmenityIcon({ name }: { name: string }) {
  const Icon = AMENITY_ICONS[name?.toLowerCase()] ?? Sparkles;
  return <Icon className="h-3.5 w-3.5 text-primary/70" />;
}

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

  const rating = Number(hotel.rating ?? 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <button
        onClick={() => router.push("/")}
        className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Home</span>
      </button>

      {/* Hero */}
      <div className="relative h-72 md:h-80 w-full rounded-2xl overflow-hidden bg-muted">
        {heroUrl ? (
          <img src={heroUrl} alt={hotel.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        {hotel.isFeatured && (
          <div className="absolute top-0 right-0 overflow-hidden h-24 w-24">
            <div className="absolute top-[18px] right-[-34px] w-[150px] rotate-45 bg-primary text-primary-foreground text-center text-[10px] font-medium tracking-[0.2em] uppercase py-1.5 shadow-sm">
              Featured
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-start">
        {/* Left column: info, amenities, gallery */}
        <div className="space-y-6 min-w-0 w-full lg:flex-1">
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-display text-3xl font-semibold tracking-tight">
                {hotel.name}
              </h1>
              {rating > 0 && (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(rating)
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </span>
              )}
            </div>

            {hotel.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {hotel.city.name} {hotel.address && `— ${hotel.address}`}
              </p>
            )}

            <p className="text-sm text-foreground/80 leading-relaxed">
              {hotel.description}
            </p>
          </div>

          {hotel.hotelAmenities?.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase  text-secondary-foreground">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {hotel.hotelAmenities.map((ha: any) => (
                  <span
                    key={ha.amenities.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-transparent px-3 py-1.5 text-xs font-normal text-foreground/75"
                  >
                    <AmenityIcon name={ha.amenities.name} />
                    {ha.amenities.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hotel.imageGallery?.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-secondary-foreground">
                Gallery
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hotel.imageGallery.map((img: any) => (
                  <div
                    key={img.id}
                    className="aspect-square rounded-xl overflow-hidden bg-muted"
                  >
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
        </div>

        {/* Right column: available rooms */}
        <div className="space-y-4 w-full lg:w-[380px] lg:flex-shrink-0 lg:border-l lg:border-border/60 lg:pl-8">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-secondary-foreground">
              Choose your stay
            </p>
            <h2 className="font-display text-xl font-semibold">Available rooms</h2>
          </div>

          <div className="space-y-3">
            {hotel.room?.length > 0 ? (
              hotel.room.map((room: any) => {
                const roomImageUrl = room.roomImage
                  ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${room.roomImage}`
                  : "";

                return (
                  <div
                    key={room.id}
                    className="flex items-center gap-3 border border-border/60 rounded-2xl p-3 bg-card shadow-sm hover:shadow-md hover:border-border transition-all"
                  >
                    <div className="h-16 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {roomImageUrl ? (
                        <img
                          src={roomImageUrl}
                          alt={room.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-tight truncate">{room.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" /> {room.capacity}
                      </p>
                      <p className="text-sm font-semibold flex items-center text-primary mt-1">
                        <IndianRupee className="h-3 w-3" />
                        {Number(room.price).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 transition-colors"
                      onClick={() =>
                        router.push(`/hotels/${hotel.id}/rooms/${room.id}/book`)
                      }
                    >
                      Book now
                    </Button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No rooms available for this hotel.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}