"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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
        (img: any) => `${process.env.NEXT_PUBLIC_UPLOADS_URL}${img.url}`,
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
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Edit Hotel</h1>
      <HotelForm
        mode="edit"
        defaultValues={defaultValues}
        initialHeroImageUrl={
          hotel.heroImage ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}` : null
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
