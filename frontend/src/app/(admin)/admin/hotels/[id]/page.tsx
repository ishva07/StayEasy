"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelById } from "@/features/hotels/hooks/useHotelById";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Pencil,
  DoorOpen,
  MapPin,
  Building2,
  Sparkles,
  Wifi,
  Tv,
  Coffee,
  Car,
  Shield,
  Waves,
  Dumbbell,
  Utensils,
  Wind,
  Bed,
} from "lucide-react";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";

function getAmenityIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
  if (lower.includes("pool") || lower.includes("swim")) return Waves;
  if (lower.includes("gym") || lower.includes("fitness")) return Dumbbell;
  if (lower.includes("coffee") || lower.includes("breakfast") || lower.includes("cafe")) return Coffee;
  if (lower.includes("restaurant") || lower.includes("dining") || lower.includes("food")) return Utensils;
  if (lower.includes("tv") || lower.includes("screen")) return Tv;
  if (lower.includes("parking") || lower.includes("car")) return Car;
  if (lower.includes("ac") || lower.includes("air") || lower.includes("climate")) return Wind;
  if (lower.includes("security") || lower.includes("safe")) return Shield;
  if (lower.includes("bed") || lower.includes("room")) return Bed;
  return Sparkles;
}

function HotelDetailContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading } = useHotelById(id);
  const { hasPermission } = usePermission();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500 animate-pulse">Loading property dossier...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Hotel not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ---- HERO BANNER ---- */}
      <div className="relative h-[440px] sm:h-[480px] w-full rounded-3xl overflow-hidden bg-slate-950 shadow-md">
        {hotel.heroImage ? (
          <img
            src={`${hotel.heroImage}`}
            alt={hotel.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
            <Building2 className="h-20 w-20 text-slate-700/50" />
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-wrap items-center gap-1.5 sm:gap-2 z-10 p-1 sm:p-1.5 rounded-2xl sm:rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 shadow-lg max-w-[calc(100%-2rem)] justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/hotels")}
            className="text-white hover:bg-white/20 rounded-full text-xs font-medium px-3 h-7 sm:h-8 sm:px-3.5"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </Button>

          {hasPermission(PERMISSIONS.VIEW_ROOM) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/admin/hotels/${id}/rooms`)}
              className="text-white hover:bg-white/20 rounded-full text-xs font-medium px-3 h-7 sm:h-8 sm:px-3.5"
            >
              <DoorOpen className="h-3.5 w-3.5 mr-1" />
              Rooms
            </Button>
          )}

          {hasPermission(PERMISSIONS.EDIT_HOTEL) && (
            <Button
              size="sm"
              onClick={() => router.push(`/admin/hotels/${id}/edit`)}
              className="bg-white text-slate-950 hover:bg-slate-100 rounded-full text-xs font-semibold px-3.5 h-7 sm:h-8 sm:px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {/* Identity Info Overlaid at Bottom of Hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white space-y-3 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            {hotel.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/95 text-slate-950 backdrop-blur-md shadow-xs">
                <Sparkles className="h-3 w-3" />
                Featured Property
              </span>
            )}
            {hotel.propertyType?.name && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md border border-white/20">
                {hotel.propertyType.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            {hotel.name}
          </h1>

          <p className="flex items-center gap-2 text-sm text-slate-200 font-medium pt-1">
            <MapPin className="h-4 w-4 text-slate-300 shrink-0" />
            <span>{hotel.city?.name ?? "No city"} • {hotel.address}</span>
          </p>
        </div>
      </div>

      {/* ---- TWO-COLUMN DOSSIER BODY ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* LEFT COLUMN (Wider ~65%) */}
        <div className="space-y-8">
          {/* Overview / Description */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Overview & Story
            </h3>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {hotel.description || "No description provided for this property."}
            </p>
          </div>

          {/* Amenities Grid */}
          {hotel.hotelAmenities?.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Property Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.hotelAmenities.map((ha: any) => {
                  const name = ha.amenities?.name ?? "Amenity";
                  const Icon = getAmenityIcon(name);
                  return (
                    <div
                      key={ha.amenities?.id ?? name}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-800 leading-snug">
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gallery - Masonry / Featured First */}
          {hotel.imageGallery?.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Photo Gallery ({hotel.imageGallery.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {hotel.imageGallery.map((img: any, idx: number) => {
                  const isFeatured = idx === 0;
                  return (
                    <div
                      key={img.id || idx}
                      className={`relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-xs group ${
                        isFeatured ? "sm:col-span-2 sm:row-span-2 h-64 sm:h-80" : "h-36"
                      }`}
                    >
                      <img
                        src={`${img.url}`}
                        alt={`Gallery image ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Narrower ~35%) - "At a Glance" Summary Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6 sticky top-6">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                At a Glance
              </h3>
              <p className="text-xs text-slate-400 mt-1">Property details & metadata</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    City
                  </span>
                  <span className="font-semibold text-slate-900">
                    {hotel.city?.name ?? "Not specified"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Property Type
                  </span>
                  <span className="font-semibold text-slate-900">
                    {hotel.propertyType?.name ?? "Standard"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Visibility Status
                  </span>
                  <span className="font-semibold text-slate-900">
                    {hotel.isFeatured ? "Featured Listing" : "Standard Listing"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Full Address
                  </span>
                  <span className="font-medium text-slate-600 text-xs leading-relaxed block mt-0.5">
                    {hotel.address || "Address not provided"}
                  </span>
                </div>
              </div>
            </div>

            {hasPermission(PERMISSIONS.VIEW_ROOM) && (
              <div className="pt-4 border-t border-slate-100">
                <Button
                  onClick={() => router.push(`/admin/hotels/${id}/rooms`)}
                  className="w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <DoorOpen className="h-4 w-4" />
                  Manage Hotel Rooms
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_HOTEL}>
      <HotelDetailContent />
    </ProtectedRoute>
  );
}