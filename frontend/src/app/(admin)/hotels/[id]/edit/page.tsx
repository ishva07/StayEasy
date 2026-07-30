"use client";

import { useRouter, useParams } from "next/navigation";
import { HotelForm } from "@/features/admin/hotel/components/HotelForm";
import { useHotelById } from "@/features/admin/hotel/hooks/useHotelById";
import { useEditHotels } from "@/features/admin/hotel/hooks/useEditHotel";
import { useUpdateHotelAmenities } from "@/features/admin/hotelAmenities/hooks/useHotelAmenities.hooks";
import { useUpdateHotelImageGallery } from "@/features/admin/hotelImageGallery/hooks/useUpdateHotelImageGallery.hook";
import { editHotelInputData } from "@/features/admin/hotel/validation/hotel.validation";

export default function EditHotelPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: hotel, isLoading } = useHotelById(id);

  const { editHotel, isPending: isEditingBasic } = useEditHotels();
  const { updateAmenities, isPending: isEditingAmenities } = useUpdateHotelAmenities();
  const { updateImageGallery, isPending: isEditingImages } = useUpdateHotelImageGallery();

  const isSubmitting = isEditingBasic || isEditingAmenities || isEditingImages;

  const handleSubmit = (data: editHotelInputData) => {
    editHotel(
      {
        hotelId: id,
        data: {
          name: data.name,
          description: data.description,
          city: data.city,
          address: data.address,
          isFeatured: data.isFeatured,
          heroImage: data.heroImage, // undefined agar user ne nahi badla — service already guard karti hai
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
          router.push("/hotels");
        },
      }
    );
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading hotel...</p>;
  if (!hotel) return <p className="text-sm text-muted-foreground">Hotel not found.</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Edit Hotel</h1>
      <HotelForm
        mode="edit"                                                          // ✅ dynamic resolver trigger
        defaultValues={{
          name: hotel.name,
          description: hotel.description,
          city: hotel.city,
          address: hotel.address,
          isFeatured: hotel.isFeatured,
          amenitiesIds: hotel.hotelAmenities?.map((ha: any) => ha.amenitiesId) ?? [], // ✅ prefill checked
        }}
        initialHeroImageUrl={
          hotel.heroImage ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}` : null
        } // ✅ hero preview
        initialGalleryUrls={
          hotel.imageGallery?.map((img: any) => `${process.env.NEXT_PUBLIC_UPLOADS_URL}${img.url}`) ?? []
        } // ✅ gallery preview
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Update Hotel"
      />
    </div>
  );
}