"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelById } from "@/features/hotels/hooks/useHotelById";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowLeft, Pencil } from "lucide-react";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";

function HotelDetailContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading } = useHotelById(id);
  const { hasPermission } = usePermission();

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (!hotel)
    return <p className="text-sm text-muted-foreground">Hotel not found.</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/hotels")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          {hasPermission(PERMISSIONS.VIEW_ROOM) && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/hotels/${id}/rooms`)}>
              View Rooms
            </Button>
          )}
          {hasPermission(PERMISSIONS.EDIT_HOTEL) && (
            <Button size="sm" onClick={() => router.push(`/admin/hotels/${id}/edit`)}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>

      {hotel.heroImage && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden bg-muted">
          <img
            src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}`}
            alt={hotel.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{hotel.name}</h1>
          {hotel.isFeatured && <Badge>Featured</Badge>}
        </div>
        <p className="text-muted-foreground">
  {hotel.city?.name ?? "No city"} — {hotel.address}
</p>
<div className="flex items-center gap-2 flex-wrap">
  <h1 className="text-2xl font-semibold">{hotel.name}</h1>
  {hotel.isFeatured && <Badge>Featured</Badge>}
  {hotel.propertyType?.name && <Badge variant="outline">{hotel.propertyType.name}</Badge>}
</div>
        <p className="text-sm">{hotel.description}</p>
      </div>

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
          <div className="grid grid-cols-3 gap-2">
            {hotel.imageGallery.map((img: any) => (
              <div key={img.id} className="relative h-24 rounded-md overflow-hidden bg-muted">
                <Image
                  src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${img.url}`}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
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