"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    city?: { id: string; name: string; images?: string } | null;
    heroImage?: string | null;
    isFeatured?: boolean;
    avgReview?: number | null;
    reviewCount?: number | null;
  };
}

export function HotelCard({ hotel }: HotelCardProps) {
  const imageUrl = getImageUrl(hotel.heroImage);
  const isLocalUpload = imageUrl.includes("localhost");
  const avgRating = Number(hotel.avgReview ?? 0);
  const reviewCount = Number(hotel.reviewCount ?? 0);

  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group block rounded-2xl overflow-hidden bg-card shadow-sm
                 transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Photo + overlaid title block — one composition, not two */}
      <div className="relative h-64 w-full bg-muted overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={hotel.name}
            fill
            unoptimized={isLocalUpload}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {/* Scrim for legibility — always on, not just hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

        {hotel.isFeatured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
            Featured
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-xs font-bold text-white">
            {avgRating > 0 ? avgRating.toFixed(1) : "New"}
          </span>
          {reviewCount > 0 && (
            <span className="text-[10px] text-white/70">({reviewCount})</span>
          )}
        </div>

        {/* Title sits on the photo — no separate stacked block */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {hotel.city && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block w-4 h-[2px] bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                {hotel.city.name}
              </span>
            </div>
          )}
          <h3 className="font-display text-lg font-black leading-tight text-white truncate">
            {hotel.name}
          </h3>
        </div>
      </div>

      {/* Solid utility bar — meta + CTA, high contrast against the photo above */}
      <div className="flex items-center justify-between px-4 py-3 bg-foreground">
        <span className="text-xs font-medium text-background/60">
          {reviewCount > 0 ? `${reviewCount} reviews` : "Explore rooms"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-foreground bg-primary px-3.5 py-1.5 rounded-md transition group-hover:brightness-110">
          View
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}