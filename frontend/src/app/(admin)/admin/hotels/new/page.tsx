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
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Add New Hotel</h1>
            <p className="mt-2 text-sm text-slate-500">Create a new hotel listing in your inventory.</p>
          </div>
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
      </section>
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