"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/features/admin/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useAddHotels } from "@/features/admin/hotel/hooks/useCreateHotel";
import { HotelForm } from "@/features/admin/hotel/components/HotelForm";
import {
  createHotelInputData,
  editHotelInputData,
} from "@/features/admin/hotel/validation/hotel.validation";

type FormInput = createHotelInputData | editHotelInputData;

function NewHotelContent() {
  const router = useRouter();
  const { addHotel, isPending } = useAddHotels();

  const handleSubmit = (data: FormInput) => {
    addHotel(data as createHotelInputData, {
      onSuccess: () => router.push("/hotels"),
    });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Add New Hotel</h1>
      <HotelForm mode="create" onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}

export default function NewHotelPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.ADD_HOTEL}>
      <NewHotelContent />
    </ProtectedRoute>
  );
}