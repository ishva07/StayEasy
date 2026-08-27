"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelById } from "@/features/hotels/hooks/useHotelById";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/features/client/reviews/components/RatingStars";
import { ReviewList } from "@/features/client/reviews/components/ReviewList";
import { RoomCard } from "@/features/client/hotels/components/RoomCard";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Users,
  IndianRupee,
  Wifi,
  Waves,
  ParkingCircle,
  UtensilsCrossed,
  Sparkles,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { ReviewsModal } from "@/features/client/reviews/components/ReviewsModal";

const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi,
  "free wifi": Wifi,
  pool: Waves,
  swimming: Waves,
  "swimming pool": Waves,
  parking: ParkingCircle,
  "free parking": ParkingCircle,
  breakfast: UtensilsCrossed,
  restaurant: UtensilsCrossed,
  dining: UtensilsCrossed,
};

function AmenityIcon({ name }: { name: string }) {
  const Icon = AMENITY_ICONS[name?.toLowerCase()] ?? Sparkles;
  return <Icon className="h-5 w-5 text-primary" />;
}

export default function HotelDetailsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading } = useHotelById(id);

  const [showReviewsModal, setShowReviewsModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading boutique stay details...
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

  const heroUrl = hotel.heroImage;
  const avgRating = Number(hotel.avgReview ?? hotel.avgRating ?? 0);
  const reviewCount = Number(hotel.reviewCount ?? 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ---- FULL-BLEED IMMERSIVE HERO BANNER ---- */}
      <div className="relative h-[460px] sm:h-[520px] md:h-[560px] w-full rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-border/40">
        {heroUrl ? (
          <img
            src={heroUrl}
            alt={hotel.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-500">
            <Building2 className="h-24 w-24 text-slate-700/50" />
          </div>
        )}

        {/* Bottom Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

        {/* Floating Back Button (Top-Left) */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 z-10 group inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:bg-black/60 hover:border-white/50"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Stays</span>
        </button>

        {/* Floating Featured Badge (Top-Right) */}
        {hotel.isFeatured && (
          <div className="absolute top-6 right-6 z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 shadow-lg backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Featured Stay
          </div>
        )}

        {/* Identity Info Overlaid at Bottom of Hero Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white space-y-3 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              <RatingStars rating={avgRating} size={14} />
              <span className="font-bold text-white ml-1">
                {avgRating > 0 ? avgRating.toFixed(1) : "New"}
              </span>
              {reviewCount > 0 && (
                <span className="text-white/80">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            {hotel.name}
          </h1>

          {hotel.city && (
            <p className="text-sm sm:text-base text-slate-200 font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-foreground/90 shrink-0" />
              <span>
                {hotel.city.name} {hotel.address && `— ${hotel.address}`}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ---- TWO-COLUMN BOUTIQUE LAYOUT ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-12">
        {/* LEFT COLUMN: Overview, Amenities, Gallery, Reviews (~65%) */}
        <div className="space-y-10 min-w-0">
          {/* Overview */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
              About this Stay
            </h2>
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-normal">
              {hotel.description}
            </p>
          </div>

          {/* Amenities Icon Grid */}
          {hotel.hotelAmenities?.length > 0 && (
            <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
                Popular Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {hotel.hotelAmenities.map((ha: any) => (
                  <div
                    key={ha.amenities.id}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/60 bg-accent/40 text-center gap-2.5 hover:border-primary/40 hover:bg-accent/70 transition-all"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <AmenityIcon name={ha.amenities.name} />
                    </div>
                    <span className="text-xs font-semibold text-foreground leading-tight">
                      {ha.amenities.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery - Masonry Lightbox Strip */}
          {hotel.imageGallery?.length > 0 && (
            <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
                  Property Gallery ({hotel.imageGallery.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {hotel.imageGallery.map((img: any, idx: number) => {
                  const isFeatured = idx === 0;
                  return (
                    <div
                      key={img.id || idx}
                      className={`relative rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-xs group ${
                        isFeatured ? "sm:col-span-2 sm:row-span-2 h-64 sm:h-80" : "h-36"
                      }`}
                    >
                      <img
                        src={`${img.url}`}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Guest Reviews Section */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
                Guest Experience
              </h2>
            </div>

            {reviewCount > 0 ? (
              <div className="flex items-center gap-6 rounded-2xl border border-border/60 bg-accent/30 p-6">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-primary text-primary-foreground px-6 py-4 flex-shrink-0 shadow-md">
                  <p className="font-display text-4xl font-extrabold leading-none">
                    {avgRating.toFixed(1)}
                  </p>
                  <div className="mt-1.5">
                    <RatingStars rating={avgRating} size={14} />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">
                    {reviewCount} {reviewCount === 1 ? "Verified Review" : "Verified Reviews"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Authentic feedback from real guests who stayed at {hotel.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center">
                <p className="text-sm font-semibold text-foreground">No reviews yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Be the first guest to share your experience at this stay.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <ReviewList hotelId={hotel.id} limit={3} />
            </div>

            {reviewCount > 3 && (
              <button
                onClick={() => setShowReviewsModal(true)}
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                Read all {reviewCount} reviews &rarr;
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Persistent Room Booking Panel (~35%) */}
        <div className="w-full lg:w-[380px] lg:flex-shrink-0">
          <div className="sticky top-24 rounded-3xl border border-border/70 bg-card p-6 shadow-xl space-y-6 border-t-4 border-t-primary">
            <div className="space-y-1 pb-4 border-b border-border/60">
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
                Reserve Your Stay
              </p>
              <h2 className="font-display text-xl font-bold text-foreground">
                Available Rooms
              </h2>
            </div>

            <div className="space-y-4">
              {hotel.room?.length > 0 ? (
                <>
                  {hotel.room.slice(0, 3).map((room: any) => (
                    <RoomCard key={room.id} room={room} hotelId={hotel.id} />
                  ))}
                  {hotel.room.length > 3 && (
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/hotels/${hotel.id}/rooms`)}
                      className="w-full h-11 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <span>View all {hotel.room.length} rooms</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No rooms currently available for online booking.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReviewsModal && (
        <ReviewsModal
          hotelId={hotel.id}
          hotelName={hotel.name}
          onClose={() => setShowReviewsModal(false)}
        />
      )}
    </div>
  );
}
