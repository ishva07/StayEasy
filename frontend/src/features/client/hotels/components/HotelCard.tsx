"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    city?: string | null;
    heroImage?: string | null;
    isFeatured?: boolean;
  };
}

export function HotelCard({ hotel }: HotelCardProps) {
  const imageUrl = hotel.heroImage
    ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}`
    : "";

  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group block rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow bg-card"
    >
      <div className="relative h-44 w-full bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hotel.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        {hotel.isFeatured && (
          <span className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" /> Featured
          </span>
        )}
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-sm truncate">{hotel.name}</h3>
        {hotel.city && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {hotel.city}
          </p>
        )}
      </div>
    </Link>
  );
}