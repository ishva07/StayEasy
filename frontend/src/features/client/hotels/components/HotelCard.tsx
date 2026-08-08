"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    city?: { id: string; name: string; images?: string } | null;
    heroImage?: string | null;
    isFeatured?: boolean;
  };
}

export function HotelCard({ hotel }: HotelCardProps) {
  const imageUrl = hotel.heroImage
    ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}`
    : null;
  const isLocalUpload = imageUrl?.includes("localhost");

  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden
                 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 w-full bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={hotel.name}
            fill
            unoptimized={isLocalUpload}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {hotel.isFeatured && (
          <div className="absolute top-3 right-3">
            <div className="bg-background/95 text-secondary-foreground text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-secondary/40">
              Featured
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-medium leading-snug truncate">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 text-secondary">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium text-foreground">5.0</span>
          </div>
        </div>

        {hotel.city && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {hotel.city.name}
          </p>
        )}
      </div>
    </Link>
  );
}