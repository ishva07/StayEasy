"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HotelForm } from "@/features/admin/hotel/components/HotelForm";
import { useHotelById } from "@/features/hotels/hooks/useHotelById";
import { useEditHotels } from "@/features/admin/hotel/hooks/useEditHotel";
import { useUpdateHotelAmenities } from "@/features/admin/hotelAmenities/hooks/useHotelAmenities.hooks";
import { useUpdateHotelImageGallery } from "@/features/admin/hotelImageGallery/hooks/useUpdateHotelImageGallery.hook";
import { editHotelInputData } from "@/features/admin/hotel/validation/hotel.validation";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";

export function EditHotelContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: hotel, isLoading } = useHotelById(id);

  const { editHotel, isPending: isEditingBasic } = useEditHotels();
  const { updateAmenities, isPending: isEditingAmenities } = useUpdateHotelAmenities();
  const { updateImageGallery, isPending: isEditingImages } = useUpdateHotelImageGallery();

  const isSubmitting = isEditingBasic || isEditingAmenities || isEditingImages;

  const defaultValues = useMemo(
    () => ({
      name: hotel?.name ?? "",
      description: hotel?.description ?? "",
      cityId: hotel?.city?.id ?? "",
      propertyTypeId: hotel?.propertyType?.id ?? "",
      address: hotel?.address ?? "",
      isFeatured: hotel?.isFeatured ?? false,
      amenitiesIds: hotel?.hotelAmenities?.map((ha: any) => ha.amenitiesId) ?? [],
    }),
    [hotel],
  );

  const initialGalleryUrls = useMemo(
    () =>
      hotel?.imageGallery?.map(
        (img: any) => `${img.url}`,
      ) ?? [],
    [hotel?.imageGallery],
  );

  const handleSubmit = (data: editHotelInputData) => {
    editHotel(
      {
        hotelId: id,
        data: {
          name: data.name,
          description: data.description,
          cityId: data.cityId,
          propertyTypeId: data.propertyTypeId,
          address: data.address,
          isFeatured: data.isFeatured,
          heroImage: data.heroImage,
        },
      },
      {
        onSuccess: () => {
          if (data.amenitiesIds?.length) {
            updateAmenities({ hotelId: id, data: { amenitiesId: data.amenitiesIds } });
          }
          if (data.imageGallery?.length) {
            updateImageGallery({ hotelId: id, data: { imageGallery: data.imageGallery } });
          }
          router.push("/admin/hotels");
        },
      },
    );
  };

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading hotel...</p>;
  if (!hotel)
    return <p className="text-sm text-muted-foreground">Hotel not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Edit Hotel</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/hotels")}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>
        
      </div>
      <HotelForm
        mode="edit"
        defaultValues={defaultValues}
        initialHeroImageUrl={
          hotel.heroImage ? `${hotel.heroImage}` : null
        }
        initialGalleryUrls={initialGalleryUrls}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Update Hotel"
      />
    </div>
  );
}

export default function EditHotelPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.EDIT_HOTEL}>
      <EditHotelContent />
    </ProtectedRoute>
  );
}
