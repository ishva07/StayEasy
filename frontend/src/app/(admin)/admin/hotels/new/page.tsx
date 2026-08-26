"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
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
      onSuccess: () => router.push("/admin/hotels"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
       
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Add New Hotel</h1>

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